/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/plaidSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "@/src/lib/axios";
import { PlaidItems } from "../types/authInterfaces";

interface PlaidState {
  plaidItems: PlaidItems[];
  connectedAccountMetadata: any | null; 
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: PlaidState = {
  plaidItems: [],
  connectedAccountMetadata: null,
  isLoading: false,
  error: null,
  isInitialized: false,
};

export const syncPlaidTokenFromDB = createAsyncThunk<
  { plaidItems: PlaidItems[]; metadata?: any },
  string, 
  { rejectValue: string }
>("plaid/syncPlaidTokenFromDB", async (userAccessToken, { rejectWithValue }) => {
  try {
    
    const response = await apiClient.get('/user/me', {
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
      },
    });

    const user = response.data;
    
    const plaidItems = user.plaidAccessTokens 
      ? user.plaidAccessTokens.map((token: string) => ({ access_token: token }))
      : [];
    

    let metadata = null;
    if (plaidItems.length > 0) {
      try {
        const institutionsResponse = await apiClient.get('/plaid/institutions', {
          headers: {
            Authorization: `Bearer ${userAccessToken}`,
          },
        });
        metadata = institutionsResponse.data;
      } catch (error) {
        console.warn('Could not fetch institutions metadata:', error);
      }
    }
    
    return {
      plaidItems,
      metadata
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to sync Plaid token from database"
    );
  }
});

const plaidSlice = createSlice({
  name: "plaid",
  initialState,
  reducers: {
    setPlaidItems: (
      state,
      action: PayloadAction<{ plaidItems: PlaidItems[]; metadata?: any }>
    ) => {
      state.plaidItems = action.payload.plaidItems;
      state.connectedAccountMetadata = action.payload.metadata || null;
      state.error = null;
    },
    addPlaidItem: (
      state,
      action: PayloadAction<{ plaidItem: PlaidItems; metadata?: any }>
    ) => {
      if (!Array.isArray(state.plaidItems)) {
        state.plaidItems = [];
      }
      
      if (action.payload.metadata) {
        state.connectedAccountMetadata = action.payload.metadata;
      }
      
      state.error = null;
    },
   
    clearPlaidData: (state) => {
      state.plaidItems = [];
      state.connectedAccountMetadata = null;
      state.error = null;
      state.isInitialized = false;
    },
    setPlaidLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setPlaidError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    markPlaidAsInitialized: (state) => {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncPlaidTokenFromDB.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(syncPlaidTokenFromDB.fulfilled, (state, action) => {
        state.isLoading = false;
        
        const { plaidItems, metadata } = action.payload;
        
        if (plaidItems && Array.isArray(plaidItems)) {
          state.plaidItems = plaidItems;
          state.connectedAccountMetadata = metadata || null;
        } else {
          state.plaidItems = [];
          state.connectedAccountMetadata = null;
        }
        
        state.isInitialized = true;
      })
      .addCase(syncPlaidTokenFromDB.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to sync Plaid token";
        state.isInitialized = true;
      });
  },
});

export const {
  setPlaidItems,
  addPlaidItem,
  clearPlaidData,
  setPlaidLoading,
  setPlaidError,
  markPlaidAsInitialized,
} = plaidSlice.actions;

export default plaidSlice.reducer;