"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Droplets,
  AlertTriangle,
  Info,
  Activity,
  ArrowRight,
  BarChart3,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

// Enhanced mock data with more professional details
const metricsData = [
  {
    id: "liquidity",
    title: "Current Ratio",
    description: "Short-term liquidity capability",
    value: "2.4",
    unit: "x",
    trend: "up",
    change: "+0.3",
    status: "good",
    icon: Droplets,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    alerts: [
      { type: "info", message: "Liquidity is optimal for upcoming operational expenses." },
      { type: "warning", message: "Consider short-term investment for excess cash." },
    ],
    historicalData: [
      { month: "Jan", value: 1.8 },
      { month: "Feb", value: 2.1 },
      { month: "Mar", value: 2.0 },
      { month: "Apr", value: 2.2 },
      { month: "May", value: 2.4 },
      { month: "Jun", value: 2.4 },
    ],
  },
  {
    id: "margin",
    title: "Gross Margin",
    description: "Revenue minus COGS",
    value: "34.2",
    unit: "%",
    trend: "down",
    change: "-2.1",
    status: "warning",
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    alerts: [
      { type: "warning", message: "Margin has dipped below the 36% target." },
      { type: "critical", message: "Raw material costs increased by 5% this month." },
    ],
    historicalData: [
      { month: "Jan", value: 38.5 },
      { month: "Feb", value: 37.2 },
      { month: "Mar", value: 36.8 },
      { month: "Apr", value: 35.1 },
      { month: "May", value: 34.2 },
      { month: "Jun", value: 34.2 },
    ],
  },
  {
    id: "burn",
    title: "Monthly Burn",
    description: "Net cash outflow",
    value: "12.5",
    unit: "k",
    trend: "down",
    change: "-1.2",
    status: "good",
    icon: Activity,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    alerts: [{ type: "good", message: "Burn rate reduced by 8% via cost optimization." }],
    historicalData: [
      { month: "Jan", value: 15.2 },
      { month: "Feb", value: 14.8 },
      { month: "Mar", value: 14.1 },
      { month: "Apr", value: 13.5 },
      { month: "May", value: 12.8 },
      { month: "Jun", value: 12.5 },
    ],
  },
  {
    id: "runway",
    title: "Runway",
    description: "Months until cash zero",
    value: "18",
    unit: "mo",
    trend: "up",
    change: "+2",
    status: "good",
    icon: BarChart3,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    alerts: [{ type: "info", message: "Runway extended due to recent funding round." }],
    historicalData: [
      { month: "Jan", value: 12 },
      { month: "Feb", value: 11 },
      { month: "Mar", value: 10 },
      { month: "Apr", value: 16 },
      { month: "May", value: 17 },
      { month: "Jun", value: 18 },
    ],
  },
]

const statusStyles = {
  good: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", icon: "text-emerald-600" },
  warning: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", icon: "text-amber-600" },
  critical: { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-200", icon: "text-rose-600" },
  info: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", icon: "text-blue-600" },
}

export function MetricsCards() {
  const [selectedMetric, setSelectedMetric] = useState<(typeof metricsData)[0] | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsData.map((metric) => (
          <Card
            key={metric.id}
            className="group relative overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 border-slate-200 hover:border-blue-300 bg-white"
            onClick={() => setSelectedMetric(metric)}
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-slate-500">{metric.title}</CardTitle>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">
                  {metric.unit === "$" ? "$" : ""}
                  {metric.value}
                  {metric.unit === "%"
                    ? "%"
                    : metric.unit === "x"
                      ? "x"
                      : metric.unit === "mo"
                        ? " mo"
                        : metric.unit === "k"
                          ? "k"
                          : ""}
                </div>
              </div>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  {metric.trend === "up" ? (
                    <div className="flex items-center text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {metric.change}
                    </div>
                  ) : (
                    <div className="flex items-center text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      {metric.change}
                    </div>
                  )}
                  <span className="text-slate-400 font-normal">vs last month</span>
                </div>
              </div>

              {/* Mini Sparkline Decoration */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-50 group-hover:bg-blue-50 transition-colors">
                <div
                  className={`h-full ${metric.status === "good" ? "bg-emerald-500" : metric.status === "warning" ? "bg-amber-500" : "bg-rose-500"}`}
                  style={{ width: `${Math.min(Number.parseFloat(metric.value) * 2, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Metric Detail Modal */}
      <Dialog open={!!selectedMetric} onOpenChange={() => setSelectedMetric(null)}>
        <DialogContent className="flex flex-col max-w-3xl gap-0 p-0 overflow-hidden border-slate-200 sm:rounded-xl">
          {selectedMetric && (
            <div className="flex flex-col md:flex-row h-full">
              {/* Left Panel: Chart & Main Stat */}
              <div className="flex-1 p-6 bg-white">
                <DialogHeader className="mb-6">
                  <div className="flex items-center gap-3 mb-1">
                    <div className={`p-2 rounded-lg ${selectedMetric.bgColor}`}>
                      <selectedMetric.icon className={`h-5 w-5 ${selectedMetric.color}`} />
                    </div>
                    <DialogTitle className="text-xl font-semibold text-slate-900">{selectedMetric.title}</DialogTitle>
                  </div>
                  <DialogDescription className="text-slate-500 ml-11">{selectedMetric.description}</DialogDescription>
                </DialogHeader>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-slate-900">
                      {selectedMetric.unit === "$" ? "$" : ""}
                      {selectedMetric.value}
                      {selectedMetric.unit === "%"
                        ? "%"
                        : selectedMetric.unit === "x"
                          ? "x"
                          : selectedMetric.unit === "mo"
                            ? " mo"
                            : selectedMetric.unit === "k"
                              ? "k"
                              : ""}
                    </span>
                    <span
                      className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                        selectedMetric.trend === "up" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {selectedMetric.change}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">Compared to previous period</p>
                </div>

                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedMetric.historicalData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Panel: Insights & Actions */}
              <div className="w-full md:w-80 bg-slate-50/50 border-t md:border-t-0 md:border-l border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                  Insights & Alerts
                </h3>

                <div className="space-y-3">
                  {selectedMetric.alerts.map((alert, index) => {
                    const style =
                      alert.type === "critical"
                        ? statusStyles.critical
                        : alert.type === "warning"
                          ? statusStyles.warning
                          : alert.type === "good"
                            ? statusStyles.good
                            : statusStyles.info

                    return (
                      <div
                        key={index}
                        className={`flex gap-3 p-3 rounded-lg border bg-white ${style.border} shadow-sm`}
                      >
                        <div className={`mt-0.5 ${style.icon}`}>
                          {alert.type === "critical" || alert.type === "warning" ? (
                            <AlertTriangle className="h-4 w-4" />
                          ) : (
                            <Info className="h-4 w-4" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className={`text-xs font-semibold uppercase ${style.text}`}>{alert.type}</p>
                          <p className="text-sm text-slate-700 leading-snug">{alert.message}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200">
                  <h4 className="text-sm font-medium text-slate-900 mb-3">Recommended Actions</h4>
                  <button className="w-full flex items-center justify-between p-3 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors group">
                    <span>View detailed report</span>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}