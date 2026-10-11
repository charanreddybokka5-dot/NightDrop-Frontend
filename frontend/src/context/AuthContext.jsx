import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('nightdrop_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('nightdrop_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If token exists, fetch latest user info
    if (token) {
      api.get('/api/auth/me')
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('nightdrop_user', JSON.stringify(res.data));
        })
        .catch(() => {
          // Token invalid or expired
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    const { token: jwtToken, ...userData } = res.data;
    localStorage.setItem('nightdrop_token', jwtToken);
    localStorage.setItem('nightdrop_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const register = async (formData) => {
    const res = await api.post('/api/auth/register', formData);
    const { token: jwtToken, ...userData } = res.data;
    localStorage.setItem('nightdrop_token', jwtToken);
    localStorage.setItem('nightdrop_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('nightdrop_token');
    localStorage.removeItem('nightdrop_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('nightdrop_user', JSON.stringify(updatedUser));
  };

  const isCustomer = user?.role === 'CUSTOMER';
  const isStoreOwner = user?.role === 'STORE_OWNER';
  const isDeliveryPartner = user?.role === 'DELIVERY_PARTNER';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateUser,
      isAuthenticated: !!token,
      isCustomer,
      isStoreOwner,
      isDeliveryPartner,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
