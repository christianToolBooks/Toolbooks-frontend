// src/lib/services/chartOfAccount/subAccount.services.ts
import apiClient from '../../axios';
import { handleApiError } from '@/src/api/errorHandler';
import { SubAccount } from '@/src/types/chart-of-accounts';
import { SubAccountFormValues } from '../../schemas/subAccount';
import { ErrorResponse } from '@/src/api/errorResponse';
import { ApiResponse } from '@/src/api/apiResponse';

/**
 * Obtiene una subcuenta por ID
 */
export const fetchSubAccountById = async (
  id: string
): Promise<SubAccount | ErrorResponse> => {
  try {
    const res = await apiClient.get<ApiResponse<SubAccount>>(`sub-accounts/${id}`);
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Crea una nueva subcuenta
 */
export const createSubAccountOfCoa = async (
  accountId: string,
  data: SubAccountFormValues
): Promise<SubAccount | ErrorResponse> => {
  try {
    const formattedData = { ...data, accountId };
    const res = await apiClient.post<ApiResponse<SubAccount>>(
      'sub-accounts',
      formattedData
    );
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Actualiza una subcuenta existente
 */
export const updateSubAccountOfCoa = async (
  subAccountId: string,
  data: SubAccountFormValues
): Promise<SubAccount | ErrorResponse> => {
  try {
    const res = await apiClient.patch<ApiResponse<SubAccount>>(
      `sub-accounts/${subAccountId}`,
      data
    );
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Activa una subcuenta
 */
export const activeSubAccount = async (
  accountId: string
): Promise<SubAccount | ErrorResponse> => {
  try {
    const res = await apiClient.patch<ApiResponse<SubAccount>>(
      `sub-accounts/${accountId}/activate`
    );
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Desactiva una subcuenta
 */
export const desactivateSubAccount = async (
  accountId: string
): Promise<SubAccount | ErrorResponse> => {
  try {
    const res = await apiClient.patch<ApiResponse<SubAccount>>(
      `sub-accounts/${accountId}/deactivate`
    );
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};
