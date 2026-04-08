import React, { useEffect, useState } from "react";
import axios from "axios";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // simulate notes
        const data = res.data.courses.map((c, i) => ({
          id: i,
          title: `${c.course_name} Notes`,
          faculty: c.faculty_name,
          description: "Lecture materials and important topics",
          link: "#", // can replace with real PDF later
        }));

        setNotes(data);
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
            <div className="col-md-4 mb-3" key={n.id}>
              <div className="card p-3 h-100">
                <h5>{n.title}</h5>
                <p className="text-muted mb-1">{n.faculty}</p>
                <p className="small">{n.description}</p>

                <a href={n.link} className="btn btn-primary mt-auto">
                  View Notes
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notes;