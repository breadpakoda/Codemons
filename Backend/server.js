const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// DB Connection
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

// ─── Auth Middleware ─────────────────────────────
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "No token" });

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// ─── LOGIN (NO HASHING) ─────────────────────────
app.post("/login", (req, res) => {
  const { rollNo, password } = req.body;

  if (!rollNo || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Roll number and password are required" });
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

    // ❗ plain password check
    const isMatch = password === user.password;

    if (!isMatch)
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

// ─── PROFILE ───────────────────────────────────
app.get("/dashboard/profile", verifyToken, (req, res) => {
  const sql = `
    SELECT roll_no, name, email, phone, department, year, residence_type, transport_type
    FROM Students
    WHERE roll_no = ?
  `;

  db.query(sql, [req.user.rollNo], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (result.length === 0)
      return res.status(404).json({ message: "Student not found" });

    res.json({ student: result[0] });
  });
});

// ─── ATTENDANCE ────────────────────────────────
app.get("/attendance", verifyToken, (req, res) => {
  const sql = `
    SELECT 
      a.course_code,
      c.course_name,
      COUNT(*) AS total_classes,
      SUM(a.status = 'Present') AS present,
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

// ─── RESULTS ───────────────────────────────────
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

// ─── FEES ──────────────────────────────────────
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

// ─── START SERVER ──────────────────────────────
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});