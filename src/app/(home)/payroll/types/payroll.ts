// types/payroll.ts

export interface PayrollTransaction {
  transaction_id: string
  client_id: string
  employee_id: string
  employee_name: string
  pay_period_start: string
  pay_period_end: string
  pay_date: string
  gross_pay: number
  net_pay: number
  total_deductions: number
  total_taxes: number
  total_employer_costs: number
  payroll_provider: string
  provider_transaction_id: string
  status: "draft" | "processed" | "posted" | "error"
  created_at: string
  updated_at: string
  employer_name?: string
  employee_address?: {
    city: string
    region: string
    street: string
    postal_code: string
    country: string
  }
  income_breakdown?: Array<{
    type: string
    rate: number
    hours: number
    total: number
  }>
}

export interface PayrollLineItem {
  line_item_id: string
  transaction_id: string
  line_item_type: string
  line_item_description: string
  line_item_amount: number
  line_item_quantity?: number
  line_item_rate?: number
  line_item_hours?: number
  line_item_account?: string
  line_item_department?: string
  line_item_location?: string
  line_item_memo?: string
  item_category: "earning" | "deduction" | "tax" | "employer_cost"
}

export interface AccountMapping {
  mapping_id: string
  client_id: string
  item_category: string
  item_type: "earning" | "deduction" | "tax" | "employer_cost"
  gl_account_number: string
  gl_account_name: string
  is_active: boolean
}

export interface JournalEntry {
  entry_id: string
  client_id: string
  transaction_id: string
  entry_date: string
  entry_number: string
  description: string
  total_debits: number
  total_credits: number
  status: "draft" | "posted" | "reversed"
  lines: JournalEntryLine[]
}

export interface JournalEntryLine {
  line_id: string
  entry_id: string
  line_item_id?: string
  gl_account_number: string
  debit_amount: number
  credit_amount: number
  description: string
}

export type PayrollStatus = "draft" | "processed" | "posted" | "error"

export interface PayrollDashboardMetrics {
  totalPayroll: number
  activeEmployees: number
  pendingTransactions: number
  errorTransactions: number
}