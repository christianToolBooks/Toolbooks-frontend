/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import {
  type ChartOfAccountResponse,
  fetchAllAccountsByNameOrCode,
} from '@/src/lib/services/chartOfAccount/chartOfAccountServices';
import { useState, useEffect, useRef } from 'react';

export interface CombinedAccount {
  id: string;
  account_name: string;
  account_code: string;
  type: 'account' | 'subaccount';
}

export default function UseCoaFilter() {
  const [query, setQuery] = useState('');
  const [accounts, setAccounts] = useState<ChartOfAccountResponse>({
    accounts: [],
    subAccounts: [],
  });
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedAccount, setSelectedAccount] = useState<CombinedAccount | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const debounceFetch = async () => {
    if (query.trim()) {
      setLoading(true);
      const result = await fetchAllAccountsByNameOrCode(query);
      if ('message' in result) {
        console.error(result.message);
        setLoading(false);
        return;
      }
      if (result.accounts && result.subAccounts) {
        setAccounts({
          accounts: result.accounts,
          subAccounts: result.subAccounts,
        });
      }
      setLoading(false);
    } else {
      setAccounts({ accounts: [], subAccounts: [] });
      setShowSuggestions(false);
    }
  };

  const combinedAccounts = [
    ...accounts.accounts.map(account => ({
      ...account,
      type: 'account',
    })),
    ...accounts.subAccounts.map(subAccount => ({
      ...subAccount,
      type: 'subAccount',
    })),
  ];

  combinedAccounts.sort((a, b) => a.account_code.localeCompare(b.account_code));

  useEffect(() => {
    if (query.length > 0 && combinedAccounts.length > 0 && !loading) {
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else if (query.length === 0) {
      setShowSuggestions(false);
    }
  }, [query, combinedAccounts.length, loading]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      debounceFetch();
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  /**
   * Logic to the search bar
   */
  const handleInputFocus = () => {
    if (query.length > 0 && combinedAccounts.length > 0) {
      setShowSuggestions(true);
    }
  };

  const selectAccount = (account: CombinedAccount) => {
    setSelectedAccount(account);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSuggestions]);

  return {
    query,
    setQuery,
    accounts,
    loading,
    combinedAccounts,
    handleInputFocus,
    selectedIndex,
    setSelectedIndex,
    showSuggestions,
    setShowSuggestions,
    selectedAccount,
    setSelectedAccount,
    inputRef,
    suggestionsRef,
    selectAccount,
  };
}
