"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { DollarSign, Users, AlertCircle, Clock } from "lucide-react"
import type { usePayrollData } from "../hooks/usePayrollData"
import { formatCurrency } from "@/src/lib/utils/formatters"
import { useIsMobile } from "@/src/hooks/useMobile" // Import the useIsMobile hook

export const PayrollStats = ({
  metrics,
  loading,
}: {
  metrics: ReturnType<typeof usePayrollData>["dashboardMetrics"]
  loading: boolean
}) => {
  const isMobile = useIsMobile()

  if (loading) {
    return (
      <div className={isMobile ? "space-y-4" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={
              isMobile ? "flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-gray-900" : ""
            }
          >
            {isMobile ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="space-y-1">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              </>
            ) : (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>
    )
  }

  const stats = [
    {
      title: "Total Payroll",
      value: formatCurrency(metrics?.totalPayroll || 0),
      description: "Current pay period",
      icon: DollarSign,
      colorClass: "",
    },
    {
      title: "Employees",
      value: metrics?.activeEmployees || 0,
      description: "Active employees",
      icon: Users,
      colorClass: "",
    },
    {
      title: "Pending",
      value: metrics?.pendingTransactions || 0,
      description: "Awaiting processing",
      icon: Clock,
      colorClass: "",
    },
    {
      title: "Errors",
      value: metrics?.errorTransactions || 0,
      description: "Require attention",
      icon: AlertCircle,
      colorClass: "text-red-600", // Apply red color for errors
    },
  ]

  return (
    <div className={isMobile ? "space-y-4" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"}>
      {stats.map((stat, index) =>
        isMobile ? (
          <div
            key={index}
            className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-gray-900 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <stat.icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{stat.title}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            </div>
            <div className={`text-xl font-bold ${stat.colorClass}`}>{stat.value}</div>
          </div>
        ) : (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.colorClass}`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ),
      )}
    </div>
  )
}
