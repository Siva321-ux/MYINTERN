import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (err) {
          console.warn('Auth check failed, clearing state', err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authService.register(name, email, password);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
