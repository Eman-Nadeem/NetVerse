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
import Chats from './pages/Chats';
import { useAuthStore } from './store/authStore';
import { useNotificationStore } from './store/notificationStore';
import { useChatStore } from './store/chatStore';
import { getSocket, joinUserRoom } from './lib/socket';
import ChatRoom from './pages/ChatRoom';

const App = () => {
  const { user, isAuthenticated } = useAuthStore();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const incrementUnread = useChatStore((state) => state.incrementUnread);
  const fetchUnreadCount = useChatStore((state) => state.fetchUnreadCount);

  useEffect(() => {
    useAuthStore.getState().checkAuth(); // Check auth on app load
  }, []);

  // Join socket room and set up global notification listener
  useEffect(() => {
    if (isAuthenticated && user?._id) {
      localStorage.setItem('user', JSON.stringify(user));
      // Initialize socket and join user's notification room
      const socket = getSocket();
      joinUserRoom(user._id);

      // Fetch initial unread chat count
      fetchUnreadCount();

      // Global listener for real-time notifications
      const handleNewNotification = (notification) => {
        console.log('📬 New notification received:', notification);
        addNotification(notification);
      };

      // Global listener for new messages (increment unread badge)
      const handleNewMessage = (message) => {
        // Only increment if the message is not from the current user
        if (message.sender?._id !== user._id) {
          const msgChatId = message.chatId?._id || message.chatId;
          console.log('💬 New message received, checking if should increment unread');
          incrementUnread(msgChatId);
        }
      };

      socket.on('newNotification', handleNewNotification);
      socket.on('newMessage', handleNewMessage);

      return () => {
        socket.off('newNotification', handleNewNotification);
        socket.off('newMessage', handleNewMessage);
      };
    }
  }, [isAuthenticated, user, addNotification, incrementUnread, fetchUnreadCount]);

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

        <Route path="chats" element={<Chats />} />
        <Route path="chats/:chatId" element={<ChatRoom />} />

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