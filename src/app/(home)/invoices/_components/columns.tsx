// app/(home)/invoices/_components/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Invoice } from "@/src/types/invoice";
import { Badge } from "@/src/components/ui/badge";
import { formatCurrency, formatDate } from "@/src/lib/utils/formatters";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/src/components/ui/button";


const getStatusBadge = (status: string) => {
  const statusConfig: Record<
    string,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      label: string;
    }
  > = {
    draft: { variant: "secondary", label: "Draft" },
    sent: { variant: "default", label: "Sent" },
    paid: { variant: "default", label: "Paid" },
    overdue: { variant: "destructive", label: "Overdue" },
    cancelled: { variant: "destructive", label: "Cancelled" },
  };

  const config =
    statusConfig[status?.toLowerCase()] || {
      variant: "outline" as const,
      label: status || "Unknown",
    };

  return (
    <Badge variant={config.variant} className="capitalize">
      {config.label}
    </Badge>
  );
};

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoiceNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent px-0"
        >
          Invoice #
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const invoiceNumber = row.getValue("invoiceNumber") as string;
      return <div className="font-medium">{invoiceNumber || "N/A"}</div>;
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const customer = row.original.customer;
      return <div>{customer?.name || "N/A"}</div>;
    },
  },
  {
    accessorKey: "invoiceDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent px-0"
        >
          Invoice Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("invoiceDate") as string;
      return <div>{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent px-0"
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("dueDate") as string;
      return <div>{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent px-0"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total") as string);
      return (
        <div className="font-medium">
          {isNaN(amount) ? "N/A" : formatCurrency(amount)}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return getStatusBadge(status);
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      // We'll render actions here but they'll be passed from DataTable
      return null;
    },
  },
];
