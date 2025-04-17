import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Если пользователь не авторизован, перенаправляем на страницу входа
    return <Navigate to="/login" replace />;
  }

  if (!currentUser.isAdmin) {
    // Если пользователь не админ, перенаправляем на главную страницу
    return <Navigate to="/" replace />;
  }

  // Если пользователь авторизован и является администратором, рендерим дочерний компонент
  return children;
};

export default AdminRoute; 