'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import type { Customer } from '@/src/types/customer';
import { CustomerActions } from './customerActions';
import { CustomerStatusToggle } from './customerStatusToggle';

interface ColumnsProps {
  onDeleteSuccess?: () => void
  onStatusChange?: () => void
}

export const createColumns = ({ onDeleteSuccess, onStatusChange }: ColumnsProps = {}): ColumnDef<Customer>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return <div>{new Intl.DateTimeFormat("en-US").format(date)}</div>
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"))
      return <div>{new Intl.DateTimeFormat("en-US").format(date)}</div>
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const customer = row.original
      return <CustomerStatusToggle customer={customer} onStatusChange={onStatusChange} />
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original
      return (
        <CustomerActions
          customer={customer}
          onDeleteSuccess={onDeleteSuccess} 
        />
      )
    },
  },
]
