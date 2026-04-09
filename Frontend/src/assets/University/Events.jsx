import React, { useEffect, useState } from "react";
import axios from "axios";

function Events() {
  const [events, setEvents] = useState([]);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${API}/events`).then((res) => {
      setEvents(res.data.events);
    });
  }, []);

  return (
    <div>
      <h2 className="mb-3" style={{ color: "#ac0f0c" }}>College Events</h2>

      {events.length === 0 ? (
        <p style={{ color: "#ac0f0c" }}>No upcoming events</p>
      ) : (
        events.map((e) => (
          <div key={e._id} className="card p-3 mb-3 shadow-hover">
            <h5 style={{ color: "#ac0f0c" }}>{e.title}</h5>
            <p style={{ color: "#ac0f0c" }}>{e.description}</p>

            <div className="d-flex justify-content-between">
              <span style={{ color: "#ac0f0c" }}>{e.date}</span>
              <span style={{ color: "#ac0f0c" }}>{e.location}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Events;