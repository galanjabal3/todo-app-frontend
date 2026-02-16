import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Init auth on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await userAPI.getProfile(); // already response.data
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 🔥 Signin
  const signin = async (identity, password) => {
    const user = await authAPI.signin({ identity, password });

    const token = user.token;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setUser(user);

    return user;
  };

  // 🔥 Signup
  const signup = async (data) => {
    const user = await authAPI.signup(data);

    return user
  };

  // 🔥 Signout
  const signout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // 🔥 Update user
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    signin,
    signup,
    signout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
