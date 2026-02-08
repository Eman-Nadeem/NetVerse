import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword'; 
import Search from './pages/Search';
import Notifications from './pages/Notifications';
import Explore from './pages/Explore';
import FollowList from './pages/FollowList';
import { useAuthStore } from './store/authStore';

const App = () => {
  useEffect(() => {
    useAuthStore.getState().checkAuth(); // Check auth on app load
  }, []);

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Home />} />

        <Route path="profile" element={<Profile />} />
        <Route path="profile/:id" element={<Profile />} />
        <Route path="profile/:id/:type" element={<FollowList />} />

        <Route path="search" element={<Search />} />
        <Route path="explore" element={<Explore />} />
        <Route path="notifications" element={<Notifications />} />
        
        <Route path="settings" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      {/* Global Catch all -> redirect to Login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App