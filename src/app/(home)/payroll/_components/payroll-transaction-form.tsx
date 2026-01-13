/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { PayrollLineItem, PayrollTransaction } from "../types/payroll"

interface PayrollTransactionFormProps {
  transaction?: PayrollTransaction
  onClose: () => void
  onSave: (transaction: PayrollTransaction) => void
}

export function PayrollTransactionForm({ transaction, onClose, onSave }: PayrollTransactionFormProps) {
  const [formData, setFormData] = useState<Partial<PayrollTransaction>>({
    employee_name: transaction?.employee_name || "",
    pay_period_start: transaction?.pay_period_start || "",
    pay_period_end: transaction?.pay_period_end || "",
    pay_date: transaction?.pay_date || "",
    payroll_provider: transaction?.payroll_provider || "",
    provider_transaction_id: transaction?.provider_transaction_id || "",
    status: transaction?.status || "draft",
  })

  const [lineItems, setLineItems] = useState<Partial<PayrollLineItem>[]>([
    {
      line_item_type: "regular_wages",
      line_item_description: "Regular Wages",
      line_item_amount: 0,
      item_category: "earning",
    },
  ])

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        line_item_type: "",
        line_item_description: "",
        line_item_amount: 0,
        item_category: "earning",
      },
    ])
  }

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index))
  }

  const updateLineItem = (index: number, field: string, value: any) => {
    const updated = [...lineItems]
    updated[index] = { ...updated[index], [field]: value }
    setLineItems(updated)
  }

  const calculateTotals = () => {
    const earnings = lineItems
      .filter((item) => item.item_category === "earning")
      .reduce((sum, item) => sum + (item.line_item_amount || 0), 0)
    const deductions = lineItems
      .filter((item) => item.item_category === "deduction")
      .reduce((sum, item) => sum + (item.line_item_amount || 0), 0)
    const taxes = lineItems
      .filter((item) => item.item_category === "tax")
      .reduce((sum, item) => sum + (item.line_item_amount || 0), 0)
    const employerCosts = lineItems
      .filter((item) => item.item_category === "employer_cost")
      .reduce((sum, item) => sum + (item.line_item_amount || 0), 0)

    return {
      gross_pay: earnings,
      total_deductions: deductions,
      total_taxes: taxes,
      total_employer_costs: employerCosts,
      net_pay: earnings - deductions - taxes,
    }
  }

  const totals = calculateTotals()

  const handleSave = () => {
    const transactionData: PayrollTransaction = {
      ...formData,
      ...totals,
      transaction_id: transaction?.transaction_id || crypto.randomUUID(),
      client_id: "client-1", // This should come from context
      employee_id: "emp-1", // This should be selected
      created_at: transaction?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as PayrollTransaction

    onSave(transactionData)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{transaction ? "Edit Payroll Transaction" : "New Payroll Transaction"}</DialogTitle>
          <DialogDescription>Enter payroll transaction details and line items</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="lineitems">Line Items</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee_name">Employee Name</Label>
                <Input
                  id="employee_name"
                  value={formData.employee_name}
                  onChange={(e) => setFormData({ ...formData, employee_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payroll_provider">Payroll Provider</Label>
                <Select
                  value={formData.payroll_provider}
                  onValueChange={(value) => setFormData({ ...formData, payroll_provider: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADP">ADP</SelectItem>
                    <SelectItem value="Paychex">Paychex</SelectItem>
                    <SelectItem value="QuickBooks">QuickBooks Payroll</SelectItem>
                    <SelectItem value="Gusto">Gusto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pay_period_start">Pay Period Start</Label>
                <Input
                  id="pay_period_start"
                  type="date"
                  value={formData.pay_period_start}
                  onChange={(e) => setFormData({ ...formData, pay_period_start: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pay_period_end">Pay Period End</Label>
                <Input
                  id="pay_period_end"
                  type="date"
                  value={formData.pay_period_end}
                  onChange={(e) => setFormData({ ...formData, pay_period_end: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pay_date">Pay Date</Label>
                <Input
                  id="pay_date"
                  type="date"
                  value={formData.pay_date}
                  onChange={(e) => setFormData({ ...formData, pay_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider_transaction_id">Provider Transaction ID</Label>
                <Input
                  id="provider_transaction_id"
                  value={formData.provider_transaction_id}
                  onChange={(e) => setFormData({ ...formData, provider_transaction_id: e.target.value })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lineitems" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Line Items</h3>
              <Button onClick={addLineItem} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Line Item
              </Button>
            </div>

            <div className="space-y-4">
              {lineItems.map((item, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-2">
                        <Label>Category</Label>
                        <Select
                          value={item.item_category}
                          onValueChange={(value) => updateLineItem(index, "item_category", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="earning">Earning</SelectItem>
                            <SelectItem value="deduction">Deduction</SelectItem>
                            <SelectItem value="tax">Tax</SelectItem>
                            <SelectItem value="employer_cost">Employer Cost</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label>Type</Label>
                        <Input
                          value={item.line_item_type}
                          onChange={(e) => updateLineItem(index, "line_item_type", e.target.value)}
                          placeholder="e.g., regular_wages"
                        />
                      </div>
                      <div className="col-span-4">
                        <Label>Description</Label>
                        <Input
                          value={item.line_item_description}
                          onChange={(e) => updateLineItem(index, "line_item_description", e.target.value)}
                          placeholder="Description"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Amount</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.line_item_amount}
                          onChange={(e) =>
                            updateLineItem(index, "line_item_amount", Number.parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeLineItem(index)}
                          disabled={lineItems.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Gross Pay</Label>
                    <div className="text-2xl font-bold text-green-600">${totals.gross_pay.toFixed(2)}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Net Pay</Label>
                    <div className="text-2xl font-bold">${totals.net_pay.toFixed(2)}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Total Deductions</Label>
                    <div className="text-lg font-medium text-red-600">${totals.total_deductions.toFixed(2)}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Total Taxes</Label>
                    <div className="text-lg font-medium text-red-600">${totals.total_taxes.toFixed(2)}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Employer Costs</Label>
                    <div className="text-lg font-medium text-blue-600">${totals.total_employer_costs.toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Transaction</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
