import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { ReactNode } from 'react';

export const ProtectedRoute = ({ children, allowedRoles }: { children: ReactNode; allowedRoles?: string[] }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to={`/${user.role}`} replace />;
  return <>{children}</>;
};
