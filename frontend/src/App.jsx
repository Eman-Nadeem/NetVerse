import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';

const App = () => {
  return (
    <Routes>
      {/* Public Route: Login (Standalone, no Layout) */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes: Wrapped in Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="settings" element={<Profile />} /> {/* Reuse Profile for settings demo */}
        
        {/* Catch all for internal routes -> redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      {/* Global Catch all -> redirect to Login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App