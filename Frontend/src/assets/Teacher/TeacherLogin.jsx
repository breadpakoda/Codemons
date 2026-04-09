import React, { useState } from "react";
import axios from "axios";

function TeacherLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API = import.meta.env.VITE_API_URL;

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    try {
      const res = await axios.post(`${API}/teacher/login`, {
        email,
        password,
      });

      // store token
      localStorage.setItem("teacherToken", res.data.token);

      // redirect
      window.location.href = "/teacher";

    } catch (err) {
      console.log(err);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h3 className="text-center mb-3">Teacher Login</h3>

        <input
          type="email"
          className="form-control mb-2"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Enter Password"
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

export default TeacherLogin;