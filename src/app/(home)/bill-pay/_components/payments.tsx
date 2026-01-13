"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { DollarSign, Calendar, CheckCircle, Clock, AlertTriangle } from "lucide-react"

export function BillPayPayments() {
  const mockPayments = [
    {
      id: 1,
      invoiceNumber: "INV-2024-001",
      vendor: "Office Supplies Co.",
      amount: 1250.0,
      paymentDate: "2024-01-15",
      paymentMethod: "ACH Transfer",
      status: "scheduled",
      reference: "PAY-2024-001",
    },
    {
      id: 2,
      invoiceNumber: "INV-2024-002",
      vendor: "Tech Solutions Inc.",
      amount: 5500.0,
      paymentDate: "2024-01-12",
      paymentMethod: "Wire Transfer",
      status: "completed",
      reference: "PAY-2024-002",
      completedDate: "2024-01-12",
    },
    {
      id: 3,
      invoiceNumber: "INV-2024-003",
      vendor: "Marketing Agency",
      amount: 3200.0,
      paymentDate: "2024-01-10",
      paymentMethod: "Check",
      status: "failed",
      reference: "PAY-2024-003",
      failureReason: "Insufficient funds",
    },
    {
      id: 4,
      invoiceNumber: "INV-2024-004",
      vendor: "Cloud Services Ltd.",
      amount: 890.0,
      paymentDate: "2024-01-20",
      paymentMethod: "Credit Card",
      status: "pending",
      reference: "PAY-2024-004",
    },
  ]

  const upcomingPayments = [
    { date: "Today", count: 3, amount: 8450 },
    { date: "Tomorrow", count: 2, amount: 15230 },
    { date: "This Week", count: 8, amount: 34670 },
    { date: "Next Week", count: 5, amount: 22100 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "scheduled":
        return <Calendar className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "failed":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-chart-1">Payments</h1>
          <p className="text-gray-600">Track and manage all payment transactions</p>
        </div>
        <Button className="bg-chart-1 hover:bg-chart-2">
          <DollarSign className="h-4 w-4 mr-2" />
          Process Payment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <div className="text-2xl font-bold mt-2">24</div>
            <p className="text-xs text-gray-600">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Scheduled</span>
            </div>
            <div className="text-2xl font-bold mt-2">8</div>
            <p className="text-xs text-gray-600">$23.5K total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <div className="text-2xl font-bold mt-2">5</div>
            <p className="text-xs text-gray-600">$12.3K total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Failed</span>
            </div>
            <div className="text-2xl font-bold mt-2">2</div>
            <p className="text-xs text-gray-600">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Latest payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{payment.reference}</span>
                      <Badge className={getStatusColor(payment.status)}>
                        {getStatusIcon(payment.status)}
                        <span className="ml-1">{payment.status}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{payment.vendor}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{payment.paymentMethod}</span>
                      <span>{payment.paymentDate}</span>
                    </div>
                    {payment.failureReason && <p className="text-xs text-red-600">{payment.failureReason}</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${payment.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Payments</CardTitle>
            <CardDescription>Payment schedule overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingPayments.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">{payment.date}</p>
                      <p className="text-sm text-gray-600">{payment.count} payments</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${payment.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
