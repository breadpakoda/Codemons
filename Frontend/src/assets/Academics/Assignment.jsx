import React, { useEffect, useState } from "react";
import axios from "axios";

function Assignment() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [file, setFile] = useState(null);

  const API = "http://localhost:5000";
  const token = localStorage.getItem("token");

  const headers = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = () => {
    axios
      .get(`${API}/assignment`)
      .then((res) => {
        setAssignments(res.data.assignments);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  // ================= OPEN POPUP =================
  const openModal = (assignment) => {
    setSelected(assignment);
    setFile(null);
  };

  const closeModal = () => {
    setSelected(null);
    setFile(null);
  };

  // ================= SUBMIT =================
  const submitAssignment = () => {
    if (!file) return alert("Select file");

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(
        `${API}/assignment/submit/${selected._id}`,
        formData,
        headers
      )
      .then(() => {
        alert("Submitted successfully");
        closeModal();
      })
      .catch((err) => {
        console.log(err.response?.data || err.message);
        alert("Upload failed");
      });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="mb-4">Assignments</h2>

      <div className="card p-3">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Course</th>
              <th>Instructions</th>
              <th>File</th>
            </tr>
          </thead>

          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No assignments
                </td>
              </tr>
            ) : (
              assignments.map((a) => (
                <tr
                  key={a._id}
                  style={{ cursor: "pointer" }}
                  onClick={() => openModal(a)}
                >
                  <td>{a.title}</td>
                  <td>{a.course_code}</td>
                  <td>{a.instructions || "No instructions"}</td>

                  <td>
                    {a.file ? (
                      <a
                        href={`${API}/uploads/assignment-teacher/${a.file}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="btn btn-primary btn-sm"
                      >
                        View File
                      </a>
                    ) : (
                      "No File"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= POPUP ================= */}
      {selected && (
        <div className="modal d-block" style={{ background: "#00000088" }}>
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5>{selected.title}</h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>

              <div className="modal-body">
                <p><strong>Course:</strong> {selected.course_code}</p>
                <p><strong>Instructions:</strong></p>
                <p>{selected.instructions}</p>

                <input
                  type="file"
                  className="form-control mt-3"
                  onChange={(e) => setFile(e.target.files[0])}
                />

                <button
                  className="btn btn-success w-100 mt-3"
                  onClick={submitAssignment}
                >
                  Submit Assignment
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Assignment;