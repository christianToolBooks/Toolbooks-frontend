"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import {
  Users,
  CalendarClock,
  DollarSign,
  FileCheck,
  ShieldCheck,
  CheckCircle,
  XCircle
} from "lucide-react"
import type { PayrollSettings } from "@/src/types/questionnaire"

interface PayrollSettingsProps {
  payrollModuleSettings?: PayrollSettings | null
}

export function PayrollSettingsCard({ payrollModuleSettings }: PayrollSettingsProps) {
  const data = payrollModuleSettings

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Payroll Module
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No payroll settings available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Payroll Module
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">

        <div className="space-y-1">
          <p className="text-sm font-medium">Employee List Format</p>
          <Badge variant="secondary">{data.employee_list_format}</Badge>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium">Employees</p>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm">{data.num_employees_band}</span>
          </div>
        </div>

        <div className="border-b border-muted" />

        <div className="space-y-1">
          <p className="text-sm font-medium">Pay Frequency</p>
          <div className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-blue-600" />
            <Badge variant="outline">
              {data.pay_frequency?.replace(/_/g, " ")}
            </Badge>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium">Salary Type</p>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <Badge variant="outline">{data.salary_type}</Badge>
          </div>
        </div>

        <div className="border-b border-muted" />

        <div className="space-y-1">
          <p className="text-sm font-medium">Benefits / Deductions</p>
          <div className="flex items-center gap-2">
            {data.benefits_or_deductions ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
            <span>
              {data.benefits_or_deductions ? "Included" : "Not included"}
            </span>
          </div>

          {data.benefits_or_deductions && data.benefits_specify && (
            <p className="text-sm text-muted-foreground">
              {data.benefits_specify}
            </p>
          )}
        </div>

        <div className="border-b border-muted" />

        <div className="space-y-1">
          <p className="text-sm font-medium">Tax Compliance Support</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <Badge variant="secondary">
              {data.tax_compliance_support?.replace(/_/g, " ")}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
