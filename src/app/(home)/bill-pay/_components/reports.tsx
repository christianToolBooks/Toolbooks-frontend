"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  FileText,
} from "lucide-react"

export function BillPayReports() {
  const mockReports = [
    {
      id: 1,
      name: "Monthly Payment Summary",
      description: "Summary of all payments made this month",
      type: "Payment Report",
      lastGenerated: "2024-01-15",
      status: "ready",
      size: "2.3 MB",
    },
    {
      id: 2,
      name: "Vendor Analysis",
      description: "Detailed analysis of vendor payment patterns",
      type: "Analytics Report",
      lastGenerated: "2024-01-10",
      status: "ready",
      size: "1.8 MB",
    },
    {
      id: 3,
      name: "Cash Flow Forecast",
      description: "Projected cash flow based on scheduled payments",
      type: "Forecast Report",
      lastGenerated: "2024-01-12",
      status: "generating",
      size: "Processing...",
    },
    {
      id: 4,
      name: "Approval Workflow Report",
      description: "Analysis of approval times and bottlenecks",
      type: "Workflow Report",
      lastGenerated: "2024-01-08",
      status: "ready",
      size: "1.2 MB",
    },
  ]

  const quickStats = [
    {
      title: "Total Payments",
      value: "$125,430",
      change: "+12.5%",
      trend: "up",
      period: "This month",
    },
    {
      title: "Average Processing Time",
      value: "2.3 days",
      change: "-0.5 days",
      trend: "down",
      period: "vs last month",
    },
    {
      title: "Automation Rate",
      value: "87%",
      change: "+5%",
      trend: "up",
      period: "This quarter",
    },
    {
      title: "Cost Savings",
      value: "$8,750",
      change: "+15%",
      trend: "up",
      period: "This quarter",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800"
      case "generating":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-8 pb-8">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-chart-1">Reports</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Generate and download bill pay reports and analytics
          </p>
        </div>

        <Button className="w-full sm:w-auto bg-chart-1 hover:bg-chart-2">
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="h-full">
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="text-right">
                  <div
                    className={`flex items-center gap-1 ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <TrendingUp
                      className={`h-3 w-3 ${
                        stat.trend === "down" ? "rotate-180" : ""
                      }`}
                    />
                    <span className="text-sm font-medium">{stat.change}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{stat.period}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Reports</CardTitle>
          <CardDescription>
            Download or generate new reports
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          {mockReports.map((report) => (
            <div
              key={report.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border rounded-xl hover:bg-gray-50 transition"
            >
              {/* Left Section */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-base">{report.name}</h3>
                  <p className="text-sm text-gray-600">{report.description}</p>

                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>{report.type}</span>

                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {report.lastGenerated}
                    </div>

                    <span>{report.size}</span>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <Badge className={`${getStatusColor(report.status)} capitalize`}>
                  {report.status}
                </Badge>

                {report.status === "ready" && (
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}

                {report.status === "generating" && (
                  <Button variant="outline" size="sm" disabled>
                    Generating...
                  </Button>
                )}
              </div>
            </div>
          ))}

        </CardContent>
      </Card>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Report Templates</CardTitle>
          <CardDescription>
            Quick access to commonly used reports
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <Button
              variant="outline"
              className="h-24 flex-col gap-2 bg-transparent rounded-xl shadow-sm"
            >
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Payment Summary</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex-col gap-2 bg-transparent rounded-xl shadow-sm"
            >
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">Vendor Analysis</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex-col gap-2 bg-transparent rounded-xl shadow-sm"
            >
              <DollarSign className="h-6 w-6" />
              <span className="text-sm">Cash Flow</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
