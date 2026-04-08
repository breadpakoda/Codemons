import React, { useEffect, useState } from "react";
import axios from "axios";

function Quizes() {
  const [quizzes, setQuizzes] = useState([]);
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
        // simulate quizzes from courses
        const data = res.data.courses.map((c, i) => ({
          id: i,
          title: `${c.course_name} Quiz`,
          faculty: c.faculty_name,
          total_marks: 20,
          status: i % 2 === 0 ? "Completed" : "Pending",
        }));

        setQuizzes(data);
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
      <h2 className="mb-4">Quizzes</h2>

      <div className="card p-3">
        <table className="table">
          <thead>
            <tr>
              <th>Quiz Title</th>
              <th>Faculty</th>
              <th>Total Marks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No quizzes available
                </td>
              </tr>
            ) : (
              quizzes.map((q) => (
                <tr key={q.id}>
                  <td>{q.title}</td>
                  <td>{q.faculty}</td>
                  <td>{q.total_marks}</td>
                  <td>
                    <span
                      className={`badge ${
                        q.status === "Completed"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {q.status}
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

export default Quizes;