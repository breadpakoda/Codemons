import React from "react";
import { Link, useLocation } from "react-router-dom";

function Layout({ children }) {
  const location = useLocation();
  const path = location.pathname;

  // Section detection
  const isHostel =
    path.includes("room") ||
    path.includes("complaints") ||
    path.includes("fee-hostel");

  const isUniversity =
    path.includes("events") ||
    path.includes("fee-bus") ||
    path.includes("fee-college");

  const isAcademics = !isHostel && !isUniversity;

  // 🔴 LOGOUT (FINAL FIX)
  function handleLogout() {
    localStorage.removeItem("token");

    // force full reload to reset auth state
    window.location.href = "/";
  }

  const getActive = (route) =>
    path.includes(route)
      ? "bg-primary text-white rounded px-2 py-1"
      : "";

  return (
    <div className="d-flex min-vh-100 bg-light">

      {/* SIDEBAR */}
      <div style={{ width: "250px" }} className="border-end p-3 d-flex flex-column">
        <h4>EduBase</h4>

        {/* ACADEMICS */}
        {isAcademics && (
          <>
            <p className="mt-4 text-muted">ACADEMICS</p>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link className={getActive("attendance")} to="/attendance">Attendance</Link>
              </li>
              <li className="mb-2">
                <Link className={getActive("notes")} to="/notes">Notes</Link>
              </li>
              <li className="mb-2">
                <Link className={getActive("assignment")} to="/assignment">Assignments</Link>
              </li>
              <li className="mb-2">
                <Link className={getActive("quizes")} to="/quizes">Quizzes</Link>
              </li>
              <li className="mb-2">
                <Link className={getActive("calendar")} to="/calendar">Calendar</Link>
              </li>
            </ul>
          </>
        )}

        {/* HOSTEL */}
        {isHostel && (
          <>
            <p className="mt-4 text-muted">HOSTEL</p>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link className={getActive("room")} to="/room">Room Details</Link>
              </li>
              <li className="mb-2">
                <Link className={getActive("complaints")} to="/complaints">Complaints</Link>
              </li>
              <li className="mb-2">
                <Link className={getActive("fee-hostel")} to="/fee-hostel">Fee Hostel</Link>
              </li>
            </ul>
          </>
        )}

        {/* UNIVERSITY */}
        {isUniversity && (
          <>
            <p className="mt-4 text-muted">UNIVERSITY</p>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link className={getActive("events")} to="/events">Events</Link>
              </li>
              <li className="mb-2">
                <Link className={getActive("fee-bus")} to="/fee-bus">Bus Fee</Link>
              </li>
              <li className="mb-2">
                <Link className={getActive("fee-college")} to="/fee-college">College Fee</Link>
              </li>
            </ul>
          </>
        )}

        {/* PROFILE + LOGOUT */}
        <div className="mt-auto pt-4">
          <div className="border p-2 rounded mb-2">
            <strong>Student</strong>
            <div className="text-muted small">ERP System</div>
          </div>

          <button
            className="btn btn-danger w-100"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-grow-1 p-4">
        {children}
      </div>

      {/* BOTTOM NAV */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#fff",
          padding: "10px 30px",
          borderRadius: "15px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}
      >
        <Link className={isAcademics ? "fw-bold mx-2" : "mx-2"} to="/attendance">
          Academics
        </Link>
        <Link className={isHostel ? "fw-bold mx-2" : "mx-2"} to="/room">
          Hostel
        </Link>
        <Link className={isUniversity ? "fw-bold mx-2" : "mx-2"} to="/events">
          University
        </Link>
      </div>

    </div>
  );
}

export default Layout;