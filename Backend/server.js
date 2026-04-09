const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

/* ───────── MYSQL ───────── */
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("MySQL error:", err.message);
    process.exit(1);
  }
  console.log("MySQL Connected");
});

/* ───────── MONGODB ───────── */
mongoose.connect("mongodb://127.0.0.1:27017/erp")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* ───────── SCHEMAS ───────── */

const Assignment = mongoose.model("Assignment", new mongoose.Schema({
  course_code: String,
  title: String,
  description: String,
  instructions: String,
  due_date: String,
  faculty_name: String,
}));

const Submission = mongoose.model("Submission", new mongoose.Schema({
  student_roll_no: String,
  course_code: String,
  file_path: String,
  submitted_at: Date,
  status: String,
}));

const QuizResult = mongoose.model("QuizResult", new mongoose.Schema({
  student_roll_no: String,
  course_code: String,
  marks: Number,
  total: Number,
  submitted_at: Date,
}));

/* ───────── FILE UPLOAD ───────── */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));

/* ───────── AUTH ───────── */
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "No token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

/* ───────── LOGIN ───────── */
app.post("/login", (req, res) => {
  const { rollNo, password } = req.body;

  db.query("SELECT * FROM Students WHERE roll_no=?", [rollNo], (err, result) => {
    if (err) return res.status(500).json({ success: false });

    if (!result.length)
      return res.status(401).json({ success: false, message: "User not found" });

    if (password !== result[0].password)
      return res.status(401).json({ success: false, message: "Wrong password" });

    const token = jwt.sign({ rollNo: result[0].roll_no }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  });
});

/* ───────── COURSES ───────── */
app.get("/courses", verifyToken, (req, res) => {
  const sql = `
    SELECT c.course_code, c.course_name, f.name AS faculty_name
    FROM Enrollments e
    JOIN Courses c ON e.course_code = c.course_code
    JOIN Faculty f ON c.faculty_email = f.email
    WHERE e.student_roll_no = ?
  `;
  db.query(sql, [req.user.rollNo], (err, result) => {
    res.json({ courses: result });
  });
});

/* ───────── ATTENDANCE (FIXED) ───────── */
app.get("/attendance", verifyToken, (req, res) => {
  const sql = `
    SELECT 
      c.course_code,
      c.course_name,
      COUNT(a.status) AS total_classes,
      SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present_count,
      ROUND(
        (SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) / COUNT(a.status)) * 100,
        2
      ) AS attendance_percent
    FROM Attendance a
    JOIN Courses c ON a.course_code = c.course_code
    WHERE a.student_roll_no = ?
    GROUP BY c.course_code, c.course_name
  `;

  db.query(sql, [req.user.rollNo], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "DB error" });
    }

    res.json({ attendance: result });
  });
});

/* ───────── ASSIGNMENTS ───────── */

// details
app.get("/assignment/details/:course", verifyToken, async (req, res) => {
  const data = await Assignment.findOne({ course_code: req.params.course });
  res.json({ assignment: data });
});

// check submission
app.get("/assignment/submission/:course", verifyToken, async (req, res) => {
  const sub = await Submission.findOne({
    student_roll_no: req.user.rollNo,
    course_code: req.params.course,
  });

  if (!sub) return res.json({ submitted: false });

  res.json({ submitted: true, data: sub });
});

// submit
app.post("/assignment/submit/:course", verifyToken, upload.single("file"), async (req, res) => {
  const existing = await Submission.findOne({
    student_roll_no: req.user.rollNo,
    course_code: req.params.course,
  });

  if (existing) return res.json({ message: "Already submitted" });

  const assignment = await Assignment.findOne({ course_code: req.params.course });

  const now = new Date();
  const due = new Date(assignment.due_date);

  const status = now <= due ? "Submitted On Time" : "Submitted Late";

  await Submission.create({
    student_roll_no: req.user.rollNo,
    course_code: req.params.course,
    file_path: req.file.path,
    submitted_at: now,
    status,
  });

  res.json({ status });
});

// delete
app.delete("/assignment/delete/:course", verifyToken, async (req, res) => {
  const sub = await Submission.findOne({
    student_roll_no: req.user.rollNo,
    course_code: req.params.course,
  });

  if (!sub) return res.json({ message: "No submission" });

  if (fs.existsSync(sub.file_path)) fs.unlinkSync(sub.file_path);

  await Submission.deleteOne({ _id: sub._id });

  res.json({ message: "Deleted" });
});

/* ───────── QUIZ ───────── */

// get quiz
app.get("/quiz/:course", verifyToken, async (req, res) => {
  const quiz = await mongoose.connection
    .collection("quizzes")
    .findOne({ course_code: req.params.course });

  res.json({ quiz });
});

// check attempt
app.get("/quiz/check/:course", verifyToken, async (req, res) => {
  const result = await QuizResult.findOne({
    student_roll_no: req.user.rollNo,
    course_code: req.params.course,
  });

  res.json({ attempted: !!result, result });
});

// submit
app.post("/quiz/submit/:course", verifyToken, async (req, res) => {
  const { answers } = req.body;

  const existing = await QuizResult.findOne({
    student_roll_no: req.user.rollNo,
    course_code: req.params.course,
  });

  if (existing) {
    return res.json({ message: "Already attempted", result: existing });
  }

  const quiz = await mongoose.connection
    .collection("quizzes")
    .findOne({ course_code: req.params.course });

  let score = 0;

  quiz.questions.forEach((q, i) => {
    if (answers[i] === q.correct) score++;
  });

  const result = await QuizResult.create({
    student_roll_no: req.user.rollNo,
    course_code: req.params.course,
    marks: score,
    total: quiz.questions.length,
    submitted_at: new Date(),
  });

  res.json(result);
});



