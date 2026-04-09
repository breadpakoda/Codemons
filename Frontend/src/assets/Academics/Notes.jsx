import React, { useEffect, useState } from "react";
import axios from "axios";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:5000";

  useEffect(() => {
    axios
      .get(`${API}/notes`) // ✅ REAL API
      .then((res) => {
        setNotes(res.data.notes);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="mb-4">Notes</h2>

      <div className="row">
        {notes.length === 0 ? (
          <div className="text-center">No notes available</div>
        ) : (
          notes.map((n) => (
            <div className="col-md-4 mb-3" key={n._id}>
              <div className="card p-3 h-100">
                <h5>{n.title}</h5>

                <p className="small">
                  {n.content || "No description"}
                </p>

                {/* 🔥 FILE LINK */}
                {n.file ? (
                  <a
                    href={`${API}/uploads/notes/${n.file}`}
                    target="_blank"
                    className="btn btn-primary mt-auto"
                  >
                    View File
                  </a>
                ) : (
                  <button className="btn btn-secondary mt-auto" disabled>
                    No File
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notes;