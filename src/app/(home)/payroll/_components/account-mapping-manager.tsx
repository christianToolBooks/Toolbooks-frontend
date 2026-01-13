/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Save } from "lucide-react"
import { AccountMapping } from "../types/payroll"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"

export function AccountMappingManager() {
  const [mappings, setMappings] = useState<AccountMapping[]>([
    {
      mapping_id: "1",
      client_id: "client-1",
      item_category: "regular_wages",
      item_type: "earning",
      gl_account_number: "6000",
      gl_account_name: "Wages & Salaries",
      is_active: true,
    },
    {
      mapping_id: "2",
      client_id: "client-1",
      item_category: "federal_income_tax",
      item_type: "tax",
      gl_account_number: "2200",
      gl_account_name: "Federal Income Tax Payable",
      is_active: true,
    },
  ])

  const [editingMapping, setEditingMapping] = useState<AccountMapping | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const defaultMappings = {
    earnings: [
      { category: "regular_wages", account: "6000", name: "Wages & Salaries" },
      { category: "overtime_wages", account: "6005", name: "Overtime Wages" },
      { category: "bonus", account: "6010", name: "Bonuses" },
      { category: "commission", account: "6015", name: "Commissions" },
      { category: "holiday_pay", account: "6020", name: "Holiday Pay" },
      { category: "sick_pay", account: "6025", name: "Sick Pay" },
      { category: "vacation_pay", account: "6030", name: "Vacation Pay" },
    ],
    deductions: [
      { category: "health_insurance", account: "2100", name: "Health Insurance Payable" },
      { category: "dental_insurance", account: "2105", name: "Dental Insurance Payable" },
      { category: "vision_insurance", account: "2110", name: "Vision Insurance Payable" },
      { category: "life_insurance", account: "2115", name: "Life Insurance Payable" },
      { category: "retirement_401k", account: "2120", name: "401k Contributions Payable" },
      { category: "parking", account: "2125", name: "Parking Deductions Payable" },
      { category: "union_dues", account: "2130", name: "Union Dues Payable" },
    ],
    taxes: [
      { category: "federal_income_tax", account: "2200", name: "Federal Income Tax Payable" },
      { category: "state_income_tax", account: "2205", name: "State Income Tax Payable" },
      { category: "fica_employee", account: "2210", name: "FICA Employee Payable" },
      { category: "medicare_employee", account: "2215", name: "Medicare Employee Payable" },
      { category: "state_disability", account: "2220", name: "State Disability Payable" },
    ],
    employer_costs: [
      { category: "fica_employer", account: "6200", name: "FICA Employer Expense" },
      { category: "medicare_employer", account: "6205", name: "Medicare Employer Expense" },
      { category: "futa", account: "6210", name: "FUTA Expense" },
      { category: "suta", account: "6215", name: "SUTA Expense" },
      { category: "workers_comp", account: "6220", name: "Workers Compensation" },
      { category: "health_insurance_employer", account: "6225", name: "Health Insurance Employer Portion" },
      { category: "retirement_match", account: "6230", name: "401k Employer Match" },
    ],
  }

  const AddMappingForm = ({
    onSave,
    onCancel,
  }: { onSave: (mapping: AccountMapping) => void; onCancel: () => void }) => {
    const [formData, setFormData] = useState({
      item_category: "",
      item_type: "earning" as const,
      gl_account_number: "",
      gl_account_name: "",
    })

    const handleSave = () => {
      const newMapping: AccountMapping = {
        mapping_id: crypto.randomUUID(),
        client_id: "client-1",
        ...formData,
        is_active: true,
      }
      onSave(newMapping)
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Add New Mapping</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Item Type</Label>
              <Select
                value={formData.item_type}
                onValueChange={(value: any) => setFormData({ ...formData, item_type: value })}
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
            <div className="space-y-2">
              <Label>Item Category</Label>
              <Input
                value={formData.item_category}
                onChange={(e) => setFormData({ ...formData, item_category: e.target.value })}
                placeholder="e.g., regular_wages"
              />
            </div>
            <div className="space-y-2">
              <Label>GL Account Number</Label>
              <Input
                value={formData.gl_account_number}
                onChange={(e) => setFormData({ ...formData, gl_account_number: e.target.value })}
                placeholder="e.g., 6000"
              />
            </div>
            <div className="space-y-2">
              <Label>GL Account Name</Label>
              <Input
                value={formData.gl_account_name}
                onChange={(e) => setFormData({ ...formData, gl_account_name: e.target.value })}
                placeholder="e.g., Wages & Salaries"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Mapping
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Account Mapping Configuration</h3>
          <p className="text-sm text-muted-foreground">Configure how payroll items map to your chart of accounts</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Mapping
        </Button>
      </div>

      {showAddForm && (
        <AddMappingForm
          onSave={(mapping) => {
            setMappings([...mappings, mapping])
            setShowAddForm(false)
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Current Mappings</TabsTrigger>
          <TabsTrigger value="templates">Default Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle>Active Mappings</CardTitle>
              <CardDescription>Current account mappings for this client</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Category</TableHead>
                    <TableHead>Item Type</TableHead>
                    <TableHead>GL Account</TableHead>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappings.map((mapping) => (
                    <TableRow key={mapping.mapping_id}>
                      <TableCell className="font-medium">{mapping.item_category}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{mapping.item_type}</Badge>
                      </TableCell>
                      <TableCell>{mapping.gl_account_number}</TableCell>
                      <TableCell>{mapping.gl_account_name}</TableCell>
                      <TableCell>
                        <Badge variant={mapping.is_active ? "default" : "secondary"}>
                          {mapping.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => setEditingMapping(mapping)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setMappings(mappings.filter((m) => m.mapping_id !== mapping.mapping_id))
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid gap-6">
            {Object.entries(defaultMappings).map(([type, items]) => (
              <Card key={type}>
                <CardHeader>
                  <CardTitle className="capitalize">{type.replace("_", " ")}</CardTitle>
                  <CardDescription>Standard mappings for {type.replace("_", " ")} items</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Account Number</TableHead>
                        <TableHead>Account Name</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.category}>
                          <TableCell className="font-medium">{item.category}</TableCell>
                          <TableCell>{item.account}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newMapping: AccountMapping = {
                                  mapping_id: crypto.randomUUID(),
                                  client_id: "client-1",
                                  item_category: item.category,
                                  item_type: type.slice(0, -1) as any, // Remove 's' from plural
                                  gl_account_number: item.account,
                                  gl_account_name: item.name,
                                  is_active: true,
                                }
                                setMappings([...mappings, newMapping])
                              }}
                            >
                              Add to Client
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
