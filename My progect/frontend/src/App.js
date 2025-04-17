import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { useAuth } from './context/AuthContext';

// Импорт компонентов страниц
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import UserList from './pages/UserList';
import UserProfile from './pages/UserProfile';
import Chat from './pages/Chat';
import Meetups from './pages/Meetups';
import AdminPanel from './pages/AdminPanel';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        Loading...
      </Box>
    );
  }

  return (
    <Routes>
      {/* Публичные маршруты */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Защищенные маршруты */}
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/users" replace />} />
        
        <Route path="/users" element={
          <ProtectedRoute>
            <UserList />
          </ProtectedRoute>
        } />
        
        <Route path="/users/:id" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path="/chats" element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } />
        
        <Route path="/chats/:userId" element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } />
        
        <Route path="/meetups" element={
          <ProtectedRoute>
            <Meetups />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        } />
      </Route>

      {/* Перенаправление неизвестных маршрутов */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App; 