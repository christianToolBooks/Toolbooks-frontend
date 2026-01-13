import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  IAuthResponse,
  IRegisterUserPayload,
  loginUserServer,
  registerUser,
  getFreshUser,
} from "@/src/lib/services/auth.server";
import { User } from "../types/user";

// Utility functions for cookie management
export const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window !== "undefined") {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
  }
};

export const getCookie = (name: string): string | null => {
  if (typeof window !== "undefined") {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
};

export const deleteCookie = (name: string) => {
  if (typeof window !== "undefined") {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;secure;samesite=strict`;
  }
};

// define initial state for the auth slice
interface AuthState {
  user: User | null;
  business_type: string | undefined;
  accessToken: string | null;
  isAuthenticated: boolean;
  getStartedComplete: boolean;
  onboardingComplete: boolean;
  hasSubscription: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  showWelcomeLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  business_type: undefined,
  accessToken: null,
  isAuthenticated: false,
  getStartedComplete: false,
  onboardingComplete: false,
  hasSubscription: false,
  isLoading: false,
  error: null,
  isInitialized: false,
  showWelcomeLoading: false,
};

// async thunk for logging in a user
export const loginUser = createAsyncThunk<
  IAuthResponse,
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await loginUserServer(email, password);
    return response;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Login failed"
    );
  }
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to logout on server");
    }

    deleteCookie("accessToken");
    deleteCookie("user");
    deleteCookie("get_started_complete");
    deleteCookie("onboarding_complete");
    
    if (typeof window !== "undefined") {
      localStorage.removeItem("welcome_loading_shown");
    }
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Logout failed"
    );
  }
});

export const registerUserAsync = createAsyncThunk<
  User,
  IRegisterUserPayload,
  { rejectValue: string }
>("auth/registerUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await registerUser(userData);
    return response;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Registration failed"
    );
  }
});

export const refreshUser = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("auth/refreshUser", async (accessToken, { rejectWithValue }) => {
  try {
    const response = await getFreshUser(accessToken);
    return response;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to refresh user"
    );
  }
});

export const initializeAuthWithPlaidSync = createAsyncThunk<
  { shouldSyncPlaid: boolean; accessToken: string | null },
  void,
  { rejectValue: string }
>("auth/initializeAuthWithPlaidSync", async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(loadFromCookies());
    
    const token = getCookie("accessToken");
    const userStr = getCookie("user");
    
    if (token && userStr) {
      try {
        JSON.parse(userStr); 
        return { shouldSyncPlaid: true, accessToken: token };
      } catch (error) {
        console.error("Error parsing user from cookies:", error);
        deleteCookie("accessToken");
        deleteCookie("user");
        return { shouldSyncPlaid: false, accessToken: null };
      }
    } else {
      return { shouldSyncPlaid: false, accessToken: null };
    }
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to initialize auth"
    );
  }
});

// slice for authentication state management
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.showWelcomeLoading = false;
      deleteCookie("accessToken");
      deleteCookie("user");
      deleteCookie("get_started_complete");
      deleteCookie("onboarding_complete");

      if (typeof window !== "undefined") {
        localStorage.removeItem("welcome_loading_shown");
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.business_type =
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.error = null;
      // Save to cookies
      setCookie("accessToken", action.payload.accessToken);
      setCookie("user", JSON.stringify(action.payload.user));
    },
    loadFromCookies: (state) => {
      const token = getCookie("accessToken");
      const userStr = getCookie("user");

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          state.accessToken = token;
          state.user = user;
          state.business_type = user.businessProfile?.businessProfile.business_type;
          state.isAuthenticated = true;
          state.error = null;
        } catch (error) {
          deleteCookie("accessToken");
          deleteCookie("user");
          state.isAuthenticated = false;
          state.user = null;
          state.accessToken = null;
          state.business_type = undefined;
          state.showWelcomeLoading = false;
        }
      } else {
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.business_type = undefined;
        state.showWelcomeLoading = false;
      }

      state.isInitialized = true;
    },
    forceAuthenticationState: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.error = null;
      state.isInitialized = true;
      // Save to cookies
      setCookie("accessToken", action.payload.accessToken);
      setCookie("user", JSON.stringify(action.payload.user));
    },
    // new action to complete welcome loading
    completeWelcomeLoading: (state) => {
      state.showWelcomeLoading = false;
      
      if (typeof window !== "undefined") {
        localStorage.setItem("welcome_loading_shown", "true");
      }
    },
    setUserStatus:(
      state,
      action: PayloadAction<{
        getStartedComplete: boolean;
        onboardingComplete: boolean;
        hasSubscription: boolean;
      }>) => {
        state.getStartedComplete = action.payload.getStartedComplete;
        state.onboardingComplete =  action.payload.onboardingComplete;
        state.hasSubscription = action.payload.hasSubscription;
      },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
        state.isInitialized = true;
        const hasShownWelcome =
          typeof window !== "undefined"
            ? localStorage.getItem("welcome_loading_shown") === "true"
            : false;

        state.showWelcomeLoading = !hasShownWelcome;
        // Save to cookies
        setCookie("accessToken", action.payload.accessToken);
        setCookie("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      })
      // Register cases
      .addCase(registerUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Registration failed";
      })
      // Refresh user cases
      .addCase(refreshUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        setCookie("user", JSON.stringify(action.payload));
      })
      .addCase(refreshUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to refresh user";
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = null;
        state.showWelcomeLoading = false;
        state.business_type = undefined;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Logout failed";
        // Aún así limpiamos el estado local
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.showWelcomeLoading = false;
        state.business_type = undefined;
      });
  },
});

export const {
  logout,
  clearError,
  setCredentials,
  loadFromCookies,
  forceAuthenticationState,
  completeWelcomeLoading,
  setUserStatus,
} = authSlice.actions;

export default authSlice.reducer;