/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import { AccountWithCurrentBalanceAndSubAccounts } from '@/src/types/chart-of-accounts';
import { ChartOfAccountActions } from './chartOfAccountsActions';
import { Badge } from '@/src/components/ui/badge';

interface AccountsDataTableProps {
  columns: ColumnDef<AccountWithCurrentBalanceAndSubAccounts>[];
  data: AccountWithCurrentBalanceAndSubAccounts[];
  refetch: () => Promise<void>;
}

export function AccountsDataTable({
  columns,
  data,
  refetch,
}: AccountsDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string, hasSubAccounts: boolean) => {
    if (!hasSubAccounts) return;
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-lg border shadow-sm bg-gray-50">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id} className="bg-gray-200">
              {headerGroup.headers.map(header => (
                <TableHead
                  key={header.id}
                  className="font-semibold text-gray-700"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map(row => {
              const account = row.original;
              const isExpanded = !!expandedRows[account.id];

              return (
                <React.Fragment key={row.id}>
                  <TableRow
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() =>
                      toggleRow(
                        account.id,
                        (account.subAccounts?.length || 0) > 0
                      )
                    }
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>

                  {isExpanded &&
                    (
                      account.subAccounts as AccountWithCurrentBalanceAndSubAccounts[]
                    )?.map(sub => (
                      <TableRow key={sub.id} className="bg-gray-100">
                        {columns.map((column, index) => {
                          const isActions = column.id === 'actions';
                          const accessorKey = (column as any).accessorKey as
                            | keyof AccountWithCurrentBalanceAndSubAccounts
                            | undefined;

                          let content: React.ReactNode = null;

                          if (isActions) {
                            content = (
                              <ChartOfAccountActions
                                account={sub}
                                refetch={refetch}
                                isSubaccount
                              />
                            );
                          } else if (accessorKey === 'status') {
                            const status = sub.status;
                            content = (
                              <Badge className={'bg-gray-100 text-gray-600'}>
                                {status ? 'Active' : 'Disable'}
                              </Badge>
                            );
                          } else if (accessorKey) {
                            const value = sub[accessorKey];

                            content =
                              typeof value === 'string' ||
                              typeof value === 'number' ||
                              typeof value === 'boolean' ||
                              value === null ||
                              value === undefined
                                ? value
                                : '';
                          }

                          return (
                            <TableCell
                              key={column.id || index}
                              className={index === 0 ? 'pl-8' : ''}
                            >
                              {content}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                </React.Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="text-muted-foreground m-10">
                  <p className="text-lg font-medium">No accounts found</p>
                  <p className="text-sm">
                    Create your first account to get started.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
