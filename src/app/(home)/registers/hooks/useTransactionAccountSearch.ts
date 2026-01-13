"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { GeneralLedgerLine } from "@/src/types/generaldLedgerTypes";

export interface CombinedAccountFromTransactions {
  id: string;
  account_name: string;
  account_code: string;
  type: "account" | "subAccount";
}

interface UseTransactionAccountSearchProps {
  transactions: GeneralLedgerLine[];
  onAccountSelect: (account: CombinedAccountFromTransactions | null) => void;
  selectedAccountId?: string;
  minChars?: number;
  openOnFocus?: boolean;
}

export default function useTransactionAccountSearch({
  transactions,
  onAccountSelect,
  selectedAccountId,
  minChars = 0,
  openOnFocus = true,
}: UseTransactionAccountSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedAccount, setSelectedAccount] =
    useState<CombinedAccountFromTransactions | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const availableAccounts = useMemo(() => {
    const map = new Map<string, CombinedAccountFromTransactions>();
    for (const gl of transactions ?? []) {
      if (gl?.account?.id) {
        const key = `account:${gl.account.id}`;
        if (!map.has(key)) {
          map.set(key, {
            id: gl.account.id,
            account_code: gl.account.account_code,
            account_name: gl.account.account_name,
            type: "account",
          });
        }
      }
      if (gl?.subaccount?.id) {
        const key = `subAccount:${gl.subaccount.id}`;
        if (!map.has(key)) {
          map.set(key, {
            id: gl.subaccount.id,
            account_code: gl.subaccount.account_code,
            account_name: gl.subaccount.account_name,
            type: "subAccount",
          });
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => {
      const byName = (a.account_name || "").localeCompare(b.account_name || "");
      return byName !== 0
        ? byName
        : (a.account_code || "").localeCompare(b.account_code || "");
    });
  }, [transactions]);

  // optional pre-selection
  useEffect(() => {
    if (!selectedAccountId) return;
    const found = availableAccounts.find((a) => a.id === selectedAccountId) || null;
    setSelectedAccount(found);
    if (found) setQuery(`${found.account_name} (${found.account_code})`);
  }, [selectedAccountId, availableAccounts]);

  // filtered accounts
  const filteredAccounts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < Math.max(1, minChars)) {
      return openOnFocus && showSuggestions && minChars === 0
        ? availableAccounts.slice(0, 50)
        : [];
    }
    return availableAccounts.filter(
      (a) =>
        a.account_name.toLowerCase().includes(q) ||
        a.account_code.toLowerCase().includes(q)
    );
  }, [query, availableAccounts, showSuggestions, minChars, openOnFocus]);

  // show/hide suggestions
  useEffect(() => {
    if (filteredAccounts.length > 0) {
      setShowSuggestions(true);
      setSelectedIndex(0);
    } else if (query.length >= Math.max(1, minChars)) {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  }, [filteredAccounts.length, query, minChars]);

  // out click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        !inputRef.current?.contains(t) &&
        !suggestionsRef.current?.contains(t)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // handlers
  const handleInputFocus = () => {
    if (openOnFocus) setShowSuggestions(true);
  };

  const selectAccount = (acc: CombinedAccountFromTransactions) => {
    setSelectedAccount(acc);
    setQuery(`${acc.account_name} (${acc.account_code})`);
    setShowSuggestions(false);
    onAccountSelect(acc);
    inputRef.current?.blur();
  };

  const clearSelection = () => {
    setSelectedAccount(null);
    setQuery("");
    setShowSuggestions(openOnFocus && minChars === 0);
    onAccountSelect(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || filteredAccounts.length === 0) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((i) =>
          Math.min(i + 1, filteredAccounts.length - 1)
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        const curr = filteredAccounts[selectedIndex];
        if (curr) selectAccount(curr);
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return {
    query,
    setQuery,
    filteredAccounts,
    selectedIndex,
    setSelectedIndex,
    showSuggestions,
    selectedAccount,
    inputRef,
    suggestionsRef,
    selectAccount,
    clearSelection,
    handleKeyDown,
    handleInputFocus,
    availableAccounts,
  };
}
