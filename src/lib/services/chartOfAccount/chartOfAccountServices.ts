// src/lib/services/chartOfAccount/searchByCodeOrName.service.ts
import apiClient from '../../axios';
import { handleApiError } from '@/src/api/errorHandler';
import { Account, SubAccount } from '@/src/types/chart-of-accounts';
import { ErrorResponse } from '@/src/api/errorResponse';
import { ApiResponse } from '@/src/api/apiResponse';

export interface AccountWithType extends Account {
  type: 'account';
}

export interface SubAccountWithType extends SubAccount {
  type: 'subAccount';
}

export interface ChartOfAccountResponse {
  accounts: AccountWithType[];
  subAccounts: SubAccountWithType[];
}

/**
 * Busca cuentas y subcuentas por código o nombre
 */
export const fetchAllAccountsByNameOrCode = async (
  query: string
): Promise<ChartOfAccountResponse | ErrorResponse> => {
  try {
    const res = await apiClient.get<ApiResponse<ChartOfAccountResponse>>(
      'chart-of-account/search-by-code-or-name',
      { params: { query } }
    );
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};
