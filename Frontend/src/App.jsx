import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./assets/Login";
import Dashboard from "./assets/Dashboard";

// Academics
import Attendance from "./assets/Academics/Attendance";
import Assignment from "./assets/Academics/Assignment";
import Notes from "./assets/Academics/Notes";
import Quizes from "./assets/Academics/Quizes";
import Calander from "./assets/Academics/Calander";

// Hostel
import Complaints from "./assets/Hostel/Complaints";
import FeeHostel from "./assets/Hostel/Fee_hostel";
import RoomDetails from "./assets/Hostel/Room_details";

// University
import Events from "./assets/University/Events";
import FeeBus from "./assets/University/Fee_bus";
import FeeCollege from "./assets/University/Fee_college";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        {/* Academics */}
        <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
        <Route path="/assignment" element={<ProtectedRoute><Assignment /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
        <Route path="/quizes" element={<ProtectedRoute><Quizes /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><Calander /></ProtectedRoute>} />

        {/* Hostel */}
        <Route path="/complaints" element={<ProtectedRoute><Complaints /></ProtectedRoute>} />
        <Route path="/fee-hostel" element={<ProtectedRoute><FeeHostel /></ProtectedRoute>} />
        <Route path="/room" element={<ProtectedRoute><RoomDetails /></ProtectedRoute>} />

        {/* University */}
        <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
        <Route path="/fee-bus" element={<ProtectedRoute><FeeBus /></ProtectedRoute>} />
        <Route path="/fee-college" element={<ProtectedRoute><FeeCollege /></ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;