app.get("/attendance/details/:course", verifyToken, (req, res) => {
  const sql = `
    SELECT date, status
    FROM Attendance
    WHERE student_roll_no = ? AND course_code = ?
    ORDER BY date DESC
  `;

  db.query(sql, [req.user.rollNo, req.params.course], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });

    res.json({ details: result });
  });
});

app.get("/room", verifyToken, (req, res) => {

  // ✅ ADD THIS BLOCK HERE
  db.query(
    "SELECT residence_type FROM Students WHERE roll_no=?",
    [req.user.rollNo],
    (err, student) => {
      if (student[0].residence_type !== "Hostel") {
        return res.json({ room: null });
      }

      // 👇 KEEP YOUR ORIGINAL CODE INSIDE HERE
      const sql = `
        SELECT 
          h.hostel_name,
          r.room_no,
          r.capacity,
          r.occupied_count,
          h.warden_name,
          h.warden_contact
        FROM RoomAllocations ra
        JOIN Rooms r 
          ON ra.room_no = r.room_no AND ra.hostel_id = r.hostel_id
        JOIN Hostels h 
          ON h.hostel_id = r.hostel_id
        WHERE ra.student_roll_no = ?
      `;

      db.query(sql, [req.user.rollNo], (err, result) => {
        if (err) return res.status(500).json({ message: "DB error" });

        if (result.length === 0) {
          return res.json({ room: null });
        }

        res.json({ room: result[0] });
      });
    }
  );
});



// complaint

const Complaint = mongoose.model("Complaint", new mongoose.Schema({
  student_roll_no: String,
  text: String,
  status: { type: String, default: "Pending" }, // Pending / Resolved
  created_at: { type: Date, default: Date.now }
}));

app.post("/complaints", verifyToken, async (req, res) => {
  const { text } = req.body;

  const complaint = await Complaint.create({
    student_roll_no: req.user.rollNo,
    text,
  });

  res.json({ complaint });
});

app.get("/complaints", verifyToken, async (req, res) => {
  const data = await Complaint.find({
    student_roll_no: req.user.rollNo,
  }).sort({ created_at: -1 });

  res.json({ complaints: data });
});

app.delete("/complaints/:id", verifyToken, async (req, res) => {
  await Complaint.deleteOne({
    _id: req.params.id,
    student_roll_no: req.user.rollNo,
  });

  res.json({ message: "Deleted" });
});


// hostel payment


app.post("/hostel/pay", verifyToken, (req, res) => {
  const { roomType, extraAmount, remark, method } = req.body;

  const hostel_id = 1;
  const room_no = roomType === "2" ? "101" : "102";
  const baseAmount = roomType === "2" ? 60000 : 50000;
  const total = baseAmount + Number(extraAmount || 0);

  // allocation
  db.query(
    "INSERT INTO RoomAllocations (student_roll_no, room_no, hostel_id, start_date) VALUES (?,?,?,CURDATE())",
    [req.user.rollNo, room_no, hostel_id]
  );

  // fees
  db.query(
    "INSERT INTO Fees (student_roll_no, amount, type, status, notes, due_date) VALUES (?,?,?,?,?,CURDATE())",
    [req.user.rollNo, total, "hostel", "paid", remark]
  );

  // ✅ send receipt data
  res.json({
    receipt: {
      roll_no: req.user.rollNo,
      room_no,
      hostel_id,
      amount: total,
      method,
      remark,
      date: new Date(),
    },
  });
});


const handlePay = (method) => {
  axios
    .post(
      `${API}/hostel/pay`,
      {
        roomType,
        extraAmount: extra,
        remark,
        method,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((res) => {
      setReceipt(res.data.receipt); // ✅ store receipt
      setPaymentStep(false);
    });
};


// eventt

const Event = mongoose.model("Event", new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  location: String,
  created_at: { type: Date, default: Date.now }
}));

app.get("/events", async (req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.json({ events });
});

app.post("/events", async (req, res) => {
  const { title, description, date, location } = req.body;

  const event = await Event.create({
    title,
    description,
    date,
    location
  });

  res.json({ event });
});


// bus data fetching

app.get("/bus/info", verifyToken, (req, res) => {
  const sql = `
    SELECT s.name, s.roll_no, s.transport_type
    FROM Students s
    WHERE s.roll_no = ?
  `;

  db.query(sql, [req.user.rollNo], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });

    if (result[0].transport_type !== "Bus") {
      return res.json({ isBusUser: false });
    }

    res.json({
      isBusUser: true,
      student: result[0],
    });
  });
});


app.post("/bus/calculate", (req, res) => {
  const { distance } = req.body;

  let amount = 0;
  if (distance <= 5) amount = 10000;
  else if (distance <= 10) amount = 15000;
  else amount = 20000;

  res.json({ amount });
});


app.post("/bus/pay", verifyToken, (req, res) => {
  const { amount, remark, method } = req.body;

  db.query(
    "INSERT INTO Fees (student_roll_no, amount, type, status, notes, due_date) VALUES (?,?,?,?,?,CURDATE())",
    [req.user.rollNo, amount, "bus", "paid", remark]
  );

  res.json({
    receipt: {
      roll_no: req.user.rollNo,
      amount,
      method,
      remark,
      date: new Date(),
    },
  });
});









/* ───────── START SERVER ───────── */
app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});