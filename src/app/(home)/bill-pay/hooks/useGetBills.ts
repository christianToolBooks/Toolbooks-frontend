// src/app/(home)/bill-pay/_hooks/useGetBills.ts
import { useEffect, useState, useCallback } from 'react';
import { getAllBills, getBillMetrics, getBillsSearch } from '@/src/lib/services/billServices';
import { BillDataByIdFromAPI, BillDataResponseFromAPI, BillMetrics } from '@/src/types/billPayTypes';
import { toast } from 'sonner';

export function useGetBills() {
  const [billsMetrics, setBillsMetrics] = useState<BillMetrics>();
  const [billsSearchResults, setBillsSearchResults] = useState<BillDataResponseFromAPI[]>([]);
  const [allBills, setAllBills] = useState<BillDataByIdFromAPI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBillsMetrics = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await getBillMetrics();
      
      if ('statusCode' in res) {
        setError(res.message);
        setBillsMetrics(undefined);
        toast.error(res.message || 'Failed to fetch bill metrics');
        return;
      }
      
      setBillsMetrics(res.data);
    } catch (err) {
      console.error('Error fetching bills metrics:', err);
      setError('Failed to fetch bill metrics');
      toast.error('Failed to fetch bill metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBillsSearch = useCallback(async (query: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await getBillsSearch(query);
      
      if ('statusCode' in res) {
        setError(res.message);
        setBillsSearchResults([]);
        toast.error(res.message || 'Search failed');
        return;
      }
      
      setBillsSearchResults(res.data || []);
    } catch (err) {
      console.error('Error searching bills:', err);
      setError('Failed to search bills');
      setBillsSearchResults([]);
      toast.error('Failed to search bills');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllBills = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await getAllBills();
      
      if ('statusCode' in res) {
        setError(res.message);
        setAllBills([]);
        toast.error(res.message || 'Failed to fetch bills');
        return;
      }
      
      setAllBills(res.data || []);
    } catch (err) {
      console.error('Error fetching all bills:', err);
      setError('Failed to fetch all bills');
      setAllBills([]);
      toast.error('Failed to fetch all bills');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBillsMetrics();
    fetchAllBills();
  }, [fetchBillsMetrics, fetchAllBills]);

  return {
    billsMetrics,
    billsSearchResults,
    allBills,
    loading,
    error,
    fetchBillsMetrics,
    fetchBillsSearch,
    fetchAllBills,
  };
}
