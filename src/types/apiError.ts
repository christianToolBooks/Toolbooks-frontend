/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IApiError {
  message: string;
  statusCode: number;
}

export interface IApiResponse<T, E> {
  success: boolean;
  message: string;
  data: T;
  error: E | IApiError;
}

export type ApiErrorResponse = {
  statusCode: number;
  timestamp: string;
  path: string;
  otherKeys?: {
    error: string;
    [key: string]: any;
  };
  message: string[];
};