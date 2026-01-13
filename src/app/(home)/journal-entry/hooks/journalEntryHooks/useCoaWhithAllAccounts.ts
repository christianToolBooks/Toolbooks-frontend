// hooks/useCoaWithAllAccounts.ts
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  type ChartOfAccountResponse,
  fetchAllAccountsByNameOrCode,
} from '@/src/lib/services/chartOfAccount/chartOfAccountServices';
import { AccountSearchHook } from '@/src/types/journal';
import { CombinedAccount } from '@/src/types/chart-of-accounts';
import { toast } from 'sonner';

export default function useCoaWithAllAccounts(): AccountSearchHook {
  const [query, setQuery] = useState('');
  const [searchAccounts, setSearchAccounts] = useState<ChartOfAccountResponse>({
    accounts: [],
    subAccounts: [],
  });
  const [searchLoading, setSearchLoading] = useState(false);
  const [allAccounts, setAllAccounts] = useState<ChartOfAccountResponse>({
    accounts: [],
    subAccounts: [],
  });
  const [allAccountsLoading, setAllAccountsLoading] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  // Load all accounts at startup
  const fetchAllAccounts = useCallback(async () => {
    setAllAccountsLoading(true);
    try {
      const result = await fetchAllAccountsByNameOrCode('');
      
      if (!('message' in result) && result.accounts && result.subAccounts) {
        setAllAccounts({
          accounts: result.accounts,
          subAccounts: result.subAccounts,
        });
      }
    } catch (error) {
      toast.error(`Error fetching all accounts: ${error}`);
    } finally {
      setAllAccountsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllAccounts();
  }, [fetchAllAccounts]);

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (query.trim()) {
        setSearchLoading(true);
        try {
          const result = await fetchAllAccountsByNameOrCode(query);
          if (!('message' in result) && result.accounts && result.subAccounts) {
            setSearchAccounts({
              accounts: result.accounts,
              subAccounts: result.subAccounts,
            });
          }
        } catch (error) {
          console.error('Error searching accounts:', error);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSearchAccounts({ accounts: [], subAccounts: [] });
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Create a combined list of all accounts
  const createCombinedAccounts = useCallback((accountsData: ChartOfAccountResponse): CombinedAccount[] => {
    const combined: CombinedAccount[] = [
      ...accountsData.accounts.map((account, index) => ({
        id: account.id,
        account_code: account.account_code,
        account_name: account.account_name,
        account_type: account.account_type,
        type: 'account' as const,
        uniqueId: `account-${account.id || account.account_code}-${index}`,
      })),
      ...accountsData.subAccounts.map((subAccount, index) => ({
        id: subAccount.id,
        account_code: subAccount.account_code,
        account_name: subAccount.account_name,
        account_type: subAccount.account_type,
        type: 'subAccount' as const,
        uniqueId: `subaccount-${subAccount.id || subAccount.account_code}-${index}`,
      })),
    ];

    return combined.sort((a, b) => a.account_code.localeCompare(b.account_code));
  }, []);

  // Determine which accounts to display
  const displayAccounts = query.trim() 
    ? createCombinedAccounts(searchAccounts)
    : createCombinedAccounts(allAccounts);

  const isLoading = query.trim() ? searchLoading : allAccountsLoading;

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  }, []);

  const handleInputFocus = useCallback(() => {
    // Only clean if there is no query to display all accounts
    if (!query.trim()) {
      setQuery('');
    }
  }, [query]);

  const clearQuery = useCallback(() => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return {
    query,
    setQuery,
    displayAccounts,
    isLoading,
    inputRef,
    handleInputChange,
    handleInputFocus,
    clearQuery,
    combinedAccounts: displayAccounts,
    loading: isLoading,
    refreshAccounts: fetchAllAccounts,
  };
}