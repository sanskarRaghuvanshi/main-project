import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      API.get('/auth/me').then(r => { setUser(r.data.data); localStorage.setItem('user', JSON.stringify(r.data.data)); }).catch(() => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); }).finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const login = async (email, password) => {
    const r = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', r.data.token);
    localStorage.setItem('user', JSON.stringify(r.data.user));
    setUser(r.data.user);
    return r.data;
  };

  const register = async (name, email, password) => {
    const r = await API.post('/auth/register', { name, email, password });
    return r.data;
  };

  const verifyOTP = async (userId, otp) => {
    const r = await API.post('/auth/verify-otp', { userId, otp });
    localStorage.setItem('token', r.data.token);
    localStorage.setItem('user', JSON.stringify(r.data.user));
    setUser(r.data.user);
    return r.data;
  };

  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); };

  const updateProfile = async (data) => {
    const r = await API.put('/auth/me', data);
    setUser(r.data.data);
    localStorage.setItem('user', JSON.stringify(r.data.data));
    return r.data;
  };

  return <AuthContext.Provider value={{ user, loading, login, register, verifyOTP, logout, updateProfile }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
