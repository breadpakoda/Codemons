import React, { useState } from 'react';
import axios from "axios";


function Login() {
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          rollNo: rollNo,
          password: password
        }
      );

      // DEBUG
      console.log(response.data);

      if (response.data.success === true) {
        localStorage.setItem("token", response.data.token);
        window.location.href = "/attendance";
      } else {
        setError(response.data.message || "Login failed");
      }

    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Invalid credentials");
    }
  }

  return (
    <div className='bg-dark'>
      <div className='d-flex vh-100 justify-content-center align-items-center'>
        <form onSubmit={handleSubmit} className='bg-white border rounded p-5'>
          <h1 className='mb-4' style={{ color: "#ac0f0c" }}>Student Login</h1>

          {error && <div className='alert alert-danger'>{error}</div>}

          <div className='mb-3'>
            <label className='form-label' style={{ color: "#ac0f0c" }}>Roll Number</label>
            <input
              className='form-control'
              type="text"
              required
              placeholder="Enter Roll No"
              onChange={(e) => setRollNo(e.target.value)}
            />
          </div>

          <div className='mb-3'>
            <label className='form-label' style={{ color: "#ac0f0c" }}>Password</label>
            <input
              className='form-control'
              type="password"
              required
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            className='btn btn-primary mt-2 w-100' 
            style={{ backgroundColor: "#ac0f0c", borderColor: "#ac0f0c", color: "white", transition: "all 0.3s ease" }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = "white"; e.target.style.color = "#ac0f0c"; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = "#ac0f0c"; e.target.style.color = "white"; }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;