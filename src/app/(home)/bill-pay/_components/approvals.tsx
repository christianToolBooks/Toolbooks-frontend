"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { CheckCircle, XCircle, Clock, User, Calendar } from "lucide-react"

export function BillPayApprovals() {
  const mockApprovals = [
    {
      id: 1,
      invoiceNumber: "INV-2024-001",
      vendor: "Office Supplies Co.",
      amount: 1250.0,
      requestedBy: "John Smith",
      requestDate: "2024-01-10",
      status: "pending",
      priority: "medium",
      description: "Monthly office supplies order",
      approver: "Sarah Johnson",
    },
    {
      id: 2,
      invoiceNumber: "INV-2024-002",
      vendor: "Tech Solutions Inc.",
      amount: 5500.0,
      requestedBy: "Mike Davis",
      requestDate: "2024-01-08",
      status: "approved",
      priority: "high",
      description: "Software licensing renewal",
      approver: "Sarah Johnson",
      approvedDate: "2024-01-09",
    },
    {
      id: 3,
      invoiceNumber: "INV-2024-003",
      vendor: "Marketing Agency",
      amount: 3200.0,
      requestedBy: "Lisa Wilson",
      requestDate: "2024-01-07",
      status: "rejected",
      priority: "low",
      description: "Additional marketing services",
      approver: "Sarah Johnson",
      rejectedDate: "2024-01-08",
      rejectionReason: "Budget exceeded for this quarter",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-chart-1">Approvals</h1>
          <p className="text-gray-600">Review and approve pending bill payments</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <div className="text-2xl font-bold mt-2">12</div>
            <p className="text-xs text-gray-600">$45,230 total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Approved</span>
            </div>
            <div className="text-2xl font-bold mt-2">28</div>
            <p className="text-xs text-gray-600">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Rejected</span>
            </div>
            <div className="text-2xl font-bold mt-2">3</div>
            <p className="text-xs text-gray-600">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Approvals List */}
      <Card>
        <CardHeader>
          <CardTitle>Approval Requests</CardTitle>
          <CardDescription>Bills awaiting approval or recently processed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockApprovals.map((approval) => (
              <div key={approval.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{approval.invoiceNumber}</h3>
                      <Badge className={getStatusColor(approval.status)}>
                        {getStatusIcon(approval.status)}
                        <span className="ml-1">{approval.status}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{approval.vendor}</p>
                    <p className="text-xs text-gray-500">{approval.description}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold">${approval.amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Requested by:</span>
                      <span className="font-medium">{approval.requestedBy}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Request date:</span>
                      <span className="font-medium">{approval.requestDate}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Approver:</span>
                      <span className="font-medium">{approval.approver}</span>
                    </div>
                    {approval.approvedDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Approved:</span>
                        <span className="font-medium">{approval.approvedDate}</span>
                      </div>
                    )}
                    {approval.rejectedDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Rejected:</span>
                        <span className="font-medium">{approval.rejectedDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {approval.rejectionReason && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>Rejection Reason:</strong> {approval.rejectionReason}
                    </p>
                  </div>
                )}

                {approval.status === "pending" && (
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button variant="outline" size="sm">
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
