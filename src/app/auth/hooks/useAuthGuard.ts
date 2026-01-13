import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './redux';

export const useAuthGuard = (redirectTo: string = '/auth') => {
  const { isAuthenticated, isLoading, isInitialized, accessToken, user } = useAuth();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {

    if (!isInitialized) {
      return;
    }

    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
      setShouldRender(false);
      return;
    }

     if (isAuthenticated && accessToken && user) {
      setShouldRender(true);
      return;
    }

    setShouldRender(false);
  }, [isAuthenticated, isInitialized, isLoading, accessToken, user, router, redirectTo]);

  return { isAuthenticated: shouldRender, isLoading: !isInitialized || isLoading, user, accessToken };
};
