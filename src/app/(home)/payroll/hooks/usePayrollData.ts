// hooks/usePayrollData.ts

import { useState, useEffect, useMemo } from 'react'
import { PayrollTransaction, PayrollDashboardMetrics } from '../types/payroll'
import { getPayrollTransactions } from '../mock/mock-data-payroll'
import { calculateDashboardMetrics, filterTransactions, sortTransactionsByDate } from '../_utils/payrollHelpers'


export const usePayrollData = () => {
  const [transactions, setTransactions] = useState<PayrollTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Cargar datos iniciales
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getPayrollTransactions()
        const sortedData = sortTransactionsByDate(data)
        setTransactions(sortedData)
      } catch (err) {
        setError('Failed to load payroll transactions')
        console.error('Error loading transactions:', err)
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [])

  // Transacciones filtradas
  const filteredTransactions = useMemo(() => {
    return filterTransactions(transactions, searchTerm)
  }, [transactions, searchTerm])

  // Métricas del dashboard
  const dashboardMetrics = useMemo((): PayrollDashboardMetrics => {
    return calculateDashboardMetrics(transactions)
  }, [transactions])

  // Funciones para manejar acciones
  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const refreshTransactions = async () => {
    try {
      setLoading(true)
      const data = await getPayrollTransactions()
      const sortedData = sortTransactionsByDate(data)
      setTransactions(sortedData)
      setError(null)
    } catch (err) {
      setError('Failed to refresh transactions')
    } finally {
      setLoading(false)
    }
  }

  const deleteTransaction = (transactionId: string) => {
    setTransactions(prev => 
      prev.filter(t => t.transaction_id !== transactionId)
    )
  }

  const updateTransactionStatus = (transactionId: string, newStatus: PayrollTransaction['status']) => {
    setTransactions(prev =>
      prev.map(t =>
        t.transaction_id === transactionId
          ? { ...t, status: newStatus, updated_at: new Date().toISOString() }
          : t
      )
    )
  }

  return {
    // Estado
    transactions: filteredTransactions,
    allTransactions: transactions,
    loading,
    error,
    searchTerm,
    dashboardMetrics,
    
    // Acciones
    handleSearch,
    refreshTransactions,
    deleteTransaction,
    updateTransactionStatus,
    
    // Utilidades
    totalTransactions: filteredTransactions.length,
    hasTransactions: filteredTransactions.length > 0
  }
}