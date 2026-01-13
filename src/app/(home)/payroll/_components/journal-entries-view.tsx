"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, FileText, CheckCircle } from "lucide-react"
import { JournalEntry } from "../types/payroll"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/src/components/ui/collapsible"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"

export function JournalEntriesView() {
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set())

  // Mock data - replace with actual API calls
  const journalEntries: JournalEntry[] = [
    {
      entry_id: "je-1",
      client_id: "client-1",
      transaction_id: "1",
      entry_date: "2024-01-20",
      entry_number: "JE-2024-001",
      description: "Payroll - John Doe - Jan 1-15, 2024",
      total_debits: 3950.0,
      total_credits: 3950.0,
      status: "posted",
      lines: [
        {
          line_id: "jel-1",
          entry_id: "je-1",
          gl_account_number: "6000",
          debit_amount: 3500.0,
          credit_amount: 0,
          description: "Regular Wages - John Doe",
        },
        {
          line_id: "jel-2",
          entry_id: "je-1",
          gl_account_number: "6200",
          debit_amount: 217.0,
          credit_amount: 0,
          description: "FICA Employer Expense",
        },
        {
          line_id: "jel-3",
          entry_id: "je-1",
          gl_account_number: "6205",
          debit_amount: 50.75,
          credit_amount: 0,
          description: "Medicare Employer Expense",
        },
        {
          line_id: "jel-4",
          entry_id: "je-1",
          gl_account_number: "6210",
          debit_amount: 182.25,
          credit_amount: 0,
          description: "FUTA Expense",
        },
        {
          line_id: "jel-5",
          entry_id: "je-1",
          gl_account_number: "1000",
          debit_amount: 0,
          credit_amount: 2650.0,
          description: "Cash - Net Pay",
        },
        {
          line_id: "jel-6",
          entry_id: "je-1",
          gl_account_number: "2200",
          debit_amount: 0,
          credit_amount: 325.0,
          description: "Federal Income Tax Payable",
        },
        {
          line_id: "jel-7",
          entry_id: "je-1",
          gl_account_number: "2210",
          debit_amount: 0,
          credit_amount: 217.0,
          description: "FICA Employee Payable",
        },
        {
          line_id: "jel-8",
          entry_id: "je-1",
          gl_account_number: "2215",
          debit_amount: 0,
          credit_amount: 50.75,
          description: "Medicare Employee Payable",
        },
        {
          line_id: "jel-9",
          entry_id: "je-1",
          gl_account_number: "2100",
          debit_amount: 0,
          credit_amount: 200.0,
          description: "Health Insurance Payable",
        },
        {
          line_id: "jel-10",
          entry_id: "je-1",
          gl_account_number: "2120",
          debit_amount: 0,
          credit_amount: 175.0,
          description: "401k Contributions Payable",
        },
        {
          line_id: "jel-11",
          entry_id: "je-1",
          gl_account_number: "2200",
          debit_amount: 0,
          credit_amount: 217.0,
          description: "FICA Employer Payable",
        },
        {
          line_id: "jel-12",
          entry_id: "je-1",
          gl_account_number: "2215",
          debit_amount: 0,
          credit_amount: 50.75,
          description: "Medicare Employer Payable",
        },
        {
          line_id: "jel-13",
          entry_id: "je-1",
          gl_account_number: "2220",
          debit_amount: 0,
          credit_amount: 182.25,
          description: "FUTA Payable",
        },
      ],
    },
  ]

  const toggleExpanded = (entryId: string) => {
    const newExpanded = new Set(expandedEntries)
    if (newExpanded.has(entryId)) {
      newExpanded.delete(entryId)
    } else {
      newExpanded.add(entryId)
    }
    setExpandedEntries(newExpanded)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "secondary",
      posted: "default",
      reversed: "destructive",
    } as const

    const icons = {
      draft: FileText,
      posted: CheckCircle,
      reversed: FileText,
    }

    const Icon = icons[status as keyof typeof icons]

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        <Icon className="mr-1 h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Journal Entries</h3>
        <p className="text-sm text-muted-foreground">
          Automatically generated journal entries from payroll transactions
        </p>
      </div>

      <div className="space-y-4">
        {journalEntries.map((entry) => (
          <Card key={entry.entry_id}>
            <Collapsible>
              <CollapsibleTrigger className="w-full" onClick={() => toggleExpanded(entry.entry_id)}>
                <CardHeader className="hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {expandedEntries.has(entry.entry_id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <div className="text-left">
                        <CardTitle className="text-base">{entry.entry_number}</CardTitle>
                        <CardDescription>{entry.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">${entry.total_debits.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(entry.entry_date).toLocaleDateString()}
                        </div>
                      </div>
                      {getStatusBadge(entry.status)}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Debit</TableHead>
                        <TableHead className="text-right">Credit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entry.lines.map((line) => (
                        <TableRow key={line.line_id}>
                          <TableCell className="font-medium">{line.gl_account_number}</TableCell>
                          <TableCell>{line.description}</TableCell>
                          <TableCell className="text-right">
                            {line.debit_amount > 0 ? `$${line.debit_amount.toLocaleString()}` : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {line.credit_amount > 0 ? `$${line.credit_amount.toLocaleString()}` : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-t-2 font-medium">
                        <TableCell colSpan={2}>Totals</TableCell>
                        <TableCell className="text-right">${entry.total_debits.toLocaleString()}</TableCell>
                        <TableCell className="text-right">${entry.total_credits.toLocaleString()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  )
}
