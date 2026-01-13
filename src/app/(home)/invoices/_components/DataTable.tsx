"use client";

import React, { useState, useMemo } from "react";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import Link from "next/link";
import InvoicesLoading from "../loading";
import { UseInvoiceContex } from "../context/invoiceProvider";
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import { InvoiceSearch } from "./InvoiceSearch";
import { InvoiceDetailsDialog } from "./InvoiceDetailsDialog";
import { Invoice, InvoiceSearchParams } from "@/src/types/invoice";
import InvoiceActions from "./InvoiceActions";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

export function DataTable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const {
    invoices,
    isSearching,
    searchInvoicesAction,
    clearSearch,
    isLoadingInvoices,
    openInvoiceDetails,
    closeInvoiceDetails,
    selectedInvoiceForDetails,
    isDetailsDialogOpen,
    isLoadingInvoiceDetails,
  } = UseInvoiceContex();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const tableData = useMemo(() => (invoices || []) as TData[], [invoices]);
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });
  const handleSearch = async (params: InvoiceSearchParams) => {
    if (params.q || Object.keys(params).length > 0) {
      await searchInvoicesAction(params);
    } else {
      await clearSearch();
    }
  };

  if (isLoadingInvoices) {
    return <InvoicesLoading />;
  }

  return (
    <>
      <InvoiceSearch onSearch={handleSearch} isLoading={isSearching} />
      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isSearching ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-sm text-muted-foreground">Searching...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : isLoadingInvoices ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-sm text-muted-foreground">Loading invoices...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('[role="button"]') || 
                        (e.target as HTMLElement).closest('[data-radix-collection-item]')) {
                      return;
                    }
                    const invoice = row.original as Invoice;
                    if (invoice?.id) {
                      openInvoiceDetails(invoice.id);
                    }
                  }}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => {
                    if (cell.column.id === 'actions') {
                      return (
                        <TableCell key={cell.id}>
                          <InvoiceActions invoice={row.original as Invoice} />
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center p-6 space-y-4"
                >
                  You haven&#39;t created any invoices yet. <br />
                  <p className="font-semibold text-primary">
                    Create your first invoice to get started!
                  </p>
                  <Link href="/invoices/new">
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Create New Invoice
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <InvoiceDetailsDialog
        invoice={selectedInvoiceForDetails}
        isOpen={isDetailsDialogOpen}
        onClose={closeInvoiceDetails}
        isLoading={isLoadingInvoiceDetails}
      />
    </>
  );
}
