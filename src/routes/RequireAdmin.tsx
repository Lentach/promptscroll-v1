import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/features/auth/hooks/useUser';

interface RequireAdminProps {
  children: React.ReactElement;
  redirectTo?: string;
}

export const RequireAdmin: React.FC<RequireAdminProps> = ({ children, redirectTo = '/' }) => {
  const { user, loading } = useUser();

  if (loading) return null;

  const isAdmin = !!(user?.user_metadata?.is_admin);

  if (!isAdmin) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}; 