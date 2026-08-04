import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { canAccessRoute } from '../utils/permissions';
import type { ReactNode } from 'react';

interface PermissionRouteProps {
  path: string;
  children: ReactNode;
}

export default function PermissionRoute({ path, children }: PermissionRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!canAccessRoute(path, user?.role, user?.permissions)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
