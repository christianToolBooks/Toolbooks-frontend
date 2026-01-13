"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import {
  FileText,
  ListChecks,
  Repeat,
  Palette,
  Mail,
  CheckCircle,
  XCircle,
} from "lucide-react"
import type { InvoicingSettings } from "@/src/types/questionnaire"

interface InvoicingSettingsProps {
  invoicingModuleSettings?: InvoicingSettings | null
}

export function InvoicingModuleSettingsCard({ invoicingModuleSettings }: InvoicingSettingsProps) {
  const data = invoicingModuleSettings

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Invoicing Module
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No invoicing settings available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Invoicing Module
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">

        <div className="space-y-1">
          <p className="text-sm font-medium">Invoice Creation Method</p>
          <Badge variant="secondary">
            {data.creation_tracking_method?.replace(/_/g, " ")}
          </Badge>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium">Customer List Format</p>
          <div className="flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-blue-600" />
            <Badge variant="outline">{data.customer_list_format}</Badge>
          </div>
        </div>

        <div className="border-b border-muted" />

        <div className="space-y-1">
          <p className="text-sm font-medium">Invoice Frequency</p>
          <div className="flex items-center gap-2">
            <Repeat className="w-4 h-4 text-green-600" />
            <Badge variant="outline">
              {data.invoice_frequency?.replace(/_/g, " ")}
            </Badge>
          </div>
        </div>

        <div className="border-b border-muted" />

        <div className="space-y-1">
          <p className="text-sm font-medium">Customizations Applied</p>

          <div className="flex items-center gap-2">
            {data.customizations_applied ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
            <span>
              {data.customizations_applied ? "Enabled" : "Not applied"}
            </span>
          </div>

          {data.customizations_applied && data.customization_specify && (
            <p className="text-sm text-muted-foreground mt-1">
              {data.customization_specify}
            </p>
          )}
        </div>

        <div className="border-b border-muted" />

        <div className="space-y-1">
          <p className="text-sm font-medium">Delivery Method</p>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-purple-600" />
            <Badge variant="secondary">
              {data.delivery_method?.replace(/_/g, " ")}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
