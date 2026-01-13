// src/hooks/useAppInitialization.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/store/store';
import { initializeAuthWithPlaidSync } from '@/src/store/authSlice';
import { syncPlaidTokenFromDB,  markPlaidAsInitialized } from '@/src/store/plaidSlice';

export const useAppInitialization = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isInitialized: authInitialized, isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.auth
  );
  const { isInitialized: plaidInitialized } = useSelector(
    (state: RootState) => state.plaid
  );

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const authResult = await dispatch(initializeAuthWithPlaidSync()).unwrap();
        
        if (authResult.shouldSyncPlaid && authResult.accessToken) {
          await dispatch(syncPlaidTokenFromDB(authResult.accessToken));
        } else {
          dispatch(markPlaidAsInitialized());
        }
        
      } catch (error) {
        dispatch(markPlaidAsInitialized());
      }
    };

    if (!authInitialized || !plaidInitialized) {
      initializeApp();
    }
  }, [dispatch, authInitialized, plaidInitialized]);

  return {
    isInitialized: authInitialized && plaidInitialized,
    isAuthenticated,
    hasAccessToken: !!accessToken,
  };
};