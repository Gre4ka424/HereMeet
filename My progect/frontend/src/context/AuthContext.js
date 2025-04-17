import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Настройка axios - добавление токена к запросам
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Проверка токена и получение данных пользователя при загрузке
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Проверяем, не истек ли токен
        const decodedToken = jwt_decode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {
          // Токен истек
          logout();
          setLoading(false);
          return;
        }

        // Получаем данные текущего пользователя
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`);
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error verifying token:', error);
        logout();
      }
      
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  // Функция для регистрации пользователя
  const register = async (userData) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, userData);
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    setToken(token);
    setCurrentUser(user);
    
    return user;
  };

  // Функция для входа пользователя
  const login = async (credentials) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, credentials);
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    setToken(token);
    setCurrentUser(user);
    
    return user;
  };

  // Функция для выхода пользователя
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  };

  // Функция для обновления данных пользователя
  const updateProfile = async (userId, profileData) => {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/users/${userId}`, profileData);
    setCurrentUser(response.data);
    return response.data;
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 