"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { Progress } from "@/src/components/ui/progress"
import { Brain, TrendingUp, FileText, CreditCard, CheckSquare, AlertCircle } from 'lucide-react'

type PredictedItem = {
  id: string
  type: "check_gap" | "bill_pay" | "invoice" | "ml_pattern"
  payee: string
  description: string
  expectedAmount: number
  confidence: number
  predictedDate: string
  source: string
  checkNumber?: string
}

const mockPredictions: PredictedItem[] = [
  {
    id: "1",
    type: "bill_pay",
    payee: "Rent Payment",
    description: "Monthly office rent - scheduled payment",
    expectedAmount: -2500.00,
    confidence: 95,
    predictedDate: "2025-12-01",
    source: "Bill Pay Module"
  },
  {
    id: "2",
    type: "invoice",
    payee: "Client XYZ Corp",
    description: "Invoice #INV-2025-1156 payment expected",
    expectedAmount: 8500.00,
    confidence: 95,
    predictedDate: "2025-11-25",
    source: "Invoice Module"
  },
  {
    id: "3",
    type: "check_gap",
    payee: "Unknown",
    description: "Missing check in sequence",
    expectedAmount: 0,
    confidence: 70,
    predictedDate: "2025-11-20",
    source: "Check Gap Analysis",
    checkNumber: "1017"
  },
  {
    id: "4",
    type: "ml_pattern",
    payee: "Software Subscription",
    description: "Recurring monthly payment pattern detected",
    expectedAmount: -99.00,
    confidence: 88,
    predictedDate: "2025-12-12",
    source: "ML Pattern Recognition"
  },
  {
    id: "5",
    type: "ml_pattern",
    payee: "Payroll Processing",
    description: "Bi-weekly payroll pattern",
    expectedAmount: -15420.00,
    confidence: 92,
    predictedDate: "2025-11-29",
    source: "ML Pattern Recognition"
  },
]

export function OutstandingItemsPrediction() {
  const getTypeIcon = (type: PredictedItem["type"]) => {
    switch (type) {
      case "bill_pay":
        return <CreditCard className="w-4 h-4 text-primary" />
      case "invoice":
        return <FileText className="w-4 h-4 text-success" />
      case "check_gap":
        return <AlertCircle className="w-4 h-4 text-warning" />
      case "ml_pattern":
        return <Brain className="w-4 h-4 text-accent" />
    }
  }

  const getTypeBadge = (type: PredictedItem["type"]) => {
    const labels = {
      bill_pay: "Bill Pay",
      invoice: "Invoice",
      check_gap: "Check Gap",
      ml_pattern: "ML Pattern"
    }
    return <Badge variant="secondary" className="text-xs">{labels[type]}</Badge>
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) {
      return <Badge variant="outline" className="bg-success/10 text-success border-success/20">High</Badge>
    } else if (confidence >= 70) {
      return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Medium</Badge>
    } else {
      return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Low</Badge>
    }
  }

  const totalPredicted = mockPredictions.length
  const highConfidence = mockPredictions.filter(p => p.confidence >= 90).length
  const avgConfidence = mockPredictions.reduce((sum, p) => sum + p.confidence, 0) / totalPredicted

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Total Predictions
            </CardDescription>
            <CardTitle className="text-3xl">{totalPredicted}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Outstanding items expected</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              High Confidence
            </CardDescription>
            <CardTitle className="text-3xl text-success">{highConfidence}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">≥90% confidence</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Avg Confidence
            </CardDescription>
            <CardTitle className="text-3xl">{avgConfidence.toFixed(1)}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-success">Excellent accuracy</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              From Modules
            </CardDescription>
            <CardTitle className="text-3xl">2</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Bill Pay & Invoice</p>
          </CardContent>
        </Card>
      </div>

      {/* Predictions Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Outstanding Items Predictions</CardTitle>
              <CardDescription>ML-powered predictions for pending transactions across all sources</CardDescription>
            </div>
            <Button variant="outline">
              Refresh Predictions
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Type</TableHead>
                  <TableHead>Payee & Description</TableHead>
                  <TableHead className="text-right">Expected Amount</TableHead>
                  <TableHead>Predicted Date</TableHead>
                  <TableHead className="text-center">Confidence</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPredictions.map((prediction) => (
                  <TableRow key={prediction.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(prediction.type)}
                        {getTypeBadge(prediction.type)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{prediction.payee}</div>
                        <div className="text-sm text-muted-foreground">{prediction.description}</div>
                        {prediction.checkNumber && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Check #{prediction.checkNumber}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className={`text-right font-mono font-medium ${prediction.expectedAmount > 0 ? 'text-success' : 'text-foreground'}`}>
                      {prediction.expectedAmount === 0 ? (
                        <span className="text-muted-foreground">Unknown</span>
                      ) : (
                        `${prediction.expectedAmount > 0 ? '+' : ''}$${Math.abs(prediction.expectedAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {new Date(prediction.predictedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-2">
                        {getConfidenceBadge(prediction.confidence)}
                        <div className="flex items-center gap-2 w-full">
                          <Progress value={prediction.confidence} className="h-1.5 flex-1" />
                          <span className="text-xs font-medium text-muted-foreground w-10 text-right">
                            {prediction.confidence}%
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{prediction.source}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                        <Button size="sm" variant="ghost">
                          Dismiss
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium mb-1">How Predictions Work</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our system uses multiple sources to predict outstanding items: <strong>Bill Pay Module</strong> (95% confidence) 
                  tracks scheduled payments, <strong>Invoice Module</strong> (95% confidence) monitors expected receivables, 
                  <strong>Check Gap Analysis</strong> (70% variable) identifies missing check numbers in sequences, and 
                  <strong>ML Pattern Recognition</strong> (70-90% confidence) detects recurring payment patterns from historical data.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
