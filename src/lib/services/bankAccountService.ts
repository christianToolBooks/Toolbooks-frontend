// src/lib/services/bankAccountService.ts
import apiClient from '../axios';
import { AxiosError } from 'axios';
import { GeneralLedgerLine } from '@/src/types/generaldLedgerTypes';

// Interfaz genérica de respuesta de API
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// Interfaz para respuesta de cuentas
interface GetAccountResponse {
  success: boolean;
  message: string;
  accounts: GeneralLedgerLine[];
}

/**
 * GET /ledger/search - Obtiene todas las cuentas bancarias del usuario
 */
export const fetchBankAccounts = async (): Promise<GetAccountResponse> => {
  try {
    const res = await apiClient.get<ApiResponse<GeneralLedgerLine[]>>(
      'ledger/search'
    );

    const accounts = res.data.data || [];

    if (accounts.length === 0) {
      return {
        success: true,
        message: 'No accounts created yet',
        accounts: [],
      };
    }

    return {
      success: true,
      message: res.data.message || 'Accounts found',
      accounts,
    };
  } catch (error) {
    console.error('FetchBankAccountsError:', error);

    if (error instanceof AxiosError) {
      const errData = error.response?.data as ApiResponse<null>;

      return {
        success: false,
        message: errData?.message || error.message || 'Backend error occurred',
        accounts: [],
      };
    }

    return {
      success: false,
      message: 'Cannot get Bank Accounts. Network or unexpected error.',
      accounts: [],
    };
  }
};
