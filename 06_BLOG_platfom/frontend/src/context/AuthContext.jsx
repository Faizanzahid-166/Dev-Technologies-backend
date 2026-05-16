import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('blogToken');
    const storedUser = localStorage.getItem('blogUser');

    let parsedUser = null;
    if (storedUser && storedUser !== 'undefined') {
      try {
        parsedUser = JSON.parse(storedUser);
      } catch (err) {
        // If stored value is malformed (for example the string "undefined"),
        // ignore it and continue with null user to avoid crashing the app.
        // eslint-disable-next-line no-console
        console.warn('AuthContext: failed to parse stored user', err);
      }
    }

    if (storedToken) setToken(storedToken);
    if (parsedUser) setUser(parsedUser);
    setLoading(false);
  }, []);

  const login = useCallback((userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('blogToken', userToken);
    localStorage.setItem('blogUser', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('blogToken');
    localStorage.removeItem('blogUser');
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};