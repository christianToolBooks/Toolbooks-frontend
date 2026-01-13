"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Progress } from "@/src/components/ui/progress"
import { CheckCircle2, X, AlertCircle, ArrowRight } from 'lucide-react'

type MatchPair = {
  id: string
  bookTransaction: {
    date: string
    payee: string
    description: string
    amount: number
    checkNumber?: string
  }
  bankTransaction: {
    date: string
    payee: string
    description: string
    amount: number
  }
  matchScore: number
  scoreBreakdown: {
    amountMatch: boolean
    dateProximity: number
    payeeSimilarity: number
    descriptionSimilarity: number
    checkNumberMatch: number
  }
  status: "pending" | "approved" | "rejected"
}

const mockMatches: MatchPair[] = [
  {
    id: "1",
    bookTransaction: {
      date: "2025-11-15",
      payee: "Office Supplies Inc",
      description: "Monthly office supplies order",
      amount: -245.50,
      checkNumber: "1018"
    },
    bankTransaction: {
      date: "2025-11-16",
      payee: "Office Supplies Inc.",
      description: "Office supplies",
      amount: -245.50
    },
    matchScore: 92,
    scoreBreakdown: {
      amountMatch: true,
      dateProximity: 38,
      payeeSimilarity: 28,
      descriptionSimilarity: 16,
      checkNumberMatch: 10
    },
    status: "pending"
  },
  {
    id: "2",
    bookTransaction: {
      date: "2025-11-10",
      payee: "ABC Software Solutions",
      description: "Annual software license renewal",
      amount: -1200.00
    },
    bankTransaction: {
      date: "2025-11-12",
      payee: "ABC Software Sol",
      description: "Software license",
      amount: -1200.00
    },
    matchScore: 85,
    scoreBreakdown: {
      amountMatch: true,
      dateProximity: 35,
      payeeSimilarity: 26,
      descriptionSimilarity: 14,
      checkNumberMatch: 0
    },
    status: "pending"
  },
  {
    id: "3",
    bookTransaction: {
      date: "2025-11-08",
      payee: "Client Payment - XYZ",
      description: "Invoice payment INV-1145",
      amount: 5000.00
    },
    bankTransaction: {
      date: "2025-11-09",
      payee: "XYZ Corporation",
      description: "Payment received",
      amount: 5000.00
    },
    matchScore: 78,
    scoreBreakdown: {
      amountMatch: true,
      dateProximity: 38,
      payeeSimilarity: 22,
      descriptionSimilarity: 8,
      checkNumberMatch: 0
    },
    status: "pending"
  },
  {
    id: "4",
    bookTransaction: {
      date: "2025-11-05",
      payee: "Utility Company",
      description: "Electric bill - November",
      amount: -320.75
    },
    bankTransaction: {
      date: "2025-11-07",
      payee: "Utility Co",
      description: "Electric service",
      amount: -320.75
    },
    matchScore: 72,
    scoreBreakdown: {
      amountMatch: true,
      dateProximity: 36,
      payeeSimilarity: 20,
      descriptionSimilarity: 16,
      checkNumberMatch: 0
    },
    status: "pending"
  },
]

