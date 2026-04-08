import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [profile, setProfile] = useState({});
  const [attendance, setAttendance] = useState([]);
  const [courses, setCourses] = useState([]);
  const [notices, setNotices] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    // profile
    axios.get("http://localhost:5000/dashboard/profile", { headers })
      .then(res => setProfile(res.data.student));

    // attendance
    axios.get("http://localhost:5000/attendance", { headers })
      .then(res => setAttendance(res.data.attendance));

    // courses
    axios.get("http://localhost:5000/courses", { headers })
      .then(res => setCourses(res.data.courses));

    // notices
    axios.get("http://localhost:5000/notices", { headers })
      .then(res => setNotices(res.data.notices));
  }, []);

  const overallAttendance =
    attendance.length > 0
      ? Math.round(
          attendance.reduce((acc, cur) => acc + cur.attendance_percent, 0) /
            attendance.length
        )
      : 0;

  return (
    <div className="bg-light min-vh-100 d-flex">

      {/* Sidebar */}
      <div className="p-3 border-end" style={{ width: "250px" }}>
        <h4>EduBase</h4>
        <ul className="list-unstyled mt-4">
          <li className="mb-3">Attendance</li>
          <li className="mb-3">Notes</li>
          <li className="mb-3">Assignments</li>
          <li className="mb-3">Quizzes</li>
        </ul>
      </div>

      {/* Main */}
      <div className="flex-grow-1 p-4">

        <h2>Welcome to Academics</h2>

        {/* Cards */}
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card p-3">
              <h6>Overall Attendance</h6>
              <h2>{overallAttendance}%</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3">
              <h6>Courses</h6>
              <h2>{courses.length}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3">
              <h6>Notifications</h6>
              <h2>{notices.length}</h2>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card mt-4 p-3">
          <h5>Recent Courses</h5>
          {courses.map((c, i) => (
            <div key={i} className="border-bottom py-2">
              {c.course_name} - {c.faculty_name}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;