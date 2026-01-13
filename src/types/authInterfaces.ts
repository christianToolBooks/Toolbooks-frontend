export interface IUser {
  id: string;
  name: string;
  lastName: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
  refreshToken?: string;
}

export interface PlaidItems {
  status: boolean;
  message: string;
}