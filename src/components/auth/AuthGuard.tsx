'use client';

import { useAuthGuard } from '@/src/app/auth/hooks/useAuthGuard';
import React from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
}) => {
  const { isAuthenticated } = useAuthGuard();


  if (!isAuthenticated) {
    return null; 
  }

  return <>{children}</>;
};
