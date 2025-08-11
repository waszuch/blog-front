'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, authAPI } from './api';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = Cookies.get('token');
      console.log('Checking auth, token:', token ? 'exists' : 'not found');
      
      if (token) {
        const userData = await authAPI.getMe();
        console.log('User data received:', userData);
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      Cookies.remove('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login...');
      const response = await authAPI.login(email, password);
      console.log('Login response:', response);
      
      // Zapisz token
      Cookies.set('token', response.token, { expires: 7 });
      
      // Zapisz dane użytkownika
      const userData: User = {
        _id: response._id,
        username: response.username,
        email: response.email,
        role: response.role
      };
      setUser(userData);
      
      toast.success('Zalogowano pomyślnie!');
      
      // Przekierowanie
      console.log('Redirecting to admin panel...');
      window.location.href = '/admin/posts';
      
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.error || 'Błąd logowania');
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    window.location.href = '/login';
    toast.success('Wylogowano pomyślnie');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};