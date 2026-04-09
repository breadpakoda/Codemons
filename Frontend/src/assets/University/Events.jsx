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
      <h2 className="mb-3">College Events</h2>

      {events.length === 0 ? (
        <p>No upcoming events</p>
      ) : (
        events.map((e) => (
          <div key={e._id} className="card p-3 mb-3">
            <h5>{e.title}</h5>
            <p>{e.description}</p>

            <div className="d-flex justify-content-between">
              <span>{e.date}</span>
              <span>{e.location}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Events;