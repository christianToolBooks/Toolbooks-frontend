"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TransactionPaginationResponseDto } from "@/src/types/generaldLedgerTypes";
import { fetchTransactionsByPlaidItem } from "@/src/lib/services/transactionService";
import { ErrorResponse } from "@/src/api/errorResponse";

export interface DateFilter {
  startDate: Date | null;
  endDate: Date | null;
}

type AccountTarget =
  | { type: "account"; id: string }
  | { type: "subaccount"; id: string }
  | null;

interface UseTransactionsByPlaidItemProps {
  plaidItemId: string;
  initialPage?: number;
  pageSize?: number;
  autoFetch?: boolean;
  initialDate?: DateFilter;
  initialAccountTarget?: AccountTarget;
}

export function useTransactionsByPlaidItem({
  plaidItemId,
  initialPage = 1,
  pageSize = 20,
  autoFetch = true,
  initialDate,
  initialAccountTarget = null,
}: UseTransactionsByPlaidItemProps) {
  const [data, setData] =
    useState<TransactionPaginationResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorResponse | null>(null);

  const [page, setPage] = useState<number>(initialPage);
  const [dateFilter, setDateFilter] = useState<DateFilter | undefined>(
    initialDate
  );
  const [accountTarget, setAccountTarget] =
    useState<AccountTarget>(initialAccountTarget);

  const params = useMemo(() => {
    const startDate = dateFilter?.startDate
      ? new Date(dateFilter.startDate).toISOString().split("T")[0]
      : undefined;
    const endDate = dateFilter?.endDate
      ? new Date(dateFilter.endDate).toISOString().split("T")[0]
      : undefined;

    return {
      page,
      limit: pageSize,
      startDate,
      endDate,
      accountId: accountTarget?.type === "account" ? accountTarget.id : undefined,
      subaccountId:
        accountTarget?.type === "subaccount" ? accountTarget.id : undefined,
    };
  }, [page, pageSize, dateFilter, accountTarget]);

  const refetch = useCallback(async () => {
    if (!plaidItemId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTransactionsByPlaidItem(plaidItemId, params);
      if ("error" in res) {
        setError(res as ErrorResponse);
        setData(null);
      } else {
        setData(res as TransactionPaginationResponseDto);
      }
    } catch {
      setError({
        message: "Unexpected error fetching transactions",
        statusCode: 500,
      });
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [plaidItemId, params]);

  useEffect(() => {
    if (autoFetch && plaidItemId) {
      refetch();
    }
  }, [autoFetch, plaidItemId, refetch]);

  const totalItems = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return {
    data: data?.data ?? [],
    page,
    totalPages,
    totalItems,
    loading,
    error,
    refetch,
    setPage,
    dateFilter,
    setDateFilter,
    accountTarget,
    setAccountTarget,
    clearFilters: () => {
      setDateFilter(undefined);
      setAccountTarget(null);
      setPage(1);
    },
  };
}
