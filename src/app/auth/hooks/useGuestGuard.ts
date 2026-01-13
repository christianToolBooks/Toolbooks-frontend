'use client'
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './redux';

export const useGuestGuard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && isAuthenticated ) {
      // Don't redirect if user is on onboarding
      if( pathname === '/auth' && !pathname.includes('/onboarding')){
        router.push('/auth');
      }
    } else if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  return { isAuthenticated, isLoading };
};