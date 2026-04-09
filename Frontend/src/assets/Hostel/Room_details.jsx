import React, { useEffect, useState } from "react";
import axios from "axios";

function RoomDetails() {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API}/room`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setRoom(res.data.room);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!room)
    return <div className="text-center mt-4">No hostel allocated</div>;

  return (
    <div>
      <h2 className="mb-4" style={{ color: "#ac0f0c" }}>Hostel Details</h2>

      <div className="card p-4 shadow-hover">
        <div className="row">

          <div className="col-md-6 mb-3">
            <strong style={{ color: "#ac0f0c" }}>Hostel:</strong>
            <p style={{ color: "#ac0f0c" }}>{room.hostel_name}</p>
          </div>

          <div className="col-md-6 mb-3">
            <strong style={{ color: "#ac0f0c" }}>Room No:</strong>
            <p style={{ color: "#ac0f0c" }}>{room.room_no}</p>
          </div>

          <div className="col-md-6 mb-3">
            <strong style={{ color: "#ac0f0c" }}>Capacity:</strong>
            <p style={{ color: "#ac0f0c" }}>{room.capacity}</p>
          </div>

          <div className="col-md-6 mb-3">
            <strong style={{ color: "#ac0f0c" }}>Occupied:</strong>
            <p style={{ color: "#ac0f0c" }}>{room.occupied_count}</p>
          </div>

          <div className="col-md-6 mb-3">
            <strong style={{ color: "#ac0f0c" }}>Warden:</strong>
            <p style={{ color: "#ac0f0c" }}>{room.warden_name}</p>
          </div>

          <div className="col-md-6 mb-3">
            <strong style={{ color: "#ac0f0c" }}>Contact:</strong>
            <p style={{ color: "#ac0f0c" }}>{room.warden_contact}</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default RoomDetails;