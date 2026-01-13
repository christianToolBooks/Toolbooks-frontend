"use client"

import { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/src/components/ui/card"
import { Progress } from "@/src/components/ui/progress"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Check, X, AlertCircle, Wand2, ArrowRight, Search, Filter } from 'lucide-react'
import { Input } from "@/src/components/ui/input"
import { formatCurrency, formatDate } from "@/src/lib/utils/formatters"
import { cn } from "@/src/lib/utils/utils"

// Mock data for reconciliation items
const pendingMatches = [
  {
    id: "match_1",
    score: 98,
    bankTx: {
      date: "2025-10-28",
      payee: "STRIPE PAYOUT 8832",
      amount: 12500.00,
    },
    bookTx: {
      date: "2025-10-28",
      payee: "Stripe Payout",
      amount: 12500.00,
      source: "Plaid"
    }
  },
  {
    id: "match_2",
    score: 85,
    bankTx: {
      date: "2025-10-30",
      payee: "WEWORK 5543 NYC",
      amount: -4500.00,
    },
    bookTx: {
      date: "2025-10-29", // Date mismatch but close
      payee: "WeWork",
      amount: -4500.00,
      source: "Bill Pay"
    }
  },
  {
    id: "match_3",
    score: 72,
    bankTx: {
      date: "2025-11-02", // In grace period
      payee: "CHECK #1044",
      amount: -1200.00,
    },
    bookTx: {
      date: "2025-10-25",
      payee: "Consulting Services LLC",
      amount: -1200.00,
      source: "Manual Check"
    },
    note: "Grace Period Match"
  }
]

const unmatchedBank = [
  {
    id: "bank_1",
    date: "2025-10-31",
    payee: "BANK FEE - WIRE",
    amount: -25.00,
  },
  {
    id: "bank_2",
    date: "2025-10-15",
    payee: "UNKNOWN DEPOSIT",
    amount: 150.00,
  }
]

export function ReconciliationWorkspace() {
  const [activeTab, setActiveTab] = useState<"matches" | "unmatched">("matches")

  return (
    <div className="h-full flex flex-col">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 p-6 pb-2">
        <Card className="shadow-sm border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Book Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(142500.50)}</div>
            <p className="text-xs text-muted-foreground mt-1">As of Oct 31, 2025</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bank Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(142325.50)}</div>
            <p className="text-xs text-muted-foreground mt-1">Imported from Plaid</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm  bg-amber-50/50 dark:bg-amber-950/10 border-amber-200/50 dark:border-amber-800/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-400">Difference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">{formatCurrency(175.00)}</div>
            <p className="text-xs text-amber-600/80 dark:text-amber-500/80 mt-1">Needs resolution</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between mb-2">
              <span className="text-2xl font-bold">85%</span>
              <span className="text-xs text-muted-foreground mb-1">42/49 items</span>
            </div>
            <Progress value={85} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 p-6 pt-4 min-h-0 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center bg-muted p-1 rounded-lg border">
            <button
              onClick={() => setActiveTab("matches")}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                activeTab === "matches" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Suggested Matches <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300">3</Badge>
            </button>
            <button
              onClick={() => setActiveTab("unmatched")}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                activeTab === "unmatched" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Unmatched Items <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-300">2</Badge>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Filter transactions..." className="pl-9 h-9" />
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto rounded-xl border bg-card shadow-sm">
          {activeTab === "matches" ? (
            <div className="divide-y">
              <div className="grid grid-cols-[1fr_auto_1fr_auto] gap-4 p-4 bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wider sticky top-0 backdrop-blur-sm z-10">
                <div>Bank Statement Line</div>
                <div className="w-8"></div>
                <div>Book Transaction</div>
                <div className="w-32 text-right">Action</div>
              </div>
              
              {pendingMatches.map((match) => (
                <div key={match.id} className="grid grid-cols-[1fr_auto_1fr_auto] gap-4 p-4 items-center hover:bg-muted/30 transition-colors group">
                  {/* Bank Side */}
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">BK</span>
                    </div>
                    <div>
                      <div className="font-medium">{match.bankTx.payee}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        {formatDate(match.bankTx.date)}
                        <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {formatCurrency(match.bankTx.amount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Match Indicator */}
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border",
                      match.score >= 90 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                        : match.score >= 70
                        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                        : "bg-red-50 text-red-700 border-red-200"
                    )}>
                      <Wand2 className="h-3 w-3" />
                      {match.score}%
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
                  </div>

                  {/* Book Side */}
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100 dark:bg-purple-900/20 dark:border-purple-800">
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">TB</span>
                    </div>
                    <div>
                      <div className="font-medium">{match.bookTx.payee}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        {formatDate(match.bookTx.date)}
                        <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {formatCurrency(match.bookTx.amount)}
                        </span>
                        <Badge variant="outline" className="text-[10px] h-5 font-normal">
                          {match.bookTx.source}
                        </Badge>
                      </div>
                      {match.note && (
                        <div className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {match.note}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                      <X className="h-4 w-4" />
                    </Button>
                    <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white border-transparent">
                      <Check className="h-4 w-4 mr-1" />
                      Confirm
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Unmatched Transactions</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                These items from your bank statement don&lsquo;t have a corresponding record in ToolBooks yet.
              </p>
              
              <div className="mt-8 max-w-2xl mx-auto text-left">
                {unmatchedBank.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg mb-3 bg-card hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-bold">BK</span>
                      </div>
                      <div>
                        <div className="font-medium">{item.payee}</div>
                        <div className="text-sm text-muted-foreground">{formatDate(item.date)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono font-medium">{formatCurrency(item.amount)}</span>
                      <Button variant="outline" size="sm">Create Record</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
