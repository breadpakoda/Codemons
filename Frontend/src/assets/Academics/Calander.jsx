import React, { useEffect, useState } from "react";
import axios from "axios";

function Calander() {
  const [events, setEvents] = useState([]);
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
        // simulate calendar events
        const data = res.data.courses.map((c, i) => ({
          id: i,
          title: `${c.course_name} ${
            i % 2 === 0 ? "Assignment" : "Quiz"
          }`,
          date: `2026-05-0${(i % 9) + 1}`,
          type: i % 2 === 0 ? "Assignment" : "Quiz",
        }));

        setEvents(data);
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
      <h2 className="mb-4">Calendar</h2>

      <div className="card p-3">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Event</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center">
                  No events available
                </td>
              </tr>
            ) : (
              events.map((e) => (
                <tr key={e.id}>
                  <td>{e.date}</td>
                  <td>{e.title}</td>
                  <td>
                    <span
                      className={`badge ${
                        e.type === "Assignment"
                          ? "bg-primary"
                          : "bg-success"
                      }`}
                    >
                      {e.type}
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

export default Calander;