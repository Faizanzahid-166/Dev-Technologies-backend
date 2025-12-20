import React, { createContext, useState, useContext } from "react";
import { registerUser, loginUser, updateProfileApi } from "../api/authApi.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const register = async (name, email, password, role) => {
    try {
      setLoading(true);
      const res = await registerUser({ name, email, password, role });
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null); // triggers SocketProvider cleanup
  };

  const updateProfile = async (updates) => {
    const res = await updateProfileApi(updates);
    localStorage.setItem("user", JSON.stringify(res));
    setUser(res);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
