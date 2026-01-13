"use client"

import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { AccountingBasisEnum, AvgAnnualRevenueBracket, BusinessProfileResponse, FinancialObjective, LifeCyclePhase, OnboardingFinancialOverview, SalesRevenueType } from "@/src/types/questionnaire"
import { DollarSign, Save } from "lucide-react"
import { useState } from "react"


interface FinancialOverviewProps {
  financialOverview?: BusinessProfileResponse["financialOverview"];
  isEditing?: boolean
  onSave?: (data: BusinessProfileResponse["financialOverview"]) => Promise<void>
}

export function FinancialOverview({
  financialOverview,
  isEditing = false,
  onSave
}: FinancialOverviewProps) {
  const [editData, setEditData] = useState<BusinessProfileResponse["financialOverview"]>({
    id: financialOverview?.id,
    createdAt: financialOverview?.createdAt,
    updatedAt: financialOverview?.updatedAt,
    business_profile_id: financialOverview?.business_profile_id,
    avg_monthly_expenses: financialOverview?.avg_monthly_expenses ?? 0,
    sales_revenue_type: financialOverview?.sales_revenue_type,
    avg_annual_revenue_bracket: financialOverview?.avg_annual_revenue_bracket,
    life_cycle_phase: financialOverview?.life_cycle_phase,
    accounting_basis: financialOverview?.accounting_basis,
    objectives: financialOverview?.objectives ?? [],
    objective_other_text: financialOverview?.objective_other_text ?? "",
    business_challenges: financialOverview?.business_challenges ?? ""
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (
    field: keyof OnboardingFinancialOverview,
    value: string | number | string[] | FinancialObjective[]
  ) => {
    setEditData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value
      } as OnboardingFinancialOverview;
    })
  }

  const toggleObjective = (objective: FinancialObjective) => {
    setEditData(prev => {
      if (!prev) return prev;
      const exists = prev.objectives?.includes(objective);
      return {
        ...prev,
        objectives: exists
          ? prev.objectives?.filter(o => o !== objective)
          : [...(prev.objectives ?? []), objective]
      } as OnboardingFinancialOverview;
    });
  }

  const handleSave = async () => {
    if (!onSave) return
    setIsSaving(true)
    try {
      await onSave(editData)
    } finally {
      setIsSaving(false)
    }
  }

  if (!financialOverview) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No financial data available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Financial Overview
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        
        {isEditing ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Monthly Expenses</Label>
              <Input
                type="number"
                value={editData?.avg_monthly_expenses}
                onChange={(e) =>
                  handleChange(
                    "avg_monthly_expenses",
                    Number(e.target.value) || 0
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Revenue Type</Label>
              <Input
                value={editData?.sales_revenue_type ?? ""}
                onChange={(e) =>
                  handleChange("sales_revenue_type", e.target.value as SalesRevenueType)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Annual Revenue Bracket</Label>
              <Input
                value={editData?.avg_annual_revenue_bracket ?? ""}
                onChange={(e) =>
                  handleChange(
                    "avg_annual_revenue_bracket",
                    e.target.value as AvgAnnualRevenueBracket
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Lifecycle Phase</Label>
              <Input
                value={editData?.life_cycle_phase ?? ""}
                onChange={(e) =>
                  handleChange("life_cycle_phase", e.target.value as LifeCyclePhase)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Accounting Basis</Label>
              <Input
                value={editData?.accounting_basis ?? ""}
                onChange={(e) =>
                  handleChange("accounting_basis", e.target.value as AccountingBasisEnum)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Objectives</Label>

              <div className="flex flex-wrap gap-2">
                {(["clarity", "compliance", "decision", "efficiency", "growth"] as FinancialObjective[])
                  .map(obj => (
                    <Badge
                      key={obj}
                      variant={
                        editData?.objectives?.includes(obj)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleObjective(obj)}
                    >
                      {obj}
                    </Badge>
                  ))}
              </div>

              <Input
                placeholder="Other objective"
                value={editData?.objective_other_text}
                onChange={e =>
                  handleChange("objective_other_text", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Business Challenges</Label>
              <Input
                value={editData?.business_challenges ?? ""}
                onChange={(e) =>
                  handleChange("business_challenges", e.target.value)
                }
              />
            </div>

            <Button className="w-full" disabled={isSaving} onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        ) : (
          <>
            <div>
              <h4 className="font-medium">Monthly Expenses</h4>
              <p className="text-xl font-semibold">
                ${financialOverview.avg_monthly_expenses?.toLocaleString()}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Revenue</h4>
              <Badge variant="outline">
                Type: {financialOverview.sales_revenue_type}
              </Badge>
              <Badge variant="outline">
                Annual: {financialOverview.avg_annual_revenue_bracket}
              </Badge>
            </div>

            <div>
              <h4 className="font-medium">Lifecycle Phase</h4>
              <Badge>{financialOverview.life_cycle_phase}</Badge>
            </div>

            <div>
              <h4 className="font-medium">Accounting Basis</h4>
              <Badge variant="outline">{financialOverview.accounting_basis}</Badge>
            </div>

            <div>
              <h4 className="font-medium">Objectives</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {financialOverview.objectives?.map(obj => (
                  <Badge key={obj} variant="secondary">
                    {obj}
                  </Badge>
                ))}
              </div>

              {financialOverview.objective_other_text && (
                <p className="text-sm text-muted-foreground mt-1">
                  Other: {financialOverview.objective_other_text}
                </p>
              )}
            </div>

            {financialOverview.business_challenges && (
              <div>
                <h4 className="font-medium">Business Challenges</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {financialOverview.business_challenges}
                </p>
              </div>
            )}
          </>
        )}

      </CardContent>
    </Card>
  )
}
