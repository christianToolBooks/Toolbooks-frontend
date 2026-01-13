"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Building2,
  CheckCircle,
  Clock,
  CreditCard,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { GeneralLedgerLine } from "@/src/types/generaldLedgerTypes";
import { Badge } from "@/src/components/ui/badge";
import { TransactionsActions } from "../transactions-actions";

export const columns: ColumnDef<GeneralLedgerLine>[] = [
  {
  id: 'entry_date',
  accessorFn: (row) => row.transaction.entry_date,
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      className="h-8 px-2 font-semibold"
    >
      Date
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }) => {
    const date = new Date(row.original.transaction.entry_date);
    return (
      <div className="font-medium text-slate-900">
        {date.toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        })}
      </div>
    );
  },
},
  {
  accessorKey: 'transaction.bankTransaction.name',
  header: 'Name',
  cell: ({ row }) => {
    const { transaction } = row.original;
    return (
      <div className="space-y-1">
        <div className="font-medium text-slate-900 flex items-center gap-2">
          <Building2 className="h-3 w-3" />
          {transaction.bankTransaction?.merchant_name || transaction.bankTransaction?.name || 'No name'}
        </div>
      </div>
    );
  },
},
  {
    accessorKey: 'account',
    header: 'Account & Number',
    cell: ({ row }) => {
      const transaction = row.original;
      const accountInfo = transaction.account || transaction.subaccount;

      return (
        <div className="space-y-1">
          {accountInfo ? (
            <>
              <div className="font-medium text-slate-900 max-w-[180px] truncate">
                {accountInfo.account_name}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                {accountInfo.account_code}
              </div>
            </>
          ) : (
            <div className="text-slate-400 italic">Uncategorized</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'transaction.bankTransaction.bankAccount',
    header: 'Bank Account',
    cell: ({ row }) => {
      const bankAccount = row.original.transaction.bankTransaction.bankAccount;
      return (
        <div className="space-y-1">
          <div className="font-medium text-slate-900 flex items-center gap-1">
            <CreditCard className="h-3 w-3" />
            {bankAccount?.name}
          </div>
          <div className="text-xs text-slate-500 font-mono">
            ****{bankAccount?.mask}
          </div>
        </div>
      );
    },
  },
{
  id: 'debit',
  accessorFn: (row) => row.debit,
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      className="h-8 px-2 justify-end font-semibold"
    >
      Debit
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }) => {
    const value = parseFloat(row.original.debit);
    return value > 0 ? (
      <div className="text-center">
        ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </div>
    ) : (
      <div className="text-center text-slate-300">—</div>
    );
  },
},
{
  id: 'credit',
  accessorFn: (row) => row.credit,
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      className="h-8 px-2 justify-end font-semibold"
    >
      Credit
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }) => {
    const value = parseFloat(row.original.credit);
    return value > 0 ? (
      <div className="text-center">
        ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </div>
    ) : (
      <div className="text-center text-slate-300">—</div>
    );
  },
},
  {
    accessorKey: 'pending',
    header: 'Status',
    cell: ({ row }) => {
      const isPending = row.getValue('pending');
      return (
        <div className="flex items-left gap-2">
          {isPending ? (
            <>
              <Clock className="h-4 w-4 text-amber-500" />
              <Badge
                variant="secondary"
              >
                Pending
              </Badge>
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              <Badge variant="default" >
                Cleared
              </Badge>
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'running_balance',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2 justify-end font-semibold"
        >
          Balance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const runningBalance = Number(row.getValue('running_balance'));
      return (
        <div className="text-center">
          <div
            className={` ${runningBalance >= 0 ? '' : ''}`}
          >
            ${runningBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const transaction = row.original;
      return <TransactionsActions transaction={transaction} />;
    }
  }
];