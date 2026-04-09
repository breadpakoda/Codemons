import React, { useEffect, useState } from "react";
import axios from "axios";

function Calander() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ================= COURSES =================
        const courseRes = await axios.get(
          "http://localhost:5000/courses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const courseEvents = courseRes.data.courses.map((c, i) => ({
          id: "c" + i,
          title: `${c.course_name} ${
            i % 2 === 0 ? "Assignment" : "Quiz"
          }`,
          date: `2026-05-0${(i % 9) + 1}`,
          type: i % 2 === 0 ? "Assignment" : "Quiz",
        }));

        // ================= EVENTS =================
        const eventRes = await axios.get(
          "http://localhost:5000/events"
        );

        const realEvents = eventRes.data.events.map((e) => ({
          id: e._id,
          title: e.title,
          date: e.date,
          type: "Event",
        }));

        // ================= MERGE + SORT =================
        const merged = [...courseEvents, ...realEvents].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setEvents(merged);
        setLoading(false);

      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchData();
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
                          : e.type === "Quiz"
                          ? "bg-success"
                          : "bg-warning"
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