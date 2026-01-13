import { handleApiError } from "@/src/api/errorHandler";
import apiClient from "../axios";
import { ApiResponse } from "@/src/api/apiResponse";
import {
  BankReconciliationApiResponse,
  liveReconciliationResponse,
  ReconciliationQueryApiResponse,
  PaginatedReconciliationsResponse,
  PaginatedSessionResponse,
} from "@/src/types/bank-reconciliation";

export async function getAllReconciliations(
  page: number = 1,
  limit: number = 10
) {
  try {
    const res = await apiClient.get<
      ApiResponse<PaginatedReconciliationsResponse>
    >(`/bank-reconciliations/all?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getLastReconciliation() {
  try {
    const res = await apiClient.get<
      ApiResponse<ReconciliationQueryApiResponse>
    >("/bank-reconciliations/summary");
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getReconciliationByMonth(year: number, month: number) {
  try {
    const res = await apiClient.get<
      ApiResponse<ReconciliationQueryApiResponse>
    >(`/bank-reconciliations/summary/${year}/${month}`);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getRealTimeReconciliation() {
  try {
    const res = await apiClient.get<ApiResponse<liveReconciliationResponse>>(
      "/bank-reconciliations/live"
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function refreshReconciliationData() {
  try {
    const res = await apiClient.post<ApiResponse<liveReconciliationResponse>>(
      "/bank-reconciliations/live/refresh"
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getAllSummarySessionsPDF(year: number, month: number) {
  try {
    const res = await apiClient.get(
      `/bank-reconciliations/summary/${year}/${month}/download`,
      {
        responseType: "blob",
      }
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getSessionPDF(session_id: string) {
  try {
    const res = await apiClient.get(
      `/bank-reconciliations/sessions/${session_id}/pdf`,
      {
        responseType: "blob",
      }
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getTransactionSession(
  sessionId: string,
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<PaginatedSessionResponse>> {
  try {
    const res = await apiClient.get<ApiResponse<PaginatedSessionResponse>>(
      `/bank-reconciliations/sessions/${sessionId}/transactions?page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (error) {
     handleApiError(error);
        throw error;
  }
}

