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

// Layout
import Layout from "./Components/Layout";

// Admin
import AdminLogin from "./assets/Admin/AdminLogin";
import AdminDashboard from "./assets/Admin/AdminDashboard";

<<<<<<< HEAD
=======
// 🔥 TEACHER (NEW)
import TeacherLogin from "./assets/Teacher/TeacherLogin";
import TeacherDashboard from "./assets/Teacher/TeacherDashboard";

>>>>>>> 1e7fd8d (only thing left is implimenting the ai agent, added the readme file)
// =======================
// STUDENT PROTECTION
// =======================
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

// =======================
// ADMIN PROTECTION
// =======================
function AdminRoute({ children }) {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin/login" />;
}

<<<<<<< HEAD
=======
// =======================
// TEACHER PROTECTION (NEW)
// =======================
function TeacherRoute({ children }) {
  const token = localStorage.getItem("teacherToken");
  return token ? children : <Navigate to="/teacher/login" />;
}

>>>>>>> 1e7fd8d (only thing left is implimenting the ai agent, added the readme file)
function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

        {/* ================= LOGIN ================= */}
        <Route
          path="/"
          element={
            token ? <Navigate to="/attendance" /> : <Login />
          }
        />

<<<<<<< HEAD
=======
        {/* ================= TEACHER LOGIN (NEW) ================= */}
        <Route path="/teacher/login" element={<TeacherLogin />} />

        {/* ================= TEACHER DASHBOARD (NEW) ================= */}
        <Route
          path="/teacher"
          element={
            <TeacherRoute>
              <TeacherDashboard />
            </TeacherRoute>
          }
        />

>>>>>>> 1e7fd8d (only thing left is implimenting the ai agent, added the readme file)
        {/* ================= ACADEMICS ================= */}
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

        {/* ================= HOSTEL ================= */}
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

        {/* ================= UNIVERSITY ================= */}
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

        {/* ================= ADMIN ================= */}
<<<<<<< HEAD

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Dashboard */}
=======
        <Route path="/admin/login" element={<AdminLogin />} />

>>>>>>> 1e7fd8d (only thing left is implimenting the ai agent, added the readme file)
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;