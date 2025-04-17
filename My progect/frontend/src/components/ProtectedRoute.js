import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Если пользователь не авторизован, перенаправляем на страницу входа
    return <Navigate to="/login" replace />;
  }

  // Если пользователь авторизован, рендерим дочерний компонент
  return children;
};

export default ProtectedRoute; 