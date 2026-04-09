import React, { useEffect, useState } from "react";
import axios from "axios";

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API}/attendance`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAttendance(res.data.attendance);
        setFiltered(res.data.attendance);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 🔍 SEARCH
  useEffect(() => {
    const data = attendance.filter(
      (a) =>
        a.course_name.toLowerCase().includes(search.toLowerCase()) ||
        (a.faculty_name || "")
          .toLowerCase()
          .includes(search.toLowerCase())
    );
    setFiltered(data);
  }, [search, attendance]);

  // 🖱 OPEN POPUP
  function openDetails(course_code) {
    axios
      .get(`${API}/attendance/details/${course_code}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setDetails(res.data.details);
        setSelected(course_code);
      });
  }
  

  function closeModal() {
    setSelected(null);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="mb-3">Attendance</h2>

      {/* 🔍 Search */}
      <input
        className="form-control mb-3"
        placeholder="Search by subject or teacher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <div className="card p-3">
        <table className="table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Total</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Late</th>
              <th>%</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No results found
                </td>
              </tr>
            ) : (
              filtered.map((a, i) => (
                <tr
                  key={i}
                  style={{ cursor: "pointer" }}
                  onClick={() => openDetails(a.course_code)}
                >
                  <td>{a.course_name}</td>
                  <td>{a.total_classes}</td>
                  <td>{a.present_count}</td>
                  <td>{a.total_classes - a.present_count}</td>
                  <td>0</td>
                  <td>
                    <span
                      className={`badge ${a.attendance_percent >= 75
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

      {/* 🪟 MODAL */}
      {selected && (
        <div className="modal d-block" style={{ background: "#00000088" }}>
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5>Attendance Details</h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>

              {/* SCROLLABLE */}
              <div
                className="modal-body"
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
                {details.length === 0 ? (
                  <p>No records found</p>
                ) : (
                  details.map((d, i) => (
                    <div key={i} className="border-bottom py-2">
                      <strong>{d.date}</strong> →{" "}
                      <span
                        className={
                          d.status === "Present"
                            ? "text-success"
                            : d.status === "Absent"
                              ? "text-danger"
                              : "text-warning"
                        }
                      >
                        {d.status}
                      </span>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;