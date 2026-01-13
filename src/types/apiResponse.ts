export interface ResponseApiInterface {
  success: boolean;
  message: string;
}
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}