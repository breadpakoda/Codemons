import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./assets/Login";

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

// Layout (FIXED PATH)
import Layout from "./Components/Layout";

// Protected Route
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/"
          element={
            token ? <Navigate to="/attendance" /> : <Login />
          }
        />

        {/* Academics */}
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Layout>
                <Attendance />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/assignment"
          element={
            <ProtectedRoute>
              <Layout>
                <Assignment />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Layout>
                <Notes />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/quizes"
          element={
            <ProtectedRoute>
              <Layout>
                <Quizes />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Layout>
                <Calander />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Hostel */}
        <Route
          path="/room"
          element={
            <ProtectedRoute>
              <Layout>
                <RoomDetails />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaints"
          element={
            <ProtectedRoute>
              <Layout>
                <Complaints />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/fee-hostel"
          element={
            <ProtectedRoute>
              <Layout>
                <FeeHostel />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* University */}
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Layout>
                <Events />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/fee-bus"
          element={
            <ProtectedRoute>
              <Layout>
                <FeeBus />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/fee-college"
          element={
            <ProtectedRoute>
              <Layout>
                <FeeCollege />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;