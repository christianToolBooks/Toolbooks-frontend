// app/services/auth.server.ts
import { AxiosError } from 'axios';
import apiClient from '@/src/lib/axios';
import { IResetPasswordPayload } from '@/src/types/ResetPassword';
import { User } from '@/src/types/user';
import { ApiResponse } from '@/src/api/apiResponse';
export interface IAuthResponse {
  accessToken: string;
  user: User;
}

export interface IRegisterUserPayload {
  email: string;
  password: string;
  name: string;
  lastName: string;
}

export async function loginUserServer(
  emailOrUsername: string,
  password: string
): Promise<IAuthResponse> {
  try {
    const response = await apiClient.post<ApiResponse<IAuthResponse>>(
      '/auth/login',
      { emailOrUsername, password }
    );

    const { data } = response.data;

    if (!data?.accessToken || !data?.user) {
      throw new Error('Login failed: Missing token or user data.');
    }

    return data;
  } catch (err) {
    console.error('LoginUserServerError:', err);
    let message = 'Internal server error during login';

    if (err instanceof AxiosError) {
      const errorData = err.response?.data as ApiResponse<null>;
      message = errorData?.message || err.message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    throw new Error(message);
  }
}

export async function registerUser(
  userData: IRegisterUserPayload
): Promise<User> {
  try {
    const response = await apiClient.post<ApiResponse<User>>(
      '/auth/register',
      userData
    );

    const { data } = response.data;

    if (!data?.id || !data?.email) {
      throw new Error('Registration failed: Incomplete user data.');
    }

    return data;
  } catch (err) {
    console.error('RegisterUserError:', err);
    let message = 'An unexpected error occurred during registration.';

    if (err instanceof AxiosError) {
      const errorData = err.response?.data as ApiResponse<null>;
      message = errorData?.message || err.message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    throw new Error(message);
  }
}

export async function loginUserWithCognitoCode(
  code: string
): Promise<IAuthResponse> {
  try {
    const response = await apiClient.post<ApiResponse<IAuthResponse>>(
      '/auth/login',
      { code }
    );

    const { data } = response.data;

    if (!data?.accessToken || !data?.user?.id) {
      throw new Error(
        'Cognito login failed: Missing essential token or user data.'
      );
    }

    return data;
  } catch (err) {
    console.error('LoginUserWithCognitoCodeError:', err);
    let message = 'Cognito login via backend failed.';

    if (err instanceof AxiosError) {
      const errorData = err.response?.data as ApiResponse<null>;
      message = errorData?.message || err.message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    throw new Error(message);
  }
}

export async function getFreshUser(accessToken: string): Promise<User> {
  try {
    const response = await apiClient.get<ApiResponse<User>>('/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { data } = response.data;

    if (!data?.id) {
      throw new Error('Failed to retrieve valid user data.');
    }

    return data;
  } catch (err) {
    console.error('GetFreshUserError:', err);
    let message = 'Could not fetch fresh user data.';

    if (err instanceof AxiosError) {
      const errorData = err.response?.data as ApiResponse<null>;
      message = errorData?.message || err.message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    throw new Error(message);
  }
}

export async function sendEmailVerificationToResetPassaword(
  email: string
): Promise<string> {
  try {
    const res = await apiClient.post<ApiResponse<{ message: string }>>(
      'auth/forgot-password',
      { email }
    );
    return res.data.message;
  } catch (error) {
    console.error('SendEmailVerificationError:', error);
    let message = 'Failed to send password reset email.';

    if (error instanceof AxiosError) {
      const errorData = error.response?.data as ApiResponse<null>;
      message = errorData?.message || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    throw new Error(message);
  }
}

export async function resetPasswordWithToken(
  password: string,
  token: string
): Promise<string> {
  try {
    const formattedData: IResetPasswordPayload = { token, password };
    const res = await apiClient.post<ApiResponse<{ message: string }>>(
      'auth/reset-password',
      formattedData
    );
    return res.data.message;
  } catch (error) {
    console.error('ResetPasswordWithTokenError:', error);
    let message = 'Could not reset password.';

    if (error instanceof AxiosError) {
      const errorData = error.response?.data as ApiResponse<null>;
      message = errorData?.message || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    throw new Error(message);
  }
}
