import { fetchTransactions } from '@/src/lib/services/transactionService';
import { Transaction } from '@/src/types/generaldLedgerTypes';
import { useEffect, useState } from 'react';

const UseDashboard = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  const fetchAllTransactions = async () => {
    setIsLoading(true);
    const res = await fetchTransactions();
    if (!res) {
      setIsLoading(false);
      throw new Error('Failed to fetch transactions');
    }
    setAllTransactions(res.data);
    setIsLoading(false);

    return;
  };

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  return { allTransactions, isLoading };
};

export default UseDashboard;
