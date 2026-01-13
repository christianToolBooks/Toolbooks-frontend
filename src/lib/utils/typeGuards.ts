/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorResponse } from '@/src/api/errorResponse';

export function isErrorResponse(obj: any): obj is ErrorResponse {
  return obj && typeof obj === 'object' && 'message' in obj && 'statusCode' in obj;
}
