import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { db, type User } from '@/data/mockStore';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('erp_currentUser');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = useCallback((email: string, password: string) => {
    const found = db.login(email, password);
    if (found) {
      setUser(found);
      localStorage.setItem('erp_currentUser', JSON.stringify(found));
      return { success: true, message: 'Login successful' };
    }
    return { success: false, message: 'Invalid email or password' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('erp_currentUser');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
