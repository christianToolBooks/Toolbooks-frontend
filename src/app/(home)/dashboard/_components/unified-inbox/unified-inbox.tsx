"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Bell, AlertTriangle, Info, CheckCircle, Clock, Filter, ArrowRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { cn } from "@/src/lib/utils/utils"

const notifications = [
  {
    id: 1,
    type: "alert",
    priority: "critical",
    title: "Critical Cash Flow",
    description: "Projected cash flow for the next 7 days shows a deficit of $15,000",
    timestamp: "2 min ago",
    category: "Liquidity",
    actionRequired: true,
  },
  {
    id: 2,
    type: "request",
    priority: "high",
    title: "Information Request: Q1 Expenses",
    description: "Detailed breakdown of Q1 operational expenses required",
    timestamp: "15 min ago",
    category: "Reports",
    actionRequired: true,
  },
  {
    id: 3,
    type: "alert",
    priority: "medium",
    title: "Gross Margin Below Target",
    description: "Current gross margin (34.2%) is below the established target (36%)",
    timestamp: "1 hour ago",
    category: "Profitability",
    actionRequired: false,
  },
  {
    id: 4,
    type: "request",
    priority: "medium",
    title: "Budget Update",
    description: "Review and update annual budget based on Q2 performance",
    timestamp: "3 hours ago",
    category: "Planning",
    actionRequired: true,
  },
  {
    id: 5,
    type: "alert",
    priority: "low",
    title: "Investment Opportunity",
    description: "Excess liquidity detected. Consider short-term investment options",
    timestamp: "1 day ago",
    category: "Investments",
    actionRequired: false,
  },
]

const priorityConfig = {
  critical: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    badge: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
    icon: AlertTriangle,
    label: "Critical",
  },
  high: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    badge: "bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200",
    icon: AlertTriangle,
    label: "High",
  },
  medium: {
    bg: "bg-[#F0F6FE]",
    border: "border-[#A2A8AB]",
    text: "text-[#1E3A8A]",
    badge: "bg-[#F0F6FE] text-[#1E3A8A] hover:bg-[#F0F6FE] border-[#A2A8AB]",
    icon: Clock,
    label: "Medium",
  },
  low: {
    bg: "bg-[#EFECE6]",
    border: "border-[#A2A8AB]",
    text: "text-[#5C769D]",
    badge: "bg-[#EFECE6] text-[#5C769D] hover:bg-[#EFECE6] border-[#A2A8AB]",
    icon: Info,
    label: "Low",
  },
}

const typeConfig = {
  alert: { icon: Bell, label: "Alert", color: "text-[#5C769D]" },
  request: { icon: CheckCircle, label: "Request", color: "text-[#5C769D]" },
}

export function UnifiedInbox() {
  const [filter, setFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredNotifications = notifications.filter((notification) => {
    const typeMatch = filter === "all" || notification.type === filter
    const priorityMatch = priorityFilter === "all" || notification.priority === priorityFilter
    return typeMatch && priorityMatch
  })

  return (
    <Card className="border-chart-1/20 shadow-sm bg-white">
      <CardHeader className="border-b border-[#EFECE6] pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-[#1E3A8A]">
              <Bell className="h-5 w-5 text-[#5C769D]" />
              Unified Inbox
              <Badge variant="secondary" className="ml-2 bg-[#F0F6FE] text-[#1E3A8A] hover:bg-[#F0F6FE]">
                {filteredNotifications.length}
              </Badge>
            </CardTitle>
            <CardDescription className="text-[#5C769D]">
              Manage your alerts, requests, and notifications in one place.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[140px] h-9 text-sm border-[#A2A8AB] bg-white">
                <div className="flex items-center gap-2 text-[#5C769D]">
                  <Filter className="h-3.5 w-3.5" />
                  <SelectValue placeholder="Type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="alert">Alerts</SelectItem>
                <SelectItem value="request">Requests</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px] h-9 text-sm border-[#A2A8AB] bg-white">
                <div className="flex items-center gap-2 text-[#5C769D]">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <SelectValue placeholder="Priority" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-[#EFECE6]">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-[#F0F6FE] flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-[#A2A8AB]" />
              </div>
              <h3 className="text-sm font-medium text-[#1E3A8A]">No notifications found</h3>
              <p className="text-sm text-[#5C769D] mt-1 max-w-xs">
                You&lsquo;re all caught up! Check back later for new alerts or requests.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const TypeIcon = typeConfig[notification.type as keyof typeof typeConfig].icon
              const priorityStyle = priorityConfig[notification.priority as keyof typeof priorityConfig]
              const PriorityIcon = priorityStyle.icon

              return (
                <div
                  key={notification.id}
                  className="group flex flex-col sm:flex-row items-start gap-4 p-4 hover:bg-[#F0F6FE]/50 transition-colors"
                >
                  {/* Icon Column */}
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center border",
                        priorityStyle.bg,
                        priorityStyle.border,
                      )}
                    >
                      <TypeIcon className={cn("h-5 w-5", priorityStyle.text)} />
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-[#1E3A8A] leading-none mb-1.5">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-[#5C769D] leading-relaxed">{notification.description}</p>
                      </div>
                      <span className="flex-shrink-0 text-xs text-[#A2A8AB] whitespace-nowrap">
                        {notification.timestamp}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <Badge variant="outline" className={cn("text-xs font-medium border", priorityStyle.badge)}>
                        <PriorityIcon className="h-3 w-3 mr-1" />
                        {priorityStyle.label}
                      </Badge>
                      <Badge variant="outline" className="text-xs text-[#5C769D] border-[#A2A8AB] bg-white">
                        {notification.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs text-[#5C769D] border-[#A2A8AB] bg-white">
                        {typeConfig[notification.type as keyof typeof typeConfig].label}
                      </Badge>
                    </div>
                  </div>

                  {/* Action Column */}
                  {notification.actionRequired && (
                    <div className="flex-shrink-0 mt-4 sm:mt-0 sm:self-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full sm:w-auto border-[#A2A8AB] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white hover:border-[#1E3A8A] transition-all shadow-sm bg-transparent"
                      >
                        Review
                        <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
