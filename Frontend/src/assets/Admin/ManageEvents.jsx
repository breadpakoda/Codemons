import React, { useEffect, useState } from "react";
import axios from "axios";

function ManageEvents() {
  const [events, setEvents] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("adminToken");

  const headers = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // FETCH
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios.get(`${API}/events`)
      .then(res => setEvents(res.data.events))
      .catch(() => alert("Error loading events"));
  };

  // INPUT
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  // ADD
  const addEvent = () => {
    if (!form.title) return alert("Title required");

    axios.post(`${API}/admin/events`, form, headers)
      .then(() => {
        setForm({
          title: "",
          description: "",
          date: "",
          location: "",
        });
        fetchEvents();
      })
      .catch(() => alert("Error adding event"));
  };

  // DELETE
  const deleteEvent = (id) => {
    if (!window.confirm("Delete event?")) return;

    axios.delete(`${API}/admin/events/${id}`, headers)
      .then(fetchEvents);
  };

  return (
    <div>
      <h3>Events</h3>

      {/* 🔥 ADD EVENT FORM */}
      <div className="card p-3 mb-3">
        <h5>Add Event</h5>

        <input
          className="form-control mb-2"
          placeholder="Title"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        <input
          type="date"
          className="form-control mb-2"
          value={form.date}
          onChange={(e) => handleChange("date", e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="Location"
          value={form.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />

        <button className="btn btn-success" onClick={addEvent}>
          Add Event
        </button>
      </div>

      {/* LIST */}
      {events.length === 0 ? (
        <p>No events found</p>
      ) : (
        events.map((e) => (
          <div key={e._id} className="card p-3 mb-2">
            <h5>{e.title}</h5>
            <p>{e.description}</p>
            <small>{e.date} | {e.location}</small>

            <button
              className="btn btn-danger btn-sm mt-2"
              onClick={() => deleteEvent(e._id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default ManageEvents;