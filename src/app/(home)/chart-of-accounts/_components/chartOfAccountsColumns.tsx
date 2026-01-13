'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/src/components/ui/button';
import { AccountWithCurrentBalanceAndSubAccounts } from '@/src/types/chart-of-accounts';
import { ArrowUpDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/src/components/ui/badge';
import { ChartOfAccountActions } from './chartOfAccountsActions';
export const createColumnsCoa = (
  refetch: () => Promise<void>
): ColumnDef<AccountWithCurrentBalanceAndSubAccounts>[] => [
  {
    accessorKey: 'account_code',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="cursor-pointer"
      >
        {'Code'}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const account = row.original;
      if (!account.subAccounts) return;
      const hasSubAccounts = account.subAccounts?.length > 0;

      return (
        <div className="flex items-center gap-2 cursor-pointer">
          <span>{row.getValue('account_code')}</span>
          {hasSubAccounts && <ChevronRight className="w-4 h-4" />}
        </div>
      );
    },
  },
  {
    accessorKey: 'account_name',
    header: 'Account Name',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('account_name')}</div>
    ),
  },
  // {
  //   accessorKey: 'account_type',
  //   header: 'Type',
  //   cell: ({ row }) => <div>{row.getValue('account_type')}</div>,
  // },
  {
    accessorKey: 'normal_balance',
    header: 'Normal Balance',
    cell: ({ row }) => <div>{row.getValue('normal_balance')}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          className={
            status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-600'
          }
        >
          {status ? 'Active' : 'Disable'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'currentBalance',
    header: 'Current Balance',
    cell: ({ row }) => <div>{row.getValue('currentBalance')}</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const account = row.original;
      return <ChartOfAccountActions account={account} refetch={refetch} />;
    },
  },
];
