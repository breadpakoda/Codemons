import React from 'react'

function Login() {
  return (
    <div className="bg-dark d-flex justify-content-center align-items-center vh-100">
      <form
       
        className="p-4 rounded shadow"
        style={{
          width: "350px",
          background: "#1e1e1e",
          color: "#fff",
        }}
      >
        <h3 className="text-center mb-4">Student Login</h3>

        <div className="mb-3">
          <label className="form-label">Roll Number</label>
          <input
            type="text"
            className="form-control bg-secondary text-white border-0"
            placeholder="Enter Roll No"
       
           
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control bg-secondary text-white border-0"
            placeholder="Enter Password"
            
          
            required
          />
        </div>

        <button className="btn btn-outline-light w-100 mt-2">
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
