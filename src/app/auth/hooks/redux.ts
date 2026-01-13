// src/app/auth/hooks/redux.ts
'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/src/store/store';
import { useEffect, useState } from 'react';

export const  useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);
  const {showWelcomeLoading} = authState;

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  return {
    ...authState,
    dispatch,
    isLoading: !isInitialized || authState.isLoading,
    showWelcomeLoading,
  };
};