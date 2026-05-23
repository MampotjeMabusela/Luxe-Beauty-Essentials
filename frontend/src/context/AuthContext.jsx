import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('luxe_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authService.me();
      setUser(data.user);
      setAddresses(data.addresses || []);
    } catch {
      localStorage.removeItem('luxe_token');
      localStorage.removeItem('luxe_refresh');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await authService.login({ email, password });
    localStorage.setItem('luxe_token', data.token);
    localStorage.setItem('luxe_refresh', data.refreshToken);
    setUser(data.user);
    await loadUser();
    return data;
  };

  const register = async (form) => {
    const { data } = await authService.register(form);
    localStorage.setItem('luxe_token', data.token);
    localStorage.setItem('luxe_refresh', data.refreshToken);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      /* ignore */
    }
    localStorage.removeItem('luxe_token');
    localStorage.removeItem('luxe_refresh');
    setUser(null);
    setAddresses([]);
  };

  return (
    <AuthContext.Provider
      value={{ user, addresses, loading, login, register, logout, loadUser, isAdmin: user?.is_admin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
