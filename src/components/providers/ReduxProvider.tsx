'use client';

import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState, AppDispatch } from '@/src/store/store';

import {
  loadFromCookies,
  setUserStatus,
} from '@/src/store/authSlice';

import {
  syncPlaidTokenFromDB,
  markPlaidAsInitialized,
} from '@/src/store/plaidSlice';

import LoadingPage from '../auth/loadingPage/loadingPage';

interface ReduxProviderProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    isInitialized: isAuthInitialized,
  } = useSelector((state: RootState) => state.auth);

  const { isInitialized: isPlaidInitialized } = useSelector(
    (state: RootState) => state.plaid
  );

  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch(loadFromCookies());
        const { accessToken, isAuthenticated } = store.getState().auth;
        if (isAuthenticated && accessToken) {
          try {
            const res = await fetch('/api/user-status');
            if (res.ok) {
              const data = await res.json();

              dispatch(
                setUserStatus({
                  getStartedComplete: data.get_started_complete,
                  onboardingComplete: data.onboarding_complete,
                  hasSubscription: data.has_subscription,
                })
              );
            }
          } catch (error) {
            console.error('Failed to fetch user status:', error);
          }

          try {
            await dispatch(syncPlaidTokenFromDB(accessToken)).unwrap();
          } catch (error) {
            console.error('Failed to sync Plaid token:', error);
          }
        }
      } finally {
        dispatch(markPlaidAsInitialized());
      }
    };

    if (!isAuthInitialized || !isPlaidInitialized) {
      initializeApp();
    }
  }, [dispatch, isAuthInitialized, isPlaidInitialized]);

  if (!isAuthInitialized || !isPlaidInitialized) {
    return <LoadingPage />;
  }

  return <>{children}</>;
};

export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
};
