const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

/* ───────── DB CONNECTION ───────── */
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  }
  console.log("Connected to MySQL");
});

/* ───────── AUTH MIDDLEWARE ───────── */
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(403).json({ message: "No token provided" });

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/* ───────── LOGIN (NO HASHING) ───────── */
app.post("/login", (req, res) => {
  const { rollNo, password } = req.body;

  if (!rollNo || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing credentials" });
  }

  const sql = "SELECT * FROM Students WHERE roll_no = ?";
  db.query(sql, [rollNo], (err, result) => {
    if (err)
      return res.status(500).json({ success: false, message: "DB error" });

    if (result.length === 0)
      return res
        .status(401)
        .json({ success: false, message: "User not found" });

    const user = result[0];

    if (password !== user.password)
      return res
        .status(401)
        .json({ success: false, message: "Wrong password" });

    const token = jwt.sign(
      { rollNo: user.roll_no, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ success: true, token });
  });
});

/* ───────── PROFILE ───────── */
app.get("/dashboard/profile", verifyToken, (req, res) => {
  const sql = `
    SELECT roll_no, name, email, phone, department, year, residence_type, transport_type
    FROM Students
    WHERE roll_no = ?
  `;

  db.query(sql, [req.user.rollNo], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json({ student: result[0] });
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
    if (err) return res.status(500).json({ message: "DB error" });
    res.json({ courses: result });
  });
});

/* ───────── ATTENDANCE ───────── */
app.get("/attendance", verifyToken, (req, res) => {
  const sql = `
    SELECT 
      a.course_code,
      c.course_name,
      COUNT(*) AS total_classes,
      SUM(a.status = 'Present') AS present,
      SUM(a.status = 'Absent') AS absent,
      SUM(a.status = 'Late') AS late,
      ROUND(SUM(a.status = 'Present') / COUNT(*) * 100, 2) AS attendance_percent
    FROM Attendance a
    JOIN Courses c ON a.course_code = c.course_code
    WHERE a.student_roll_no = ?
    GROUP BY a.course_code, c.course_name
  `;

  db.query(sql, [req.user.rollNo], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json({ attendance: result });
  });
});

/* ───────── RESULTS ───────── */
app.get("/results", verifyToken, (req, res) => {
  const sql = `
    SELECT 
      r.course_code,
      c.course_name,
      r.internal_marks,
      r.external_marks,
      (r.internal_marks + r.external_marks) AS total_marks,
      r.grade
    FROM Results r
    JOIN Courses c ON r.course_code = c.course_code
    WHERE r.student_roll_no = ?
  `;

  db.query(sql, [req.user.rollNo], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json({ results: result });
  });
});

/* ───────── FEES ───────── */
app.get("/fees", verifyToken, (req, res) => {
  const sql = `
    SELECT id, amount, type, status, due_date, notes
    FROM Fees
    WHERE student_roll_no = ?
    ORDER BY due_date DESC
  `;

  db.query(sql, [req.user.rollNo], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json({ fees: result });
  });
});

/* ───────── NOTICES ───────── */
app.get("/notices", verifyToken, (req, res) => {
  const sql = `
    SELECT title, content, created_at
    FROM Notices
    ORDER BY created_at DESC
    LIMIT 5
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json({ notices: result });
  });
});

/* ───────── SERVER ───────── */
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});