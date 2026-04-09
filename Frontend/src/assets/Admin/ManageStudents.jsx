import React, { useEffect, useState } from "react";
import axios from "axios";

function ManageStudents() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("adminToken");

  const headers = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    axios.get(`${API}/admin/students`, headers)
      .then(res => setData(res.data.students));
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
        roll_no: "",
        name: "",
        email: "",
        phone: "",
        department: "CSE",
        year: 1,
        password: "",
        residence_type: "Day Scholar",
        transport_type: "None",
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
      if (!row.roll_no || !row.name) {
        return "Roll No and Name required";
      }
      if (row.email && !row.email.includes("@")) {
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

    axios.post(`${API}/admin/students/bulk`, data, headers)
      .then(() => {
        setError("");
        alert("Saved");
      });
  };

  return (
    <div>
      <h3>Manage Students</h3>

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
            <th>Roll</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Dept</th>
            <th>Year</th>
            <th>Password</th>
            <th>Residence</th>
            <th>Transport</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr key={i}>

              {/* TEXT FIELDS */}
              <td>
                <input value={row.roll_no}
                  onChange={(e) => handleChange(i, "roll_no", e.target.value)} />
              </td>

              <td>
                <input value={row.name}
                  onChange={(e) => handleChange(i, "name", e.target.value)} />
              </td>

              <td>
                <input value={row.email}
                  onChange={(e) => handleChange(i, "email", e.target.value)} />
              </td>

              <td>
                <input value={row.phone}
                  onChange={(e) => handleChange(i, "phone", e.target.value)} />
              </td>

              {/* DROPDOWN */}
              <td>
                <select value={row.department}
                  onChange={(e) => handleChange(i, "department", e.target.value)}>
                  <option>CSE</option>
                  <option>IT</option>
                  <option>ECE</option>
                </select>
              </td>

              <td>
                <select value={row.year}
                  onChange={(e) => handleChange(i, "year", e.target.value)}>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
              </td>

              <td>
                <input value={row.password}
                  onChange={(e) => handleChange(i, "password", e.target.value)} />
              </td>

              <td>
                <select value={row.residence_type}
                  onChange={(e) => handleChange(i, "residence_type", e.target.value)}>
                  <option>Hostel</option>
                  <option>Day Scholar</option>
                </select>
              </td>

              <td>
                <select value={row.transport_type}
                  onChange={(e) => handleChange(i, "transport_type", e.target.value)}>
                  <option>None</option>
                  <option>Bus</option>
                  <option>Self</option>
                </select>
              </td>

              {/* DELETE */}
              <td>
                <button className="btn btn-danger btn-sm"
                  onClick={() => deleteRow(i)}>
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

export default ManageStudents;