import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchProfile(token);
    }
    else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (token) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    }
  };

  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateData = (userData) => {
    const existingToken = localStorage.getItem("token");
    setUser({ ...userData, token: existingToken });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
