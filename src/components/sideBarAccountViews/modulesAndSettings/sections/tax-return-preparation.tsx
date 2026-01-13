"use client"

import { Alert, AlertDescription } from "@/src/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { AlertCircle, Target } from "lucide-react"
import { TaxReturnPreparationApiResponse } from "@/src/types/questionnaire"


interface TaxReturnPreparationProps {
  taxReturnPreparation?: TaxReturnPreparationApiResponse;
}

export function TaxReturnPreparation({ taxReturnPreparation }: TaxReturnPreparationProps) {
  const t = taxReturnPreparation

  const nothingToShow =
    !t ||
    (!t.biz_tax_last_filed_year &&
      !t.biz_num_states_filed &&
      !t.business_form_filed &&
      (!t.biz_tax_states || t.biz_tax_states.length === 0) &&
      !t.ind_tax_last_filed_year &&
      !t.ind_num_states_filed &&
      (!t.ind_tax_states || t.ind_tax_states.length === 0))

  if (nothingToShow) return null

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Tax Return Overview
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        
        <div className="space-y-4">
          <h4 className="font-medium">Business Tax</h4>

          {t.biz_tax_last_filed_year ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Last Filed Year:</strong> {t.biz_tax_last_filed_year}
              </AlertDescription>
            </Alert>
          ) : (
            <p className="text-sm text-muted-foreground">No business tax filings recorded.</p>
          )}

          {t.business_form_filed && (
            <p className="text-sm">
              <strong>Business Form Filed:</strong> {t.business_form_filed}
            </p>
          )}

          {t.biz_num_states_filed !== null && (
            <p className="text-sm">
              <strong>States Filed:</strong> {t.biz_num_states_filed}
            </p>
          )}

          {t.biz_tax_states && t.biz_tax_states.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {t.biz_tax_states.map((state) => (
                <Badge variant="outline" key={state}>
                  {state}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Individual Tax</h4>

          {t.ind_tax_last_filed_year ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Last Filed Year:</strong> {t.ind_tax_last_filed_year}
              </AlertDescription>
            </Alert>
          ) : (
            <p className="text-sm text-muted-foreground">No individual tax filings recorded.</p>
          )}

          {t.ind_num_states_filed !== null && (
            <p className="text-sm">
              <strong>States Filed:</strong> {t.ind_num_states_filed}
            </p>
          )}

          {t.ind_tax_states && t.ind_tax_states.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {t.ind_tax_states.map((state) => (
                <Badge variant="secondary" key={state}>
                  {state}
                </Badge>
              ))}
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  )
}
