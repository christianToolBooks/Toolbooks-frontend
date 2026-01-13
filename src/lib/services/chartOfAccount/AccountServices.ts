// src/lib/services/chartOfAccount/AccountServices.ts
import apiClient from '../../axios';
import { handleApiError } from '@/src/api/errorHandler';
import {
  Account,
  AccountWithCurrentBalanceAndSubAccounts,
} from '@/src/types/chart-of-accounts';
import { AccountFormValues } from '../../schemas/coa';
import { ErrorResponse } from '@/src/api/errorResponse';
import { ApiResponse } from '@/src/api/apiResponse';

/**
 * Obtiene todas las cuentas del plan contable
 */
export const fetchChartOfAccounts = async (): Promise<
  AccountWithCurrentBalanceAndSubAccounts[] | ErrorResponse
> => {
  try {
    const res = await apiClient.get<ApiResponse<AccountWithCurrentBalanceAndSubAccounts[]>>('account');
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Obtiene una cuenta por ID
 */
export const fetchAccountById = async (
  id: string
): Promise<Account | ErrorResponse> => {
  try {
    const res = await apiClient.get<ApiResponse<Account>>(`account/${id}`);
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Crea una cuenta
 */
export const createAccountOfCoa = async (
  data: AccountFormValues
): Promise<Account | ErrorResponse> => {
  try {
    const res = await apiClient.post<ApiResponse<Account>>('account', data);
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Actualiza una cuenta existente
 */
export const updateAccountOfCoa = async (
  data: AccountFormValues,
  accountId: string
): Promise<Account | ErrorResponse> => {
  try {
    const res = await apiClient.patch<ApiResponse<Account>>(
      `account/${accountId}`,
      data
    );
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Activa una cuenta
 */
export const activeAnAccountOfCoa = async (
  accountId: string
): Promise<Account | ErrorResponse> => {
  try {
    const res = await apiClient.patch<ApiResponse<Account>>(
      `account/${accountId}/activate`
    );
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Desactiva una cuenta
 */
export const desactivateAnAccountOfCoa = async (
  accountId: string
): Promise<Account | ErrorResponse> => {
  try {
    const res = await apiClient.patch<ApiResponse<Account>>(
      `account/${accountId}/deactivate`
    );
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};
