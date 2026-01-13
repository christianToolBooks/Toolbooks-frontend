/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from 'date-fns';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { AccountTypeEnum } from '@/src/types/generaldLedgerTypes';
import { DateFilter } from '../../general-ledger/hooks/generalLedgerHooks/useGeneralLedger';

interface TransactionFiltersState {
  dateRange: string;
  customDateFrom: string;
  customDateTo: string;
  type?: 'debit' | 'credit';
  account_type?: AccountTypeEnum;
  bankAccountId?: string;
  pending?: boolean;
  minAmount?: number;
  maxAmount?: number;
  searchText?: string;
}

interface UseTransactionsFilterProps {
  setDateToFilter: Dispatch<SetStateAction<DateFilter | undefined>>;
}

export default function useTransactionsFilter({
  setDateToFilter,
}: UseTransactionsFilterProps) {
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<TransactionFiltersState>({
    dateRange: 'All',
    customDateFrom: '',
    customDateTo: '',
    type: undefined,
    account_type: undefined,
    bankAccountId: undefined,
    pending: undefined,
    minAmount: undefined,
    maxAmount: undefined,
    searchText: undefined,
  });

  const getDateRange = (range: string) => {
    const today = new Date();

    switch (range) {
      case 'Today':
        return {
          startDate: startOfDay(today),
          endDate: endOfDay(today),
        };
      case 'This Week':
        return {
          startDate: startOfWeek(today, { weekStartsOn: 1 }),
          endDate: endOfWeek(today, { weekStartsOn: 1 }),
        };
      case 'Last Week':
        const lastWeek = subWeeks(today, 1);
        return {
          startDate: startOfWeek(lastWeek, { weekStartsOn: 1 }),
          endDate: endOfWeek(lastWeek, { weekStartsOn: 1 }),
        };
      case 'This Month':
        return {
          startDate: startOfMonth(today),
          endDate: endOfMonth(today),
        };
      case 'Last Month':
        const lastMonth = subMonths(today, 1);
        return {
          startDate: startOfMonth(lastMonth),
          endDate: endOfMonth(lastMonth),
        };
      case 'Last 2 Months':
        const twoMonthsAgo = subMonths(today, 2);
        return {
          startDate: startOfMonth(twoMonthsAgo),
          endDate: endOfMonth(today),
        };
      case 'Last 6 Months':
        const sixMonthsAgo = subMonths(today, 6);
        return {
          startDate: startOfMonth(sixMonthsAgo),
          endDate: endOfDay(today),
        };
      case 'Custom':
        return {
          startDate: null,
          endDate: null,
        };
      default:
        return {
          startDate: null,
          endDate: null,
        };
    }
  };

  useEffect(() => {
    if (filters.dateRange === 'Custom') {
      if (filters.customDateFrom && filters.customDateTo) {
        setDateToFilter({
          startDate: new Date(filters.customDateFrom),
          endDate: new Date(filters.customDateTo),
        });
      } else {
        setDateToFilter(undefined);
      }
    } else if (filters.dateRange === 'All') {
      setDateToFilter(undefined);
    } else {
      const { startDate, endDate } = getDateRange(filters.dateRange);
      setDateToFilter({
        startDate,
        endDate,
      });
    }
  }, [
    filters.dateRange,
    filters.customDateFrom,
    filters.customDateTo,
    setDateToFilter,
  ]);

  const clearAllFilters = () => {
    setFilters({
      dateRange: 'All',
      customDateFrom: '',
      customDateTo: '',
      type: undefined,
      account_type: undefined,
      bankAccountId: undefined,
      pending: undefined,
      minAmount: undefined,
      maxAmount: undefined,
      searchText: undefined,
    });
  };

  const updateFilter = (key: keyof TransactionFiltersState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return {
    showMobileFilters,
    setShowMobileFilters,
    filters,
    setFilters,
    clearAllFilters,
    updateFilter,
  };
}