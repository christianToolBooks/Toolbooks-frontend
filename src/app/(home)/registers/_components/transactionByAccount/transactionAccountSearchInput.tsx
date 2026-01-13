/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useImperativeHandle } from "react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { cn } from "@/src/lib/utils/utils";
import UseCoaFilter, { CombinedAccount } from "../../../general-ledger/hooks/generalLedgerHooks/useCoaFilter";

export type AccountInputHandle = {
  clear: () => void;
  focus: () => void;
};

interface Props {
  onAccountSelect: (acc: { id: string; type: "account" | "subaccount" } | null) => void;
  className?: string;
}

export const TransactionAccountSearchInput = forwardRef<AccountInputHandle, Props>(
  ({ onAccountSelect, className }, ref) => {
    const {
      setQuery,
      query,
      loading,
      combinedAccounts,
      setShowSuggestions,
      showSuggestions,
      inputRef,
      suggestionsRef,
      setSelectedAccount,
      selectedAccount,
      selectedIndex,
      setSelectedIndex,
      selectAccount,
    } = UseCoaFilter(); 

    const handleSelectAccount = (account: CombinedAccount) => {
      selectAccount(account);
      onAccountSelect({ id: account.id, type: account.type as "account" | "subaccount" });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      setSelectedAccount(null);
      if (value.length === 0) {
        setShowSuggestions(false);
        onAccountSelect(null);
      }
    };

    const clearLocal = () => {
      setSelectedAccount(null);
      setQuery("");
      setShowSuggestions(false);
    };

    useImperativeHandle(
      ref,
      () => ({
        clear: () => {
          clearLocal();
          onAccountSelect(null); 
        },
        focus: () => inputRef.current?.focus(),
      }),
      [onAccountSelect]
    );

    return (
      <div className={cn("grid gap-1.5", className)}>
        <Label htmlFor="accountSearch">Account Filter</Label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              id="accountSearch"
              ref={inputRef}
              onChange={handleInputChange}
              value={selectedAccount ? `${selectedAccount.account_name}` : query}
              placeholder="Filter by account..."
              autoComplete="off"
              className="rounded-lg border border-slate-300 focus-visible:ring-2 focus-visible:chart-1 focus-visible:chart-2"
            />

            {loading && query.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4">
                <div className="text-sm text-gray-500">Searching...</div>
              </div>
            )}

            {showSuggestions && !loading && combinedAccounts.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
              >
                {combinedAccounts.map((account, index) => (
                  <div
                    key={account.id}
                    className={cn(
                      "px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50",
                      selectedIndex === index && "bg-gray-100"
                    )}
                    onClick={() =>
                      handleSelectAccount({
                        id: account.id,
                        account_name: account.account_name,
                        account_code: account.account_code,
                        type: account.type as "account" | "subaccount",
                      })
                    }
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-900 font-medium">
                        {account.account_name}
                      </span>
                      <span className="text-xs text-gray-500">Code: {account.account_code}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {query.length > 0 && !loading && combinedAccounts.length === 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4">
                <div className="text-sm text-gray-500">No accounts found</div>
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }
);

TransactionAccountSearchInput.displayName = "TransactionAccountSearchInput";
