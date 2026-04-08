import React, { useEffect, useState } from "react";
import axios from "axios";

function Room_details() {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API}/room`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRoom(res.data.room);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!room) return <div>No room allocated</div>;

  return (
    <div>
      <h2 className="mb-4">Room Details</h2>

      <div className="card p-4">
        <div className="row">

          <div className="col-md-6 mb-3">
            <strong>Hostel:</strong>
            <p>{room.hostel_name}</p>
          </div>

          <div className="col-md-6 mb-3">
            <strong>Room No:</strong>
            <p>{room.room_no}</p>
          </div>

          <div className="col-md-6 mb-3">
            <strong>Capacity:</strong>
            <p>{room.capacity}</p>
          </div>

          <div className="col-md-6 mb-3">
            <strong>Occupied:</strong>
            <p>{room.occupied_count}</p>
          </div>

          <div className="col-md-6 mb-3">
            <strong>Warden:</strong>
            <p>{room.warden_name}</p>
          </div>

          <div className="col-md-6 mb-3">
            <strong>Contact:</strong>
            <p>{room.warden_contact}</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Room_details;