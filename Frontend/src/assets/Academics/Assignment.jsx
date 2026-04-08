import React, { useEffect, useState } from "react";
import axios from "axios";

function Assignment() {
  const [assignments, setAssignments] = useState([]);
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
        // simulate assignments from courses
        const data = res.data.courses.map((c, i) => ({
          id: i,
          title: `${c.course_name} Assignment`,
          faculty: c.faculty_name,
          due_date: "2026-05-01", // static for now
          status: "Pending",
        }));

        setAssignments(data);
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
      <h2 className="mb-4">Assignments</h2>

      <div className="card p-3">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Faculty</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No assignments available
                </td>
              </tr>
            ) : (
              assignments.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{a.faculty}</td>
                  <td>{a.due_date}</td>
                  <td>
                    <span className="badge bg-warning text-dark">
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Assignment;