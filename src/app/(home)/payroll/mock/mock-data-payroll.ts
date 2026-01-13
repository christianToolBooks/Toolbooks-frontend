// data/mockPayrollData.ts

import { PayrollTransaction } from '../types/payroll'

export const mockPayrollTransactions: PayrollTransaction[] = [
  {
    transaction_id: "txn_001",
    client_id: "client-1",
    employee_id: "emp-chip-001",
    employee_name: "Chip Hazard",
    pay_period_start: "2025-06-26",
    pay_period_end: "2025-07-07",
    pay_date: "2025-07-10",
    gross_pay: 1000.39,
    net_pay: 499.28,
    total_deductions: 301.11,
    total_taxes: 200.00,
    total_employer_costs: 150.06,
    payroll_provider: "Plaid",
    provider_transaction_id: "PLAID-12345",
    status: "processed",
    created_at: "2025-07-10T10:00:00Z",
    updated_at: "2025-07-10T10:00:00Z",
    employer_name: "Heartland Toy Company",
    employee_address: {
      city: "Burbank",
      region: "CA",
      street: "411 N Hollywood Way",
      postal_code: "91505",
      country: "US"
    },
    income_breakdown: [
      {
        type: "regular",
        rate: 20,
        hours: 40,
        total: 800
      },
      {
        type: "overtime",
        rate: 30,
        hours: 6.68,
        total: 200.39
      }
    ]
  },
  {
    transaction_id: "txn_002",
    client_id: "client-1",
    employee_id: "emp-chip-002",
    employee_name: "Chip Hazard",
    pay_period_start: "2025-07-10",
    pay_period_end: "2025-07-21",
    pay_date: "2025-07-24",
    gross_pay: 800.00,
    net_pay: 300.00,
    total_deductions: 320.00,
    total_taxes: 180.00,
    total_employer_costs: 120.00,
    payroll_provider: "Plaid",
    provider_transaction_id: "PLAID-67890",
    status: "draft",
    created_at: "2025-07-24T10:00:00Z",
    updated_at: "2025-07-24T10:00:00Z",
    employer_name: "Heartland Toy Company",
    employee_address: {
      city: "Burbank",
      region: "CA",
      street: "411 N Hollywood Way",
      postal_code: "91505",
      country: "US"
    },
    income_breakdown: [
      {
        type: "regular",
        rate: 20,
        hours: 40,
        total: 800
      }
    ]
  },
  {
    transaction_id: "txn_003",
    client_id: "client-1",
    employee_id: "emp-jane-001",
    employee_name: "Jane Smith",
    pay_period_start: "2025-07-01",
    pay_period_end: "2025-07-15",
    pay_date: "2025-07-20",
    gross_pay: 4200.00,
    net_pay: 3150.00,
    total_deductions: 630.00,
    total_taxes: 420.00,
    total_employer_costs: 540.00,
    payroll_provider: "ADP",
    provider_transaction_id: "ADP-54321",
    status: "posted",
    created_at: "2025-07-20T10:00:00Z",
    updated_at: "2025-07-20T10:00:00Z",
    employer_name: "Tech Solutions Inc",
    income_breakdown: [
      {
        type: "salary",
        rate: 75,
        hours: 80,
        total: 4200
      }
    ]
  },
  {
    transaction_id: "txn_004",
    client_id: "client-1",
    employee_id: "emp-john-001",
    employee_name: "John Doe",
    pay_period_start: "2025-07-16",
    pay_period_end: "2025-07-31",
    pay_date: "2025-08-05",
    gross_pay: 3500.00,
    net_pay: 2650.00,
    total_deductions: 525.00,
    total_taxes: 325.00,
    total_employer_costs: 450.00,
    payroll_provider: "Paychex",
    provider_transaction_id: "PCX-98765",
    status: "error",
    created_at: "2025-08-05T10:00:00Z",
    updated_at: "2025-08-05T10:00:00Z",
    employer_name: "Manufacturing Corp",
    income_breakdown: [
      {
        type: "regular",
        rate: 25,
        hours: 80,
        total: 2000
      },
      {
        type: "bonus",
        rate: 0,
        hours: 0,
        total: 1500
      }
    ]
  },
  {
    transaction_id: "txn_005",
    client_id: "client-1",
    employee_id: "emp-alice-001",
    employee_name: "Alice Johnson",
    pay_period_start: "2025-07-01",
    pay_period_end: "2025-07-15",
    pay_date: "2025-07-18",
    gross_pay: 2800.00,
    net_pay: 2100.00,
    total_deductions: 420.00,
    total_taxes: 280.00,
    total_employer_costs: 350.00,
    payroll_provider: "Gusto",
    provider_transaction_id: "GST-11111",
    status: "processed",
    created_at: "2025-07-18T10:00:00Z",
    updated_at: "2025-07-18T10:00:00Z",
    employer_name: "Creative Agency LLC",
    employee_address: {
      city: "San Francisco",
      region: "CA",
      street: "123 Market St",
      postal_code: "94105",
      country: "US"
    },
    income_breakdown: [
      {
        type: "regular",
        rate: 35,
        hours: 80,
        total: 2800
      }
    ]
  },
  {
    transaction_id: "txn_006",
    client_id: "client-1",
    employee_id: "emp-bob-001",
    employee_name: "Bob Wilson",
    pay_period_start: "2025-07-16",
    pay_period_end: "2025-07-31",
    pay_date: "2025-08-02",
    gross_pay: 5200.00,
    net_pay: 3800.00,
    total_deductions: 780.00,
    total_taxes: 620.00,
    total_employer_costs: 650.00,
    payroll_provider: "BambooHR",
    provider_transaction_id: "BHR-22222",
    status: "draft",
    created_at: "2025-08-02T10:00:00Z",
    updated_at: "2025-08-02T10:00:00Z",
    employer_name: "Financial Services Corp",
    employee_address: {
      city: "New York",
      region: "NY",
      street: "456 Wall St",
      postal_code: "10005",
      country: "US"
    },
    income_breakdown: [
      {
        type: "salary",
        rate: 65,
        hours: 80,
        total: 5200
      }
    ]
  }
]

// Función para obtener las transacciones (simula una API call)
export const getPayrollTransactions = async (): Promise<PayrollTransaction[]> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockPayrollTransactions
}

// Función para obtener una transacción específica
export const getPayrollTransaction = async (id: string): Promise<PayrollTransaction | null> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockPayrollTransactions.find(t => t.transaction_id === id) || null
}