"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Activity, AlertCircle, ArrowUpRight, Building2, CheckCircle2, Clock, Wallet } from "lucide-react"
import { Badge } from "@/src/components/ui/badge"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { ReconciliationQueryApiResponse } from "@/src/types/bank-reconciliation"
import { formatCurrency } from "@/src/lib/utils/formatters"


interface LastReconciliationCardProps {
  data: ReconciliationQueryApiResponse | null
}

export function LastReconciliationCard({ data }: LastReconciliationCardProps) {
  if (!data) return null

  const totalBalance = data.accounts.reduce((sum, acc) => sum + (acc?.closingBalance ?? 0), 0)
  const totalPending = data.accounts.reduce(
    (sum, acc) => sum + (acc?.reconciliation?.onlyInBank ?? 0) + (acc?.reconciliation?.onlyInBooks ?? 0),
    0,
  )
  const activeAccounts = data.accounts.length
  const accountsWithIssues = data.accounts.filter(
    (acc) => ((acc?.reconciliation?.onlyInBank ?? 0) + (acc?.reconciliation?.onlyInBooks ?? 0)) > 0,
  ).length

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <Card className="w-full overflow-hidden border-slate-200 bg-white gap-1 shadow-sm transition-all hover:shadow-md">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-900">
              <Activity className="h-5 w-5 text-blue-600" />
              Reconciliation Overview
            </CardTitle>
            <CardDescription className="text-slate-500">Snapshot of your latest financial position</CardDescription>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm ring-1 ring-slate-200">
            <Clock className="h-3.5 w-3.5" />
            <span>
              Updated: {currentDate} at {currentTime}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-colors hover:border-blue-100 hover:bg-blue-50/30">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
              <Wallet className="h-4 w-4" />
              Total Balance
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(totalBalance)}
            </div>
            <div className="mt-1 text-xs text-slate-400">Across all accounts</div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-colors hover:border-amber-100 hover:bg-amber-50/30">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
              <AlertCircle className="h-4 w-4" />
              Pending Items
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold ${totalPending > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                {totalPending}
              </span>
              <span className="text-xs text-slate-400">transactions</span>
            </div>
            <div className="mt-1 text-xs text-slate-400">Requires attention</div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-colors hover:border-slate-200">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
              <Building2 className="h-4 w-4" />
              Active Accounts
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{activeAccounts}</span>
              <span className="text-xs text-slate-400">connected</span>
            </div>
            <div className="mt-1 text-xs text-slate-400">
              {accountsWithIssues > 0 ? `${accountsWithIssues} with pending items` : "All accounts synced"}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/50 rounded-t-xl">
            <h3 className="font-semibold text-slate-900">Account Details</h3>
            <Badge variant="outline" className="bg-white font-normal text-slate-500">
              {data.accounts.length} Accounts
            </Badge>
          </div>

          <ScrollArea className="h-[56vh]">
            <div className="divide-y divide-slate-100">
              {data.accounts.map((account) => {
                const pendingCount = (account?.reconciliation?.onlyInBank ?? 0) + (account?.reconciliation?.onlyInBooks ?? 0)
                const hasPending = pendingCount > 0

                return (
                  <div
                    key={account?.statementId ?? Math.random()}
                    className="flex flex-col gap-3 p-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${hasPending ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"}`}
                      >
                        {hasPending ? <Clock className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{account?.accountName ?? "N/A"}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>ID: {(account?.statementId ?? "").slice(0, 8)}...</span>
                          {hasPending && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span className="text-amber-600 font-medium">{pendingCount} pending items</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="text-right">
                        <p className="font-mono font-semibold text-slate-900">
                          {formatCurrency(account?.closingBalance ?? 0)}
                        </p>
                        <p className="text-xs text-slate-500">Closing Balance</p>
                      </div>
                      <div className="hidden sm:block">
                        <ArrowUpRight className="h-4 w-4 text-slate-300" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
