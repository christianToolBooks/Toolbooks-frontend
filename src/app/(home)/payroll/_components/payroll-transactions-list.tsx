"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, Edit, Trash2, RefreshCw, Plus, Clock, Users } from "lucide-react"
import { Badge } from "@/src/components/ui/badge"
import { usePayrollData } from "../hooks/usePayrollData"
import { getHoursWorked, getStatusBadgeConfig } from "../_utils/payrollHelpers"
import type { PayrollTransaction } from "../types/payroll"
import { PayrollTransactionForm } from "./payroll-transaction-form"
import { useIsMobile } from "@/src/hooks/useMobile"
import { formatCurrency, formatDate } from "@/src/lib/utils/formatters"

// Componente para la fila de transacción (Desktop)
const TransactionTableRow = ({
  transaction,
  onDelete,
  onStatusChange,
}: {
  transaction: PayrollTransaction
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: PayrollTransaction["status"]) => void
}) => {
  const statusConfig = getStatusBadgeConfig(transaction.status)
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the transaction for ${transaction.employee_name}?`)) {
      onDelete(transaction.transaction_id)
    }
  }
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-4">
        <div className="font-medium">{transaction.employee_name}</div>
        {transaction.employee_address && (
          <div className="text-xs text-gray-500">
            {transaction.employee_address.city}, {transaction.employee_address.region}
          </div>
        )}
      </td>
      <td className="p-4 text-sm">{transaction.employer_name || "N/A"}</td>
      <td className="p-4 text-sm">
        <div>{formatDate(transaction.pay_period_start)} -</div>
        <div>{formatDate(transaction.pay_period_end)}</div>
        <div className="text-xs text-gray-500">Pay: {formatDate(transaction.pay_date)}</div>
      </td>
      <td className="p-4">{transaction.payroll_provider}</td>
      <td className="p-4 text-sm">{getHoursWorked(transaction)}h</td>
      <td className="p-4 font-medium">{formatCurrency(transaction.gross_pay)}</td>
      <td className="p-4 font-medium">{formatCurrency(transaction.net_pay)}</td>
      <td className="p-4">
        <Badge variant={statusConfig.variant} className={statusConfig.className}>
          {statusConfig.label}
        </Badge>
      </td>
      <td className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            {transaction.status === "draft" && (
              <DropdownMenuItem onClick={() => onStatusChange(transaction.transaction_id, "processed")}>
                <Clock className="mr-2 h-4 w-4" />
                Mark as Processed
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )
}

// Nuevo componente para la tarjeta de transacción (Mobile)
const MobileTransactionCard = ({
  transaction,
  onDelete,
  onStatusChange,
}: {
  transaction: PayrollTransaction
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: PayrollTransaction["status"]) => void
}) => {
  const statusConfig = getStatusBadgeConfig(transaction.status)
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the transaction for ${transaction.employee_name}?`)) {
      onDelete(transaction.transaction_id)
    }
  }

  return (
    <Card className="p-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{transaction.employee_name}</h3>
          {transaction.employee_address && (
            <p className="text-sm text-gray-500">
              {transaction.employee_address.city}, {transaction.employee_address.region}
            </p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            {transaction.status === "draft" && (
              <DropdownMenuItem onClick={() => onStatusChange(transaction.transaction_id, "processed")}>
                <Clock className="mr-2 h-4 w-4" />
                Mark as Processed
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
        <div>
          <p className="text-gray-500">Employer:</p>
          <p className="font-medium">{transaction.employer_name || "N/A"}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500">Hours:</p>
          <p className="font-medium">{getHoursWorked(transaction)}h</p>
        </div>
        <div>
          <p className="text-gray-500">Gross Pay:</p>
          <p className="font-medium">{formatCurrency(transaction.gross_pay)}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500">Net Pay:</p>
          <p className="font-medium">{formatCurrency(transaction.net_pay)}</p>
        </div>
        <div className="col-span-2">
          <p className="text-gray-500">Pay Period:</p>
          <p>
            {formatDate(transaction.pay_period_start)} - {formatDate(transaction.pay_period_end)}
          </p>
          <p className="text-xs text-gray-500">Pay Date: {formatDate(transaction.pay_date)}</p>
        </div>
      </div>
      <div className="mt-4">
        <Badge variant={statusConfig.variant} className={statusConfig.className}>
          {statusConfig.label}
        </Badge>
      </div>
    </Card>
  )
}

// Componente principal
export default function PayrollTransactionsList() {
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const isMobile = useIsMobile()
  const {
    transactions,
    loading,
    error,
    searchTerm,
    handleSearch,
    refreshTransactions,
    deleteTransaction,
    updateTransactionStatus,
    hasTransactions,
  } = usePayrollData()

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Data</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={refreshTransactions} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <CardTitle>Payroll Transactions</CardTitle>
              <CardDescription>Manage and view all payroll transactions</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={refreshTransactions}
                disabled={loading}
                className="w-full sm:w-auto bg-transparent"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button onClick={() => setShowTransactionForm(true)} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                New Transaction
              </Button>
            </div>
          </div>
          {showTransactionForm && (
            <PayrollTransactionForm
              onClose={() => setShowTransactionForm(false)}
              onSave={() => {
                setShowTransactionForm(false)
                refreshTransactions() // Refresh data after saving
              }}
            />
          )}
          {/* Search Bar */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-full sm:max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e: { target: { value: string } }) => handleSearch(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            // Loading skeleton
            <div className="space-y-4">
              {[...Array(5)].map((_, i) =>
                isMobile ? (
                  <div key={i} className="p-4 border rounded-lg shadow-sm space-y-2">
                    <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse mt-2"></div>
                  </div>
                ) : (
                  <div key={i} className="flex items-center space-x-4 p-4 border rounded">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ),
              )}
            </div>
          ) : !hasTransactions ? (
            // Empty state
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No transactions found</p>
                <p className="text-sm">
                  {searchTerm
                    ? `No transactions match "${searchTerm}"`
                    : "Get started by creating your first payroll transaction"}
                </p>
              </div>
              {searchTerm && (
                <Button variant="outline" onClick={() => handleSearch("")}>
                  Clear Search
                </Button>
              )}
            </div>
          ) : isMobile ? (
            // Mobile list view
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <MobileTransactionCard
                  key={transaction.transaction_id}
                  transaction={transaction}
                  onDelete={deleteTransaction}
                  onStatusChange={updateTransactionStatus}
                />
              ))}
            </div>
          ) : (
            // Desktop table view
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Employee</th>
                    <th className="text-left p-4 font-medium">Employer</th>
                    <th className="text-left p-4 font-medium">Pay Period</th>
                    <th className="text-left p-4 font-medium">Provider</th>
                    <th className="text-left p-4 font-medium">Hours</th>
                    <th className="text-left p-4 font-medium">Gross Pay</th>
                    <th className="text-left p-4 font-medium">Net Pay</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="w-[70px] p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <TransactionTableRow
                      key={transaction.transaction_id}
                      transaction={transaction}
                      onDelete={deleteTransaction}
                      onStatusChange={updateTransactionStatus}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
