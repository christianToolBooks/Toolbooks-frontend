'use client';

import React from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/ui/popover';
import { Plus, Search, X } from 'lucide-react';
import { AccountSearchHook } from '@/src/types/journal';
import { CombinedAccount, TypesChartOfAccounts } from '@/src/types/chart-of-accounts';
import { useJournalEntry } from '@/src/app/(home)/journal-entry/_components/journalEntryComponents/context/journalContext';

interface AccountSelectorProps {
  accountNumber: string;
  accountName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  accountSearch: AccountSearchHook;
  onSelectAccount: (account: CombinedAccount) => void;
}

export function AccountSelectorToBillForm({
  accountNumber,
  accountName,
  isOpen,
  onOpenChange,
  accountSearch,
  onSelectAccount,
}: AccountSelectorProps) {
  const { setIsAddAccountDialogOpen } = useJournalEntry();

  const handleSelectAccount = (account: CombinedAccount) => {
    onSelectAccount( account);
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  const handleAddNewAccount = () => {
    onOpenChange(false);
    setIsAddAccountDialogOpen(true);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start bg-transparent"
        >
          {accountNumber && accountName
            ? `${accountNumber} - ${accountName}`
            : 'Select account...'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="start">
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              ref={accountSearch.inputRef}
              placeholder="Search by account number or name..."
              value={accountSearch.query}
              onChange={accountSearch.handleInputChange}
              onFocus={accountSearch.handleInputFocus}
              className="pl-8"
            />
            {accountSearch.query && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-6 w-6 p-0"
                onClick={accountSearch.clearQuery}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          <div className="p-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-blue-600 font-medium hover:bg-blue-50"
              onClick={handleAddNewAccount}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Account
            </Button>
          </div>
          <div className="border-t">
            {accountSearch.loading || accountSearch.isLoading ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Loading accounts...
              </div>
            ) : (!accountSearch.combinedAccounts || accountSearch.combinedAccounts.length === 0) ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                {accountSearch.query.trim() ? 'No accounts found' : 'No accounts available'}
              </div>
            ) : (
              accountSearch.combinedAccounts.map((account, index) => (
                <Button
                  key={account.uniqueId || `${account.account_code}-${account.type}-${index}`}
                  variant="ghost"
                  className="w-full justify-start p-3 h-auto"
                  onClick={() => handleSelectAccount(account)}
                >
                  <div className="text-left">
                    <div className="font-medium">
                      {account.account_code} - {account.account_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {account.account_type?.toUpperCase()} • {account.type === 'subAccount' ? 'Sub Account' : 'Main Account'}
                    </div>
                  </div>
                </Button>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}