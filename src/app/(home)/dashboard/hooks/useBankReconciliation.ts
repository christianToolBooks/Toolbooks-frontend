"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  getAllReconciliations,
  getLastReconciliation,
  getRealTimeReconciliation,
  getReconciliationByMonth,
  refreshReconciliationData,
} from "@/src/lib/services/bankReconciliation";
import {
  BankReconciliationApiResponse,
  CachedPage,
  liveReconciliationResponse,
  PaginationInfo,
  ReconciliationQueryApiResponse,
} from "@/src/types/bank-reconciliation";

const CACHE_DURATION = 5 * 60 * 1000;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

interface UseBankReconciliationReturn {
  formalReconciliation: ReconciliationQueryApiResponse | null;
  lastReconciliation: ReconciliationQueryApiResponse | null;
  realTimeReconciliation: liveReconciliationResponse | null;
  allReconciliations: BankReconciliationApiResponse[] | null;
  paginationInfo: PaginationInfo | null;
  loading: boolean;
  error: string | null;
  selectedYear: number;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  refreshRealTime: () => Promise<void>;
  changePeriod: (year: number, month: number) => void;
  refetch: () => Promise<void>;
  fetchPage: (page: number, limit?: number) => Promise<void>;
}

export function useBankReconciliation(): UseBankReconciliationReturn {
  const [formalReconciliation, setFormalReconciliation] =
    useState<ReconciliationQueryApiResponse | null>(null);
  const [lastReconciliation, setLastReconciliation] =
    useState<ReconciliationQueryApiResponse | null>(null);
  const [realTimeReconciliation, setRealTimeReconciliation] =
    useState<liveReconciliationResponse | null>(null);
  const [allReconciliations, setAllReconciliations] = 
    useState<BankReconciliationApiResponse[] | null>(null);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const pageCache = useRef<Map<number, CachedPage>>(new Map());
  const isCacheValid = useCallback((cachedPage: CachedPage): boolean => {
    return Date.now() - cachedPage.timestamp < CACHE_DURATION;
  }, []);
  const cleanExpiredCache = useCallback(() => {
    const now = Date.now();
    for (const [key, value] of pageCache.current.entries()) {
      if (now - value.timestamp > CACHE_DURATION) {
        pageCache.current.delete(key);
      }
    }
  }, []);
  const preloadNextPage = useCallback(
    async (currentPage: number, limit: number, totalPages: number) => {
      const nextPage = currentPage + 1;

      if (nextPage <= totalPages && !pageCache.current.has(nextPage)) {
        try {
          const response = await getAllReconciliations(nextPage, limit);
          if ("code" in response && response.code === 200 && response.data) {
            pageCache.current.set(nextPage, {
              items: response.data.items,
              paginationInfo: {
                total: response.data.total,
                page: response.data.page,
                limit: response.data.limit,
              },
              timestamp: Date.now(),
            });
          }
        } catch (err) {
          console.warn("Failed to preload next page:", err);
        }
      }
    },
    []
  );
const fetchFormalReconciliation = useCallback(async () => {
  try {
    const response = await getReconciliationByMonth(
      selectedYear,
      selectedMonth
    );

    if ("code" in response && response.code === 200 && response.data) {
      setFormalReconciliation(response.data);
    } else {
      setFormalReconciliation(null);
    }
  } catch (err) {
    console.error("Failed to fetch formal reconciliation:", err);
    setFormalReconciliation(null);
  }
}, [selectedYear, selectedMonth]);


  const fetchAllReconciliations = useCallback(
    async (page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) => {
      const cachedPage = pageCache.current.get(page);
      if (cachedPage && isCacheValid(cachedPage)) {
        setAllReconciliations(cachedPage.items);
        setPaginationInfo(cachedPage.paginationInfo);
        
        const totalPages = Math.ceil(
          cachedPage.paginationInfo.total / cachedPage.paginationInfo.limit
        );
        preloadNextPage(page, limit, totalPages);
        return;
      }

      const response = await getAllReconciliations(page, limit);
      if ("code" in response && response.code === 200 && response.data) {
        const newPaginationInfo: PaginationInfo = {
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
        };

        setAllReconciliations(response.data.items);
        setPaginationInfo(newPaginationInfo);

        pageCache.current.set(page, {
          items: response.data.items,
          paginationInfo: newPaginationInfo,
          timestamp: Date.now(),
        });

        cleanExpiredCache();

        const totalPages = Math.ceil(newPaginationInfo.total / newPaginationInfo.limit);
        preloadNextPage(page, limit, totalPages);
      }
    },
    [isCacheValid, cleanExpiredCache, preloadNextPage]
  );

  const fetchLastReconciliation = useCallback(async () => {
    try {
      const response = await getLastReconciliation();
      if ("code" in response && response.code === 200 && response.data) {
        setLastReconciliation(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch last reconciliation:", err);
    }
  }, []);

  const fetchRealTimeReconciliation = useCallback(async () => {
    try {
      const response = await getRealTimeReconciliation();
      if ("code" in response && response.code === 200 && response.data) {
        setRealTimeReconciliation(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch real-time reconciliation:", err);
    }
  }, []);

  const fetchAllData = useCallback(
    async (page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) => {
      setLoading(true);
      setError(null);

      try {
        await Promise.all([
          fetchAllReconciliations(page, limit),
          fetchFormalReconciliation(),
          fetchLastReconciliation(),
          fetchRealTimeReconciliation(),
        ]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch reconciliations";
        setError(errorMessage);
        console.error("Error fetching reconciliation data:", err);
      } finally {
        setLoading(false);
      }
    },
    [
      fetchAllReconciliations,
      fetchFormalReconciliation,
      fetchLastReconciliation,
      fetchRealTimeReconciliation,
    ]
  );

  const refreshRealTime = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await refreshReconciliationData();
      if ("code" in response && response.code === 200 && response.data) {
        setRealTimeReconciliation(response.data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to refresh real-time reconciliation";
      setError(errorMessage);
      console.error("Error refreshing real-time reconciliation:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const changePeriod = useCallback((year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  }, []);

  const refetch = useCallback(async () => {
    await fetchAllData();
  }, [fetchAllData]);

  const fetchPage = useCallback(
    async (page: number, limit: number = DEFAULT_LIMIT) => {
      await fetchAllData(page, limit);
    },
    [fetchAllData]
  );

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    formalReconciliation,
    lastReconciliation,
    realTimeReconciliation,
    allReconciliations,
    paginationInfo,
    loading,
    error,
    selectedYear,
    selectedMonth,
    setSelectedMonth,
    setSelectedYear,
    refreshRealTime,
    changePeriod,
    refetch,
    fetchPage,
  };
}