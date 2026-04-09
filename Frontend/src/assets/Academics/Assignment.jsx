import React, { useEffect, useState } from "react";
import axios from "axios";

function Assignment() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState(null);

  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("");

  const token = localStorage.getItem("token");
  const API = "http://localhost:5000";

  /* ───────── FETCH COURSES ───────── */
  useEffect(() => {
    axios
      .get(`${API}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.courses.map((c, i) => ({
          id: i,
          course_code: c.course_code,
          title: `${c.course_name} Assignment`,
          faculty: c.faculty_name,
          due_date: "2026-05-01",
        }));

        setAssignments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* ───────── OPEN POPUP ───────── */
  async function openDetails(course_code) {
    try {
      const res = await axios.get(
        `${API}/assignment/details/${course_code}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const check = await axios.get(
        `${API}/assignment/submission/${course_code}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDetails(res.data.assignment);
      setSelected(course_code);

      setSubmitted(check.data.submitted);
      setStatus(check.data.data?.status || "");

      setFile(null);
    } catch (err) {
      console.log(err);
    }
  }

  function closeModal() {
    setSelected(null);
    setDetails(null);
    setFile(null);
  }

  /* ───────── SUBMIT FILE ───────── */
  function handleSubmit() {
    if (!file) return alert("Select file");

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(`${API}/assignment/submit/${selected}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Done ✅");
        closeModal(); // 🔥 auto close
      })
      .catch(() => alert("Upload failed"));
  }

  /* ───────── DELETE ───────── */
  function handleDelete() {
    axios
      .delete(`${API}/assignment/delete/${selected}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Deleted");
        setSubmitted(false);
        setStatus("");
      })
      .catch(() => alert("Delete failed"));
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="mb-4">Assignments</h2>

      {/* TABLE */}
      <div className="card p-3">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Faculty</th>
              <th>Due Date</th>
            </tr>
          </thead>

          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center">
                  No assignments
                </td>
              </tr>
            ) : (
              assignments.map((a) => (
                <tr
                  key={a.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => openDetails(a.course_code)}
                >
                  <td>{a.title}</td>
                  <td>{a.faculty}</td>
                  <td>{a.due_date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* POPUP */}
      {selected && details && (
        <div className="modal d-block" style={{ background: "#00000088" }}>
          <div className="modal-dialog">
            <div className="modal-content">

              {/* HEADER */}
              <div className="modal-header">
                <h5>{details.title}</h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>

              {/* BODY */}
              <div
                className="modal-body"
                style={{ maxHeight: "350px", overflowY: "auto" }}
              >
                <p><strong>Faculty:</strong> {details.faculty_name}</p>
                <p><strong>Due Date:</strong> {details.due_date}</p>

                <hr />

                <p><strong>Description:</strong></p>
                <p>{details.description}</p>

                <p><strong>Instructions:</strong></p>
                <p>{details.instructions}</p>

                <hr />

                {!submitted ? (
                  <>
                    <input
                      type="file"
                      className="form-control mb-3"
                      onChange={(e) => setFile(e.target.files[0])}
                    />

                    <button
                      className="btn btn-primary w-100"
                      onClick={handleSubmit}
                    >
                      Submit Assignment
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-success text-center mb-3">
                      <strong>Done ✅ ({status})</strong>
                    </div>

                    <button
                      className="btn btn-danger w-100"
                      onClick={handleDelete}
                    >
                      Delete & Re-submit
                    </button>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Assignment;