export function FuzzyMatchingReview() {
  const [matches, setMatches] = useState(mockMatches)

  const handleApprove = (id: string) => {
    setMatches(matches.map(m => m.id === id ? { ...m, status: "approved" as const } : m))
  }

  const handleReject = (id: string) => {
    setMatches(matches.map(m => m.id === id ? { ...m, status: "rejected" as const } : m))
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-success"
    if (score >= 70) return "text-warning"
    return "text-destructive"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 85) {
      return <Badge variant="outline" className="bg-success/10 text-success border-success/20">High Confidence</Badge>
    } else if (score >= 70) {
      return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Medium Confidence</Badge>
    } else {
      return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Low Confidence</Badge>
    }
  }

  const pendingMatches = matches.filter(m => m.status === "pending")
  const approvedMatches = matches.filter(m => m.status === "approved")
  const avgScore = pendingMatches.reduce((sum, m) => sum + m.matchScore, 0) / (pendingMatches.length || 1)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending Review</CardDescription>
            <CardTitle className="text-3xl">{pendingMatches.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Matches awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-3xl text-success">{approvedMatches.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Confirmed matches</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Avg Match Score</CardDescription>
            <CardTitle className="text-3xl">{avgScore.toFixed(0)}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Confidence level</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Auto-Matched</CardDescription>
            <CardTitle className="text-3xl">142</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-success">≥70% confidence</p>
          </CardContent>
        </Card>
      </div>

      {/* Matching Review Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Fuzzy Matching Review</CardTitle>
              <CardDescription>Review and approve automatically matched transactions using ML-powered similarity scoring</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                Approve All High Confidence
              </Button>
              <Button>
                Bulk Actions
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingMatches.map((match) => (
            <Card key={match.id} className="border-2">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Match Score Header */}
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className={`text-3xl font-bold ${getScoreColor(match.matchScore)}`}>
                        {match.matchScore}%
                      </div>
                      {getScoreBadge(match.matchScore)}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleReject(match.id)}>
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button size="sm" onClick={() => handleApprove(match.id)}>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve Match
                      </Button>
                    </div>
                  </div>

                  {/* Transaction Comparison */}
                  <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                    {/* Book Transaction */}
                    <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                      <div className="text-xs font-medium text-muted-foreground uppercase">Book Transaction</div>
                      <div className="space-y-1">
                        <div className="font-medium">{match.bookTransaction.payee}</div>
                        <div className="text-sm text-muted-foreground">{match.bookTransaction.description}</div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(match.bookTransaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="font-mono font-medium">
                            ${Math.abs(match.bookTransaction.amount).toFixed(2)}
                          </span>
                        </div>
                        {match.bookTransaction.checkNumber && (
                          <div className="text-xs text-muted-foreground">
                            Check #{match.bookTransaction.checkNumber}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                      <ArrowRight className="w-6 h-6 text-muted-foreground" />
                    </div>

                    {/* Bank Transaction */}
                    <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="text-xs font-medium text-muted-foreground uppercase">Bank Transaction</div>
                      <div className="space-y-1">
                        <div className="font-medium">{match.bankTransaction.payee}</div>
                        <div className="text-sm text-muted-foreground">{match.bankTransaction.description}</div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(match.bankTransaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="font-mono font-medium">
                            ${Math.abs(match.bankTransaction.amount).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="pt-4 border-t">
                    <div className="text-sm font-medium mb-3">Match Score Breakdown</div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Amount</span>
                          <span className="font-medium">
                            {match.scoreBreakdown.amountMatch ? "✓" : "✗"}
                          </span>
                        </div>
                        <Progress value={match.scoreBreakdown.amountMatch ? 100 : 0} className="h-1.5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Date</span>
                          <span className="font-medium">{match.scoreBreakdown.dateProximity}/40</span>
                        </div>
                        <Progress value={(match.scoreBreakdown.dateProximity / 40) * 100} className="h-1.5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Payee</span>
                          <span className="font-medium">{match.scoreBreakdown.payeeSimilarity}/30</span>
                        </div>
                        <Progress value={(match.scoreBreakdown.payeeSimilarity / 30) * 100} className="h-1.5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Description</span>
                          <span className="font-medium">{match.scoreBreakdown.descriptionSimilarity}/20</span>
                        </div>
                        <Progress value={(match.scoreBreakdown.descriptionSimilarity / 20) * 100} className="h-1.5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Check #</span>
                          <span className="font-medium">{match.scoreBreakdown.checkNumberMatch}/10</span>
                        </div>
                        <Progress value={(match.scoreBreakdown.checkNumberMatch / 10) * 100} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {pendingMatches.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">All Matches Reviewed</h3>
              <p className="text-muted-foreground">
                There are no pending matches to review at this time.
              </p>
            </div>
          )}

          <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium mb-1">Fuzzy Matching Algorithm</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our matching system uses a weighted scoring algorithm: <strong>Amount Match</strong> (required), 
                  <strong>Date Proximity</strong> (40 points, ±5 business days), <strong>Payee Similarity</strong> (30 points, Levenshtein distance), 
                  <strong>Description Similarity</strong> (20 points, cosine similarity), and <strong>Check Number Match</strong> (10 bonus points). 
                  Scores ≥70% are flagged for review, ≥85% are considered high confidence.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
