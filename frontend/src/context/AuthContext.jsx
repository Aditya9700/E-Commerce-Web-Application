import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth state from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('gadgethub_user');
    const storedToken = localStorage.getItem('gadgethub_token');
    
    if (storedUser && storedToken) {
      setCurrentUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = response.data;

      setCurrentUser(receivedUser);
      setToken(receivedToken);

      localStorage.setItem('gadgethub_user', JSON.stringify(receivedUser));
      localStorage.setItem('gadgethub_token', receivedToken);
      
      setLoading(false);
      return receivedUser;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token: receivedToken, user: receivedUser } = response.data;

      setCurrentUser(receivedUser);
      setToken(receivedToken);

      localStorage.setItem('gadgethub_user', JSON.stringify(receivedUser));
      localStorage.setItem('gadgethub_token', receivedToken);

      setLoading(false);
      return receivedUser;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('gadgethub_user');
    localStorage.removeItem('gadgethub_token');
  };

  const value = {
    currentUser,
    user: currentUser, // Export alias for backward compatibility with pages using `user`
    token,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin', // Determine role from backend model property
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
