'use client';

import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { CardContent } from '@/src/components/ui/card';
import type {
  AccountWithCurrentBalanceAndSubAccounts,
  TypesChartOfAccounts,
} from '@/src/types/chart-of-accounts';
import { ColumnDef } from '@tanstack/react-table';
import { AccountsDataTable } from './chartOfAccountsDataTable';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface ChartOfAccountClientProps {
  columns: ColumnDef<AccountWithCurrentBalanceAndSubAccounts>[];
  data: AccountWithCurrentBalanceAndSubAccounts[];
  refetch: () => Promise<void>;
}

const accountTypes: {
  id: TypesChartOfAccounts;
  label: string;
  count: number;
}[] = [
  { id: 'asset', label: 'Assets', count: 15 },
  { id: 'liability', label: 'Liabilities', count: 8 },
  { id: 'equity', label: 'Equity', count: 5 },
  { id: 'income', label: 'Income', count: 25 },
  { id: 'expense', label: 'Expenses', count: 22 },
];

export function ChartOfAccountsClient({
  columns,
  data,
  refetch,
}: ChartOfAccountClientProps) {
  const [activeTab, setActiveTab] = useState<TypesChartOfAccounts>('income');
  const [showInactive, setShowInactive] = useState<boolean>(false);

  const filteredAccounts = data.filter(account => {
    const isSameType = account.account_type === activeTab;
    const isActive = account.status;
    const isInactiveVisible = showInactive && !account.status;

    return isSameType && (isActive || isInactiveVisible);
  });

  return (
    <CardContent className="p-4 sm:p-6">
      {/* Tab Navigation */}
      <div className="relative flex justify-start sm:justify-center mb-6">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {accountTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={`
                px-4 py-2 sm:px-12 sm:py-7 rounded-md text-sm font-medium transition-colors cursor-pointer flex-shrink-0
                ${
                  activeTab === type.id
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50'
                }
              `}
            >
              {type.label}
            </button>
          ))}
        </div>
        {/* Fading overlays for visual indication of scrollability */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-gray-950 to-transparent pointer-events-none sm:hidden" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-950 to-transparent pointer-events-none sm:hidden" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2 w-full flex flex-col">
          <div className="self-end flex space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowInactive(prev => !prev)}
              className="ml-auto cursor-pointer"
            >
              {showInactive
                ? 'Hide Inactive Accounts'
                : 'Show Inactive Accounts'}
            </Button>
            <Link
              passHref
              href={'/chart-of-accounts/new'}
              className="flex items-center gap-4 mb-2"
            >
              <Button className="bg-primary hover:bg-blue-800 cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Create Account
              </Button>
            </Link>
          </div>
          <AccountsDataTable
            columns={columns}
            data={filteredAccounts}
            refetch={refetch}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t">
        <p className="text-sm text-gray-600">
          {filteredAccounts.length} Accounts by this Type
        </p>
      </div>
    </CardContent>
  );
}
