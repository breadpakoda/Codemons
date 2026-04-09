import React, { useState } from "react";

import Attendance from "./Attendance";
import Notes from "./Notes";
import Quiz from "./Quiz";

function TeacherDashboard() {
  const [page, setPage] = useState("attendance");

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("teacherToken");
    window.location.href = "/teacher/login";
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>

      {/* SIDEBAR */}
      <div style={{ width: "250px" }} className="bg-dark text-white p-3">
        <h4>Teacher Panel</h4>

        <button
          className="btn btn-light w-100 mt-2"
          onClick={() => setPage("attendance")}
        >
          Attendance
        </button>

        <button
          className="btn btn-light w-100 mt-2"
          onClick={() => setPage("notes")}
        >
          Notes
        </button>

        <button
          className="btn btn-light w-100 mt-2"
          onClick={() => setPage("quiz")}
        >
          Quiz
        </button>

        <button
          className="btn btn-danger w-100 mt-5"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-grow-1 p-4">

        {page === "attendance" && <Attendance />}

        {page === "notes" && <Notes />}

        {page === "quiz" && <Quiz />}

      </div>
    </div>
  );
}

export default TeacherDashboard;