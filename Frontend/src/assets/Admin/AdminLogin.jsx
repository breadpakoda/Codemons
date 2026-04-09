import React, { useState } from "react";
import axios from "axios";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const API = import.meta.env.VITE_API_URL;

  const handleLogin = () => {
    if (!username || !password) {
      setError("Enter all fields");
      return;
    }

    axios
      .post(`${API}/admin/login`, {
        username,
        password,
      })
      .then((res) => {
        localStorage.setItem("adminToken", res.data.token);
        window.location.href = "/admin";
      })
      .catch(() => {
        setError("Invalid credentials");
      });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh", background: "#f5f5f5" }}
    >
      <div className="card p-4" style={{ width: "350px" }}>
        <h3 className="mb-3 text-center">Admin Login</h3>

        {error && <p className="text-danger">{error}</p>}

        <input
          type="text"
          className="form-control mb-2"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-primary w-100" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;