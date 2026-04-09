import React, { useEffect, useState } from "react";
import axios from "axios";

function AssignmentSection() {
  const [form, setForm] = useState({
    title: "",
    instructions: "",
    course_code: "CS101",
  });

  const [file, setFile] = useState(null);
  const [list, setList] = useState([]);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("teacherToken");

  const headers = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = () => {
    axios.get(`${API}/assignment`)
      .then(res => setList(res.data.assignments));
  };

  const uploadAssignment = () => {
    if (!form.title) return alert("Title required");

    const data = new FormData();
    data.append("title", form.title);
    data.append("instructions", form.instructions);
    data.append("course_code", form.course_code);
    if (file) data.append("file", file);

    axios.post(`${API}/teacher/assignment`, data, headers)
      .then(() => {
        setForm({ title: "", instructions: "", course_code: "CS101" });
        setFile(null);
        fetchAssignments();
      })
      .catch(() => alert("Upload failed"));
  };

  const deleteAssignment = (id) => {
    axios.delete(`${API}/teacher/assignment/${id}`, headers)
      .then(fetchAssignments);
  };

  return (
    <div className="mt-4">
      <h4>Assignments</h4>

      {/* FORM */}
      <div className="card p-3 mb-3">
        <input
          className="form-control mb-2"
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          className="form-control mb-2"
          placeholder="Instructions"
          value={form.instructions}
          onChange={(e) =>
            setForm({ ...form, instructions: e.target.value })
          }
        />

        <input
          type="file"
          className="form-control mb-2"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button className="btn btn-success" onClick={uploadAssignment}>
          Upload Assignment
        </button>
      </div>

      {/* LIST */}
      {list.map((a) => (
        <div key={a._id} className="card p-3 mb-2">
          <h5>{a.title}</h5>
          <p>{a.instructions}</p>

          {a.file && (
            <a
              href={`${API}/uploads/assignment-teacher/${a.file}`}
              target="_blank"
              className="btn btn-primary btn-sm"
            >
              View File
            </a>
          )}

          <button
            className="btn btn-danger btn-sm mt-2"
            onClick={() => deleteAssignment(a._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default AssignmentSection;