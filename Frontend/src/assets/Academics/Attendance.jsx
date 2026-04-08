import React, { useEffect, useState } from "react";
import axios from "axios";

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/attendance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAttendance(res.data.attendance);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="mb-4">Attendance</h2>

      <div className="card p-3">
        <table className="table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Total Classes</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Late</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No data available
                </td>
              </tr>
            ) : (
              attendance.map((a, index) => (
                <tr key={index}>
                  <td>{a.course_name}</td>
                  <td>{a.total_classes}</td>
                  <td>{a.present}</td>
                  <td>{a.absent}</td>
                  <td>{a.late}</td>
                  <td>
                    <span
                      className={`badge ${
                        a.attendance_percent >= 75
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {a.attendance_percent}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Attendance;