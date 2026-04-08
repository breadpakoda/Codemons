import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/dashboard/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStudent(res.data.student))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/");
      });
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  if (!student) {
    return (
      <div className="bg-dark vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-light" role="status" />
      </div>
    );
  }

  return (
    <div className="bg-dark min-vh-100 p-4">
      <div className="container">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-white mb-0">Student Dashboard</h2>
          <button className="btn btn-outline-light" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Profile Card */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">Profile</h5>
            <div className="row">
              <div className="col-md-6 mb-2">
                <small className="text-muted">Name</small>
                <p className="fw-bold mb-0">{student.name}</p>
              </div>
              <div className="col-md-6 mb-2">
                <small className="text-muted">Roll Number</small>
                <p className="fw-bold mb-0">{student.roll_no}</p>
              </div>
              <div className="col-md-6 mb-2">
                <small className="text-muted">Email</small>
                <p className="fw-bold mb-0">{student.email}</p>
              </div>
              <div className="col-md-6 mb-2">
                <small className="text-muted">Phone</small>
                <p className="fw-bold mb-0">{student.phone}</p>
              </div>
              <div className="col-md-6 mb-2">
                <small className="text-muted">Department</small>
                <p className="fw-bold mb-0">{student.department}</p>
              </div>
              <div className="col-md-6 mb-2">
                <small className="text-muted">Year</small>
                <p className="fw-bold mb-0">{student.year}</p>
              </div>
              <div className="col-md-6 mb-2">
                <small className="text-muted">Residence</small>
                <p className="fw-bold mb-0">{student.residence_type}</p>
              </div>
              <div className="col-md-6 mb-2">
                <small className="text-muted">Transport</small>
                <p className="fw-bold mb-0">{student.transport_type}</p>
              </div>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

      </div>
    </div>
  );
}

export default Dashboard;