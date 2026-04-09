import React, { useEffect, useState } from "react";
import axios from "axios";

function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("adminToken");

  const headers = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // ================= FETCH =================
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = () => {
    axios
      .get(`${API}/admin/complaints`, headers)
      .then((res) => {
        setComplaints(res.data.complaints);
        setFiltered(res.data.complaints);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // ================= FILTER + SEARCH =================
  useEffect(() => {
    let data = [...complaints];

    if (filter !== "All") {
      data = data.filter((c) => (c.status || "Pending") === filter);
    }

    if (search) {
      data = data.filter((c) =>
        c.text.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(data);
  }, [search, filter, complaints]);

  // ================= UPDATE STATUS =================
  const updateStatus = (id, status) => {
    axios
      .put(`${API}/admin/complaints/${id}`, { status }, headers)
      .then(fetchComplaints)
      .catch(() => alert("Update failed"));
  };

  // ================= DELETE =================
  const deleteComplaint = (id) => {
    if (!window.confirm("Delete complaint?")) return;

    axios
      .delete(`${API}/admin/complaints/${id}`, headers)
      .then(fetchComplaints)
      .catch(() => alert("Delete failed"));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3 className="mb-3">Manage Complaints</h3>

      {/* SEARCH + FILTER */}
      <div className="d-flex mb-3 gap-2">
        <input
          className="form-control"
          placeholder="Search complaints..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="form-control"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Completed</option>
          <option>Failed</option>
        </select>
      </div>

      {/* LIST */}
      {filtered.length === 0 ? (
        <p>No complaints found</p>
      ) : (
        filtered.map((c) => (
          <div key={c._id} className="card p-3 mb-2">

            {/* TEXT */}
            <p><strong>{c.text}</strong></p>

            {/* STATUS DROPDOWN */}
            <div className="mb-2">
              <select
                className="form-control"
                value={c.status || "Pending"}
                onChange={(e) =>
                  updateStatus(c._id, e.target.value)
                }
              >
                <option>Pending</option>
                <option>Completed</option>
                <option>Failed</option>
              </select>
            </div>

            {/* DELETE BUTTON */}
            <button
              className="btn btn-danger btn-sm"
              onClick={() => deleteComplaint(c._id)}
            >
              Delete
            </button>

          </div>
        ))
      )}
    </div>
  );
}

export default ManageComplaints;