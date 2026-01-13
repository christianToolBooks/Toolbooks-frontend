// src/lib/services/plaid.services.ts
import { handleApiError } from '@/src/api/errorHandler';
import { ErrorResponse } from '@/src/api/errorResponse';
import apiClient from '../axios';
import { InstitutionInterface } from '@/src/hooks/useInstitutions';
import { BankAccount } from '@/src/types/bank-account';
import { ApiResponse } from '@/src/api/apiResponse';

export interface PlaidLinkTokenResponse {
  expiration: string;
  link_token: string;
  request_id: string;
}

export interface PlaidExchangeTokenResponse {
  status: boolean;
  message: string;
}

/**
 * Solicita un nuevo link token para Plaid
 */
export const fetchLinkToken = async (): Promise<
  PlaidLinkTokenResponse | ErrorResponse
> => {
  try {
    const res = await apiClient.post<ApiResponse<PlaidLinkTokenResponse>>('plaid/link-token');
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Solicita un link token específico para ingresos (Payroll)
 */
export const fetchLinkTokenPayroll = async (): Promise<
  PlaidLinkTokenResponse | ErrorResponse
> => {
  try {
    const res = await apiClient.post<ApiResponse<PlaidLinkTokenResponse>>('plaid/link-income-token');
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Intercambia un public_token de Plaid por un access_token y guarda la institución
 */
export const sendPublicTokenToGetAccessTokenAndSave = async (
  public_token: string,
  institution_name?: string,
  institution_id?: string
): Promise<PlaidExchangeTokenResponse | ErrorResponse> => {
  try {
    const cleanedToken = public_token.trim();

    const res = await apiClient.post<ApiResponse<PlaidExchangeTokenResponse>>(
      'plaid/exchange-token',
      {
        public_token: cleanedToken,
        institution_name,
        institution_id,
      }
    );

    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Obtiene todas las instituciones (items) conectadas a Plaid
 */
export const fetchPlaidItems = async (): Promise<
  InstitutionInterface[] | ErrorResponse
> => {
  try {
    const res = await apiClient.get<ApiResponse<InstitutionInterface[]>>('plaid/institutions');
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Obtiene las cuentas bancarias vinculadas a un item de Plaid
 */
export const fetchAccountsById = async (
  id: string
): Promise<BankAccount[] | ErrorResponse> => {
  try {
    const res = await apiClient.get<ApiResponse<BankAccount[]>>(`bank-account/by-plaid-item/${id}`);
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};
