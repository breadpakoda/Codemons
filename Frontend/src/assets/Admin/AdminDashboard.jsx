import React, { useEffect, useState } from "react";
import axios from "axios";

import ManageStudents from "./ManageStudents";
import ManageFaculty from "./ManageFaculty";
import ManageEvents from "./ManageEvents";

function AdminDashboard() {
  const [page, setPage] = useState("students");

  const [complaints, setComplaints] = useState([]);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("adminToken");

  const headers = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // ================= FETCH =================
  useEffect(() => {
    if (page === "complaints") fetchComplaints();
  }, [page]);

  const fetchComplaints = () => {
    axios
      .get(`${API}/admin/complaints`, headers)
      .then((res) => setComplaints(res.data.complaints))
      .catch(() => alert("Error loading complaints"));
  };

  // ================= DELETE =================
  const deleteComplaint = (id) => {
    axios
      .delete(`${API}/admin/complaints/${id}`, headers)
      .then(fetchComplaints)
      .catch(() => alert("Error deleting complaint"));
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>

      {/* SIDEBAR */}
      <div style={{ width: "250px" }} className="bg-dark text-white p-3">
        <h4>Admin</h4>

        <button className="btn btn-light w-100 mt-2" onClick={() => setPage("students")}>
          Students
        </button>

        <button className="btn btn-light w-100 mt-2" onClick={() => setPage("faculty")}>
          Faculty
        </button>

        <button className="btn btn-light w-100 mt-2" onClick={() => setPage("events")}>
          Events
        </button>

        <button className="btn btn-light w-100 mt-2" onClick={() => setPage("complaints")}>
          Complaints
        </button>

        <button className="btn btn-danger w-100 mt-5" onClick={logout}>
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-grow-1 p-4">

        {/* STUDENTS */}
        {page === "students" && <ManageStudents />}

        {/* FACULTY */}
        {page === "faculty" && <ManageFaculty />}

        {/* EVENTS (FIXED) */}
        {page === "events" && <ManageEvents />}

        {/* COMPLAINTS */}
        {page === "complaints" && (
          <>
            <h3>Complaints</h3>

            {complaints.length === 0 ? (
              <p>No complaints found</p>
            ) : (
              complaints.map((c) => (
                <div key={c._id} className="card p-3 mb-2">
                  <p>{c.text}</p>
                  <small>Status: {c.status}</small>

                  <button
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => deleteComplaint(c._id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;