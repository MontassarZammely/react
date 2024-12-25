// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
// import Home from './components/Pages/Home';
import Notifications from './components/Notifications';
import Profile from './components/Pages/Profile';


function App() {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if user is authenticated

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/profile" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/profile" /> : <Register />} />

        {/* Protected Routes */}
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/notifications" element={isAuthenticated ? <Notifications /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
