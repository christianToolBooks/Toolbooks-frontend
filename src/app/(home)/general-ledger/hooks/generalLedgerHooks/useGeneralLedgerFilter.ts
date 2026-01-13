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
import { Dispatch, useEffect, useState } from 'react';
import { DateFilter } from './useGeneralLedger';

interface UseGeneralLedgerProps {
  setDateToFilter: Dispatch<React.SetStateAction<DateFilter>>;
}

export default function UseGeneralLedgerFilter({
  setDateToFilter,
}: UseGeneralLedgerProps) {
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    dateRange: 'All',
    customDateFrom: '',
    customDateTo: '',
    source: 'All Sources',
    accountFilter: '',
    sortBy: 'date',
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
      }
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

  return {
    showMobileFilters,
    setShowMobileFilters,

    filters,
    setFilters,
  };
}
