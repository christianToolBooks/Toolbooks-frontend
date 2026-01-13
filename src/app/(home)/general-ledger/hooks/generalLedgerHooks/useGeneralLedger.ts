import {
  fetchAllTransactions,
  fetchAllTransactionsByDate,
  fetchAllTransactionsByChartOfAccount,
  refreshTransactionData,
} from '@/src/lib/services/transactionService';
import { isErrorResponse } from '@/src/lib/utils/typeGuards';
import {
  GeneralLedgerLine,
  TransactionRequestByChartOfAccount,
  TransactionsRequest,
} from '@/src/types/generaldLedgerTypes';
import { useCallback, useEffect, useState } from 'react';

export type DateFilter = {
  startDate: Date | null;
  endDate: Date | null;
};

export type AccountFilterType = {
  id: string;
  type: 'account' | 'subaccount';
};

export default function UseGeneralLedger() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<GeneralLedgerLine[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [dateToFilter, setDateToFilter] = useState<DateFilter>({
    startDate: null,
    endDate: null,
  });
  const [accountFilter, setAccountFilter] = useState<AccountFilterType | null>(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    const queryParams: TransactionsRequest = { page, limit: 20 };
    const res = await fetchAllTransactions(queryParams);

    if (isErrorResponse(res)) {
      setError(res.message);
      setIsLoading(false);
      return;
    }

    if (res.data.length === 0) {
      setTransactions([]);
      setTotalPages(0);
      setPage(1);
      setIsLoading(false);
      return;
    }

    setTransactions(res.data);
    setTotalPages(Math.ceil(res.total / 20));
    setIsLoading(false);
  }, [page]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const res = await refreshTransactionData();

    if (isErrorResponse(res)) {
      setError(res.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    fetchAll();
  }, [fetchAll]);

  const fetchByDate = useCallback(async () => {
    if (!dateToFilter.startDate || !dateToFilter.endDate) return;
    setIsLoading(true);

    const queryParams: TransactionsRequest = {
      page,
      limit: 20,
      startDate: dateToFilter.startDate.toISOString(),
      endDate: dateToFilter.endDate.toISOString(),
    };

    const res = await fetchAllTransactionsByDate(queryParams);

    if (isErrorResponse(res)) {
      setError(res.message);
      setIsLoading(false);
      return;
    }

    if (res.data.length === 0) {
      setTransactions([]);
      setTotalPages(0);
      setPage(1);
      setIsLoading(false);
      return;
    }

    setTransactions(res.data);
    setTotalPages(Math.ceil(res.total / 20));
    setIsLoading(false);
  }, [page, dateToFilter.startDate, dateToFilter.endDate]);

  const fetchByAccount = useCallback(async () => {
    if (!accountFilter) return;
    setIsLoading(true);

    const queryParams: TransactionRequestByChartOfAccount = {
      page,
      limit: 20,
      accountId: accountFilter.id,
      type: accountFilter.type,
      ...(dateToFilter.startDate && dateToFilter.endDate
        ? {
            startDate: dateToFilter.startDate.toISOString(),
            endDate: dateToFilter.endDate.toISOString(),
          }
        : {}),
    };

    const res = await fetchAllTransactionsByChartOfAccount(queryParams);

    if (isErrorResponse(res)) {
      setError(res.message);
      setIsLoading(false);
      return;
    }

    if (res.data.length === 0) {
      setTransactions([]);
      setTotalPages(0);
      setPage(1);
      setIsLoading(false);
      return;
    }

    setTransactions(res.data);
    setTotalPages(Math.ceil(res.total / 20));
    setIsLoading(false);
  }, [accountFilter, dateToFilter.startDate, dateToFilter.endDate, page]);

  useEffect(() => {
    const hasStart = Boolean(dateToFilter.startDate);
    const hasEnd = Boolean(dateToFilter.endDate);

    if (accountFilter) {
      fetchByAccount();
    } else if (hasStart && hasEnd) {
      fetchByDate();
    } else if (!hasStart && !hasEnd) {
      fetchAll();
    }
  }, [accountFilter, dateToFilter.startDate, dateToFilter.endDate, fetchAll, fetchByAccount, fetchByDate]);

  const clearFilter = () => {
    setDateToFilter({ startDate: null, endDate: null });
    setAccountFilter(null);
  };

  return {
    isLoading,
    page,
    setPage,
    totalPages,
    transactions,
    clearFilter,
    dateToFilter,
    setDateToFilter,
    setAccountFilter,
    error,
    refresh,
  };
}
