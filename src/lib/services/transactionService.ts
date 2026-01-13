// src/lib/services/transactionService.ts
import { ApiResponse } from '@/src/api/apiResponse';
import apiClient from '../axios';
import { handleApiError } from '@/src/api/errorHandler';
import { ErrorResponse } from '@/src/api/errorResponse';
import {
  TransactionPaginationResponseDto,
  TransactionRequestByChartOfAccount,
  TransactionsRequest,
  FetchTransactionsParams,
} from '@/src/types/generaldLedgerTypes';

/**
 * GET / Get all transactions
 */
export const fetchAllTransactions = async ({
  limit,
  page,
}: TransactionsRequest): Promise<TransactionPaginationResponseDto | ErrorResponse> => {
  try {
    const res = await apiClient.get<ApiResponse<TransactionPaginationResponseDto>>('ledger/search', {
      params: { page, limit },
    });
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * GET / Get transactions by date range
 */
export const fetchAllTransactionsByDate = async ({
  limit,
  page,
  startDate,
  endDate,
}: TransactionsRequest): Promise<TransactionPaginationResponseDto | ErrorResponse> => {
  try {
    const res = await apiClient.get<ApiResponse<TransactionPaginationResponseDto>>('ledger/search', {
      params: { page, limit, startDate, endDate },
    });
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * GET / Get transactions by Chart of Account
 */
export const fetchAllTransactionsByChartOfAccount = async ({
  limit,
  page,
  accountId,
  startDate,
  endDate,
  type,
}: TransactionRequestByChartOfAccount): Promise<TransactionPaginationResponseDto | ErrorResponse> => {
  try {
    const res = await apiClient.get<ApiResponse<TransactionPaginationResponseDto>>('ledger/search', {
      params: {
        page,
        limit,
        accountId,
        type,
        ...(startDate && endDate ? { startDate, endDate } : {}),
      },
    });
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * GET /transaction/by-bank-account/:id - Get all transactions by bank account
 */
export const fetchTransactionsByBankAccount = async (
  id: string,
  limit: number,
  page: number
): Promise<TransactionPaginationResponseDto | ErrorResponse> => {
  try {
    const res = await apiClient.get<ApiResponse<TransactionPaginationResponseDto>>(
      `transaction/by-bank-account/${id}`,
      { params: { page, limit } }
    );
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Refresh transaction data
 */
export const refreshTransactionData = async (): Promise<{ status: true } | ErrorResponse> => {
  try {
    await apiClient.get<ApiResponse<null>>('plaid/refresh-transactions');
    return { status: true };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 *  Get all transactions by Plaid Item
 */
export const fetchTransactionsByPlaidItem = async (
  plaidItemId: string,
  pagination: FetchTransactionsParams
): Promise<TransactionPaginationResponseDto | ErrorResponse> => {
  try {
    const res = await apiClient.get<ApiResponse<TransactionPaginationResponseDto>>('ledger/search', {
      params: {
        plaidItemId,
        accountId: pagination.accountId,
        subaccountId: pagination.subaccountId,
        page: pagination.page || 1,
        limit: pagination.limit || 20,
        ...(pagination.startDate && { startDate: pagination.startDate }),
        ...(pagination.endDate && { endDate: pagination.endDate }),
      },
    });
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get all transactions by Plaid Item with date range
 */
export const fetchTransactionsByPlaidItemAndDate = async (
  plaidItemId: string,
  { page, limit, startDate, endDate }: TransactionsRequest
): Promise<TransactionPaginationResponseDto | ErrorResponse> => {
  try {
    const res = await apiClient.get<ApiResponse<TransactionPaginationResponseDto>>(
      `transaction/all-with-details-by-plaid-item-and-date/${plaidItemId}`,
      {
        params: {
          page: page || 1,
          limit: limit || 20,
          startDate,
          endDate,
        },
      }
    );
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get transactions by Plaid Item and Chart Account
 */
export const fetchTransactionsByPlaidItemAndChartAccount = async (
  plaidItemId: string,
  chartAccountId: string,
  pagination: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    type: 'account' | 'subaccount';
  }
): Promise<TransactionPaginationResponseDto | ErrorResponse> => {
  try {
    const res = await apiClient.get<ApiResponse<TransactionPaginationResponseDto>>(
      `transaction/all-with-details-by-plaidItem-and-chart-account-and-date/${plaidItemId}/${chartAccountId}`,
      {
        params: {
          page: pagination.page || 1,
          limit: pagination.limit || 20,
          type: pagination.type,
          ...(pagination.startDate && { startDate: pagination.startDate }),
          ...(pagination.endDate && { endDate: pagination.endDate }),
        },
      }
    );
    return res.data.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get transactions by Plaid Item with advanced filters (chart account + bank account)
 */
export const fetchTransactionsByPlaidItemWithAdvancedFilters = async (
  plaidItemId: string,
  pagination: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    type?: 'account' | 'subaccount';
  },
  chartAccountId?: string,
  bankAccountId?: string
): Promise<TransactionPaginationResponseDto | ErrorResponse> => {
  try {
    const url = `transaction/all-with-details-by-plaidItem-and-chart-account-and-date-and-bank-account/${plaidItemId}/${chartAccountId || null}/${bankAccountId || null}`;

    const res = await apiClient.get<ApiResponse<TransactionPaginationResponseDto>>(url, {
      params: {
        page: pagination.page || 1,
        limit: pagination.limit || 20,
        ...(pagination.type && { type: pagination.type }),
        ...(pagination.startDate && { startDate: pagination.startDate }),
        ...(pagination.endDate && { endDate: pagination.endDate }),
      },
    });

    return res.data.data;
  } catch (error) {
    console.error('Error in fetchTransactionsByPlaidItemWithAdvancedFilters:', error);
    return handleApiError(error);
  }
};
