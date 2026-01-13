"use client"

import { Card, CardContent } from "@/src/components/ui/card"
import { FileText, DollarSign, AlertTriangle } from "lucide-react"
import { useGetBills } from "../../hooks/useGetBills"
import { BillMetricsSkeleton } from "../skeletons/bill-metrics-skeleton"

export function BillMetrics() {
  const { billsMetrics, loading } = useGetBills()

  if (loading) return <BillMetricsSkeleton />
  if (!billsMetrics) return null

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Total Bills</span>
          </div>
          <div className="text-2xl font-bold mt-2">{billsMetrics.totalBills}</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Total Amount</span>
          </div>
          <div className="text-2xl font-bold mt-2">${billsMetrics.totalAmount.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium">Due Today</span>
          </div>
          <div className="text-2xl font-bold mt-2">{billsMetrics.dueToday}</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium">Overdue</span>
          </div>
          <div className="text-2xl font-bold mt-2">{billsMetrics.overdue}</div>
        </CardContent>
      </Card>
    </div>
  )
}
