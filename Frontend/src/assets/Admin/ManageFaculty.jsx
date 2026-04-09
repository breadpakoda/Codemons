import React, { useEffect, useState } from "react";
import axios from "axios";

function ManageFaculty() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("adminToken");

  const headers = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // ================= FETCH =================
  useEffect(() => {
    axios.get(`${API}/admin/faculty`, headers)
      .then(res => setData(res.data.faculty));
  }, []);

  // ================= EDIT =================
  const handleChange = (i, field, value) => {
    const newData = [...data];
    newData[i][field] = value;
    setData(newData);
  };

  // ================= ADD =================
  const addRow = () => {
    setData([
      ...data,
      {
        email: "",
        name: "",
        department: "CSE",
      },
    ]);
  };

  // ================= DELETE =================
  const deleteRow = (i) => {
    setData(data.filter((_, idx) => idx !== i));
  };

  // ================= VALIDATION =================
  const validate = () => {
    for (let row of data) {
      if (!row.email || !row.name) {
        return "Email and Name required";
      }
      if (!row.email.includes("@")) {
        return "Invalid email";
      }
    }
    return "";
  };

  // ================= SAVE =================
  const saveAll = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    axios.post(`${API}/admin/faculty/bulk`, data, headers)
      .then(() => {
        setError("");
        alert("Saved");
      });
  };

  return (
    <div>
      <h3>Manage Faculty</h3>

      {error && <p className="text-danger">{error}</p>}

      <button className="btn btn-success" onClick={addRow}>
        Add Row
      </button>

      <button className="btn btn-primary ms-2" onClick={saveAll}>
        Commit Changes
      </button>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Department</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr key={i}>

              {/* EMAIL */}
              <td>
                <input
                  value={row.email}
                  onChange={(e) => handleChange(i, "email", e.target.value)}
                />
              </td>

              {/* NAME */}
              <td>
                <input
                  value={row.name}
                  onChange={(e) => handleChange(i, "name", e.target.value)}
                />
              </td>

              {/* DEPARTMENT */}
              <td>
                <select
                  value={row.department}
                  onChange={(e) => handleChange(i, "department", e.target.value)}
                >
                  <option>CSE</option>
                  <option>IT</option>
                  <option>ECE</option>
                </select>
              </td>

              {/* DELETE */}
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteRow(i)}
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageFaculty;