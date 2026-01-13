import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import plaidReducer from './plaidSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    plaid: plaidReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;