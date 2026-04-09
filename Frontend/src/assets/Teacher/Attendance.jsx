import React, { useEffect, useState } from "react";
import axios from "axios";

function Attendance() {
  const [students, setStudents] = useState([]);
  const [course, setCourse] = useState("CS101");
  const [date, setDate] = useState("");
  const [records, setRecords] = useState([]);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("teacherToken");

  const headers = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // ================= FETCH STUDENTS =================
  useEffect(() => {
    axios
      .get(`${API}/teacher/students`, headers) // ✅ FIXED API
      .then((res) => {
        setStudents(res.data.students);

        // initialize records
        const initial = res.data.students.map((s) => ({
          roll: s.roll_no,
          status: "Present",
        }));

        setRecords(initial);
      })
      .catch((err) => {
        console.log(err.response?.data || err.message); // ✅ DEBUG
        alert("Error loading students");
      });
  }, []);

  // ================= HANDLE CHANGE =================
  const changeStatus = (i, value) => {
    const newRecords = [...records];
    newRecords[i].status = value;
    setRecords(newRecords);
  };

  // ================= SAVE =================
  const saveAttendance = () => {
    if (!date) return alert("Select date");

    axios
      .post(
        `${API}/teacher/attendance`,
        {
          course_code: course,
          date,
          records,
        },
        headers
      )
      .then(() => alert("Attendance Saved"))
      .catch((err) => {
        console.log(err.response?.data || err.message);
        alert("Error saving");
      });
  };

  return (
    <div>
      <h3>Mark Attendance</h3>

      {/* COURSE + DATE */}
      <div className="d-flex gap-2 mb-3">
        <select
          className="form-control"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        >
          <option value="CS101">CS101</option>
          <option value="CS102">CS102</option>
        </select>

        <input
          type="date"
          className="form-control"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <table className="table">
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s, i) => (
            <tr key={s.roll_no}>
              <td>{s.roll_no}</td>

              <td>
                <input
                  type="checkbox"
                  checked={records[i]?.status === "Present"}
                  onChange={(e) =>
                    changeStatus(
                      i,
                      e.target.checked ? "Present" : "Absent"
                    )
                  }
                />
                <span className="ms-2">
                  {records[i]?.status === "Present"
                    ? "Present"
                    : "Absent"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn btn-primary" onClick={saveAttendance}>
        Save Attendance
      </button>
    </div>
  );
}

export default Attendance;