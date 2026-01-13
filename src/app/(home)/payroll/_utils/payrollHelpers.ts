
import { formatCurrency, formatDate } from "@/src/lib/utils/formatters"
import { PayrollDashboardMetrics, PayrollStatus, PayrollTransaction } from "../types/payroll"

export const getHoursWorked = (transaction: PayrollTransaction): number => {
  if (!transaction.income_breakdown) return 0
  return transaction.income_breakdown.reduce((total, item) => total + item.hours, 0)
}

export const filterTransactions = (
  transactions: PayrollTransaction[],
  searchTerm: string
): PayrollTransaction[] => {
  if (!searchTerm.trim()) return transactions
  
  const lowercaseSearch = searchTerm.toLowerCase()
  
  return transactions.filter(transaction =>
    transaction.employee_name.toLowerCase().includes(lowercaseSearch) ||
    transaction.payroll_provider.toLowerCase().includes(lowercaseSearch) ||
    (transaction.employer_name && transaction.employer_name.toLowerCase().includes(lowercaseSearch)) ||
    transaction.status.toLowerCase().includes(lowercaseSearch)
  )
}

export const calculateDashboardMetrics = (transactions: PayrollTransaction[]): PayrollDashboardMetrics => {
  const totalPayroll = transactions
    .filter(t => t.status === "processed" || t.status === "posted")
    .reduce((sum, t) => sum + t.gross_pay, 0)
  
  const activeEmployees = new Set(transactions.map(t => t.employee_id)).size
  const pendingTransactions = transactions.filter(t => t.status === "draft").length
  const errorTransactions = transactions.filter(t => t.status === "error").length

  return {
    totalPayroll,
    activeEmployees,
    pendingTransactions,
    errorTransactions
  }
}

export const getStatusBadgeConfig = (status: PayrollStatus) => {
  const configs = {
    draft: {
      variant: "secondary" as const,
      className: "bg-yellow-100 text-yellow-800",
      label: "Draft"
    },
    processed: {
      variant: "default" as const,
      className: "bg-green-100 text-green-800",
      label: "Processed"
    },
    posted: {
      variant: "default" as const,
      className: "bg-blue-100 text-blue-800",
      label: "Posted"
    },
    error: {
      variant: "destructive" as const,
      className: "bg-red-100 text-red-800",
      label: "Error"
    }
  }

  return configs[status] || configs.draft
}

export const sortTransactionsByDate = (transactions: PayrollTransaction[]): PayrollTransaction[] => {
  return [...transactions].sort((a, b) => 
    new Date(b.pay_date).getTime() - new Date(a.pay_date).getTime()
  )
}

export const groupTransactionsByEmployee = (transactions: PayrollTransaction[]) => {
  return transactions.reduce((groups, transaction) => {
    const employeeId = transaction.employee_id
    if (!groups[employeeId]) {
      groups[employeeId] = {
        employee_name: transaction.employee_name,
        employee_id: employeeId,
        transactions: []
      }
    }
    groups[employeeId].transactions.push(transaction)
    return groups
  }, {} as Record<string, { employee_name: string; employee_id: string; transactions: PayrollTransaction[] }>)
}

export const getTotalDeductions = (transaction: PayrollTransaction): number => {
  return transaction.total_deductions + transaction.total_taxes
}

export const validateTransactionData = (transaction: PayrollTransaction): boolean => {
  const requiredFields = [
    'employee_name',
    'pay_period_start',
    'pay_period_end',
    'pay_date',
    'gross_pay',
    'net_pay'
  ]
  
  return requiredFields.every(field => {
    const value = transaction[field as keyof PayrollTransaction]
    return value !== null && value !== undefined && value !== ''
  })
}

export const generateTransactionSummary = (transaction: PayrollTransaction): string => {
  const hours = getHoursWorked(transaction)
  const deductions = getTotalDeductions(transaction)
  
  return `${transaction.employee_name} - ${formatDate(transaction.pay_period_start)} to ${formatDate(transaction.pay_period_end)}
  Hours: ${hours}h | Gross: ${formatCurrency(transaction.gross_pay)} | Net: ${formatCurrency(transaction.net_pay)}
  Deductions: ${formatCurrency(deductions)} | Status: ${transaction.status}`
}

export const requiresAttention = (transaction: PayrollTransaction): boolean => {
  return transaction.status === 'error' || 
         transaction.net_pay <= 0 || 
         !validateTransactionData(transaction)
}