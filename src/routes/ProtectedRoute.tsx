import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  roles?: string | string[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles, children }) => {
  const { isLoggedIn, isLoadingUser, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoadingUser) {
      if (!isLoggedIn) {
        navigate({ to: '.', search: { redirect: '/login', replace: true } });
      } else if (roles && !hasRole(roles)) {
        navigate({ to: '.', search: { redirect: '/login', reason: 'forbidden' }, replace: true });
      }
    }
  }, [isLoadingUser, isLoggedIn, roles, hasRole, navigate]);

  if (isLoadingUser) return <div>Loading...</div>;
  if (!isLoggedIn) return null;
  if (roles && !hasRole(roles)) return null;

  return <>{children}</>;
};
