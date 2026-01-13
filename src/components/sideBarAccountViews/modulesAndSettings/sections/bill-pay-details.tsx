"use client"

import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { BillPaySettings } from "@/src/types/questionnaire"
import { Package, AlertTriangle, CheckCircle } from "lucide-react"



interface BillsDetailsProps {
  billPayModuleSettings?: BillPaySettings
}

export function BillsDetails({ billPayModuleSettings }: BillsDetailsProps) {

  const settings = billPayModuleSettings

  const getBooleanIcon = (value?: boolean) =>
    value ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <AlertTriangle className="w-4 h-4 text-yellow-500" />
    )

  if (!settings) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Bill Pay Module
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No settings available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full ">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Bill Pay Module
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        <div className="space-y-1">
          <p className="text-sm font-medium">Vendor List Format</p>
          <Badge variant="outline">{settings.vendor_list_format}</Badge>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium">Bill Reception Channels</p>
          <div className="flex flex-wrap gap-2">
            {settings.bill_reception_channels?.map((channel) => (
              <Badge key={channel} variant="secondary">
                {channel.replace(/_/g, " ")}
              </Badge>
            ))}
          </div>
        </div>
<div className="border-b border-muted" />
        <div className="flex items-center gap-2">
          {getBooleanIcon(settings.scan_extract_auto)}
          <span className="font-medium">
            Scan & Extract Auto: {settings.scan_extract_auto ? "Enabled" : "Disabled"}
          </span>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium">Payment Frequency</p>
          <Badge variant="outline">{settings.payment_frequency}</Badge>
        </div>
<div className="border-b border-muted" />
        <div className="space-y-1">
          <p className="text-sm font-medium">Approval Workflow</p>
          <div className="flex items-center gap-2">
            {getBooleanIcon(settings.approval_workflow)}
            <span>{settings.approval_workflow ? "Active" : "Inactive"}</span>
          </div>

          {settings.approval_workflow && (
            <p className="text-sm text-muted-foreground">
              {settings.approval_specify}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium">Aging Tracking</p>
          <Badge>{settings.aging_tracking}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
