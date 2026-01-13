"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Search, Filter, Download, MoreVertical, ArrowUpDown, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

type Transaction = {
  id: string
  date: string
  payee: string
  description: string
  amount: number
  category: string
  status: "cleared" | "outstanding" | "pending"
  sourceType: "plaid" | "bill_pay" | "invoice" | "manual"
  checkNumber?: string
  clearedDate?: string
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2025-11-15",
    payee: "Office Supplies Inc",
    description: "Monthly office supplies",
    amount: -245.50,
    category: "Office Expenses",
    status: "cleared",
    sourceType: "plaid",
    clearedDate: "2025-11-16"
  },
  {
    id: "2",
    date: "2025-11-14",
    payee: "Client Payment - ABC Corp",
    description: "Invoice #INV-2025-1142",
    amount: 5000.00,
    category: "Revenue",
    status: "cleared",
    sourceType: "invoice",
    clearedDate: "2025-11-15"
  },
  {
    id: "3",
    date: "2025-11-13",
    payee: "Utility Company",
    description: "Electric bill payment",
    amount: -320.75,
    category: "Utilities",
    status: "outstanding",
    sourceType: "bill_pay",
    checkNumber: "1015"
  },
  {
    id: "4",
    date: "2025-11-12",
    payee: "Software Subscription",
    description: "Monthly SaaS subscription",
    amount: -99.00,
    category: "Software",
    status: "cleared",
    sourceType: "plaid",
    clearedDate: "2025-11-12"
  },
  {
    id: "5",
    date: "2025-11-10",
    payee: "Vendor Payment",
    description: "Check #1016",
    amount: -1250.00,
    category: "Cost of Goods",
    status: "outstanding",
    sourceType: "manual",
    checkNumber: "1016"
  },
]

export function TransactionRegister() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")

  const filteredTransactions = mockTransactions.filter(txn => {
    const matchesSearch = 
      txn.payee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || txn.status === statusFilter
    const matchesSource = sourceFilter === "all" || txn.sourceType === sourceFilter
    
    return matchesSearch && matchesStatus && matchesSource
  })

  const totalBalance = filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0)
  const clearedBalance = filteredTransactions
    .filter(txn => txn.status === "cleared")
    .reduce((sum, txn) => sum + txn.amount, 0)
  const outstandingBalance = filteredTransactions
    .filter(txn => txn.status === "outstanding")
    .reduce((sum, txn) => sum + txn.amount, 0)

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "cleared":
        return <Badge variant="outline" className="bg-success/10 text-success border-success/20"><CheckCircle2 className="w-3 h-3 mr-1" />Cleared</Badge>
      case "outstanding":
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20"><Clock className="w-3 h-3 mr-1" />Outstanding</Badge>
      case "pending":
        return <Badge variant="outline" className="bg-info/10 text-info border-info/20"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>
    }
  }

  const getSourceBadge = (source: Transaction["sourceType"]) => {
    const labels = {
      plaid: "Plaid",
      bill_pay: "Bill Pay",
      invoice: "Invoice",
      manual: "Manual"
    }
    return <Badge variant="secondary" className="text-xs">{labels[source]}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Balance</CardDescription>
            <CardTitle className="text-2xl">${totalBalance.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Cleared Balance</CardDescription>
            <CardTitle className="text-2xl text-success">${clearedBalance.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Outstanding Balance</CardDescription>
            <CardTitle className="text-2xl text-warning">${Math.abs(outstandingBalance).toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Transaction Register</CardTitle>
              <CardDescription>View and manage all transactions from a single source of truth</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                Add Transaction
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by payee or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="cleared">Cleared</SelectItem>
                <SelectItem value="outstanding">Outstanding</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="plaid">Plaid</SelectItem>
                <SelectItem value="bill_pay">Bill Pay</SelectItem>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transaction Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[120px]">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      Date
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Payee</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Source</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((txn) => (
                  <TableRow key={txn.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-sm">
                      {new Date(txn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="font-medium">{txn.payee}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {txn.description}
                      {txn.checkNumber && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          Check #{txn.checkNumber}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{txn.category}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(txn.status)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getSourceBadge(txn.sourceType)}
                    </TableCell>
                    <TableCell className={`text-right font-mono font-medium ${txn.amount > 0 ? 'text-success' : 'text-foreground'}`}>
                      {txn.amount > 0 ? '+' : ''}{txn.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Transaction</DropdownMenuItem>
                          <DropdownMenuItem>Change Category</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredTransactions.length} of {mockTransactions.length} transactions
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
