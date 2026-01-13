'use client';

import { useGuestGuard } from '@/src/app/auth/hooks/useGuestGuard';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import React from 'react';
import Component from './loadingPage/loadingPage';

interface GuestGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const GuestGuard: React.FC<GuestGuardProps> = ({ 
  children, 
  fallback = <Component/>
}) => {
  const isInitialized = useSelector((state: RootState) => state.auth.isInitialized);
  const { isAuthenticated, isLoading } = useGuestGuard();

  if (!isInitialized || isLoading) {
    return <>{fallback}</>;
  }

  if (isAuthenticated) {
    return null; // The hook already handles redirection
  }

  return <>{children}</>;
};


