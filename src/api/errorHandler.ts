import { AxiosError } from "axios";
import { ErrorResponse } from "./errorResponse";

export const handleApiError = (error: unknown): ErrorResponse => {
  if (error instanceof AxiosError) {
    if (error.response) {
      const { status, data } = error.response;
      return {
        statusCode: status,
        message: data?.message || "Unknown error occurred",
      };
    } else if (error.request) {
      return { statusCode: 0, message: "Unable to connect to the server" };
    }
  }

  return {
    statusCode: 0,
    message: error instanceof Error ? error.message : "Unexpected error occurred",
  };
};
