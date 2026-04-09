import React, { useEffect, useState } from "react";
import axios from "axios";

function Complaints() {
  const [text, setText] = useState("");
  const [complaints, setComplaints] = useState([]);

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  // fetch complaints
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = () => {
    axios
      .get(`${API}/complaints`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setComplaints(res.data.complaints));
  };

  // add complaint
  const handleSubmit = () => {
    if (!text.trim()) return;

    axios
      .post(
        `${API}/complaints`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setText("");
        fetchComplaints();
      });
  };

  // delete complaint
  const deleteComplaint = (id) => {
    axios
      .delete(`${API}/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => fetchComplaints());
  };

  return (
    <div>
      <h2 className="mb-3">Complaints</h2>

      {/* Input */}
      <div className="mb-3">
        <textarea
          className="form-control"
          placeholder="Write your complaint..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      {/* Cards */}
      {complaints.length === 0 ? (
        <p>No complaints yet</p>
      ) : (
        complaints.map((c) => (
          <div key={c._id} className="card p-3 mb-2">
            <p>{c.text}</p>

            <div className="d-flex justify-content-between">
              <span
                className={`badge ${
                  c.status === "Resolved" ? "bg-success" : "bg-warning"
                }`}
              >
                {c.status}
              </span>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteComplaint(c._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Complaints;