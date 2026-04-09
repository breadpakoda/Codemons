import React, { useEffect, useState } from "react";
import axios from "axios";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    course_code: "CS101",
  });

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("teacherToken");

  const headers = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // ================= FETCH =================
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    axios
      .get(`${API}/notes`)
      .then((res) => setNotes(res.data.notes))
      .catch(() => alert("Error loading notes"));
  };

  // ================= INPUT =================
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  // ================= ADD NOTE =================
  const addNote = () => {
    if (!form.title || !form.content) {
      alert("Fill all fields");
      return;
    }

    axios
      .post(`${API}/teacher/notes`, form, headers)
      .then(() => {
        setForm({
          title: "",
          content: "",
          course_code: "CS101",
        });
        fetchNotes();
      })
      .catch(() => alert("Error adding note"));
  };

  // ================= FILE UPLOAD =================
  const uploadFile = () => {
    if (!file) return alert("Select file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", form.title);
    formData.append("course_code", form.course_code);

    axios
      .post(`${API}/teacher/upload-note`, formData, headers)
      .then(() => {
        alert("File uploaded");
      })
      .catch(() => alert("Upload failed"));
  };

  // ================= DELETE =================
  const deleteNote = (id) => {
    if (!window.confirm("Delete note?")) return;

    axios
      .delete(`${API}/teacher/notes/${id}`, headers)
      .then(fetchNotes)
      .catch(() => alert("Delete failed"));
  };

  return (
    <div>
      <h3>Notes</h3>

      {/* ADD NOTE */}
      <div className="card p-3 mb-3">
        <h5>Add Note</h5>

        <input
          className="form-control mb-2"
          placeholder="Title"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />

        <textarea
          className="form-control mb-2"
          placeholder="Content"
          rows="3"
          value={form.content}
          onChange={(e) => handleChange("content", e.target.value)}
        />

        <select
          className="form-control mb-2"
          value={form.course_code}
          onChange={(e) => handleChange("course_code", e.target.value)}
        >
          <option value="CS101">CS101</option>
          <option value="CS102">CS102</option>
        </select>

        <button className="btn btn-success" onClick={addNote}>
          Add Note
        </button>
      </div>

      {/* FILE UPLOAD */}
      <div className="card p-3 mb-3">
        <h5>Upload File</h5>

        <input
          type="file"
          className="form-control mb-2"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button className="btn btn-primary" onClick={uploadFile}>
          Upload File
        </button>
      </div>

      {/* LIST */}
      <h5>All Notes</h5>

      {notes.length === 0 ? (
        <p>No notes found</p>
      ) : (
        notes.map((n) => (
          <div key={n._id} className="card p-3 mb-2">
            <h5>{n.title}</h5>
            <p>{n.content}</p>
            <small>{n.course_code}</small>

            {/* OPTIONAL FILE LINK */}
            {n.file && (
              <div>
                <a
                  href={`${API}/uploads/notes/${n.file}`}
                  target="_blank"
                >
                  View File
                </a>
              </div>
            )}

            <button
              className="btn btn-danger btn-sm mt-2"
              onClick={() => deleteNote(n._id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Notes;