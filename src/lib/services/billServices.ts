// src/lib/services/billServices.ts
import { ApiResponse } from '@/src/api/apiResponse';
import { ErrorResponse } from '@/src/api/errorResponse';
import apiClient from '../axios';
import { handleApiError } from '@/src/api/errorHandler';
import { ApBillCreatePayload, BillData, BillDataResponseFromAPI, BillDataByIdFromAPI, BillMetrics } from '@/src/types/billPayTypes';

/**
 * Create Bill (with or without file)
 */
export async function createBill(
  payload: ApBillCreatePayload,
  file?: File
): Promise<ApiResponse<BillData> | ErrorResponse> {
  try {
    // Case 1: Simple payload (no file)
    if (!file) {
      const res = await apiClient.post<ApiResponse<BillData>>('bill-pay/create-bill', payload);
      return res.data;
    }

    // Case 2: Multipart form with file upload
    const fd = new FormData();

    const append = (key: string, value: unknown, required = false) => {
      if (value === undefined || value === null || value === '') {
        if (required) throw new Error(`Missing ${key}`);
        return;
      }
      fd.append(key, String(value));
    };

    // Solo agregar campos del payload, NO metadata
    append('vendorId', payload.vendorId, true);
    append('account_id', payload.account_id ?? '');
    append('subaccount_id', payload.subaccount_id ?? '');
    append('invoiceNumber', payload.invoiceNumber, true);
    append('invoiceDate', payload.invoiceDate, true);
    append('dueDate', payload.dueDate, true);
    append('currency', (payload.currency || '').toUpperCase(), true);
    append('subtotal', payload.subtotal, true);
    append('taxTotal', payload.taxTotal, true);
    append('discountTotal', payload.discountTotal, true);
    append('total', payload.total, true);
    append('memo', payload.memo ?? '');

    // NO agregar confidence, warnings, discrepancies

    (payload.lines || []).forEach((line, i) => {
      append(`lines[${i}][lineNo]`, line.lineNo, true);
      append(`lines[${i}][description]`, line.description ?? '');
      append(`lines[${i}][quantity]`, line.quantity, true);
      append(`lines[${i}][unitPrice]`, line.unitPrice, true);
      append(`lines[${i}][amount]`, line.amount, true);
      append(`lines[${i}][department]`, line.department ?? '');
      append(`lines[${i}][taxCode]`, line.taxCode ?? '');
    });

    fd.append('file', file, file.name);

    const res = await apiClient.post<ApiResponse<BillData>>('bill-pay/create-bill', fd);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * OCR Scan Bill from File
 */
export async function scanBill(file: File): Promise<ApiResponse<BillDataResponseFromAPI> | ErrorResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await apiClient.post<ApiResponse<BillDataResponseFromAPI>>('bill-pay/scan-bill', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get Bill Metrics
 */
export async function getBillMetrics(): Promise<ApiResponse<BillMetrics> | ErrorResponse> {
  try {
    const res = await apiClient.get<ApiResponse<BillMetrics>>('bill-pay/bills-metrics');
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get All Bills
 */
export async function getAllBills(): Promise<ApiResponse<BillDataByIdFromAPI[]> | ErrorResponse> {
  try {
    const res = await apiClient.get<ApiResponse<BillDataByIdFromAPI[]>>('bill-pay/all-bills');
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Search Bills
 */
export async function getBillsSearch(query: string): Promise<ApiResponse<BillDataResponseFromAPI[]> | ErrorResponse> {
  try {
    const res = await apiClient.get<ApiResponse<BillDataResponseFromAPI[]>>('bill-pay/search-bills', {
      params: { query },
    });
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get Bill By ID with full details
 */
export async function getBillById(billId: string): Promise<ApiResponse<BillDataByIdFromAPI> | ErrorResponse> {
  try {
    const res = await apiClient.get<ApiResponse<BillDataByIdFromAPI>>(`bill-pay/bill/${billId}`);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}
