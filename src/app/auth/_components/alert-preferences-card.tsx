"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card"
import { Checkbox } from "@/src/components/ui/checkbox"
import { Label } from "@/src/components/ui/label"
import { ChevronDown, ChevronUp } from "lucide-react"

interface AlertPreferencesCardProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}

export function AlertPreferencesCard({
  checked = false,
  onCheckedChange,
  disabled = false,
}: AlertPreferencesCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <Card className="w-full">
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="enable-alerts"
            checked={checked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            className="mt-0.5"
          />
          <div className="flex-1">
            <Label htmlFor="enable-alerts" className="text-sm font-normal leading-relaxed cursor-pointer">
               I agree to enable alerts.
            </Label>
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-primary hover:underline mt-1 flex items-center gap-1"
            >
              {showDetails ? (
                <>
                  See less <ChevronUp className="h-3 w-3" />
                </>
              ) : (
                <>
                  See more <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          </div>
        </div>

        {showDetails && (
          <>
            <p className="text-sm text-muted-foreground pl-7 leading-relaxed">
              I agree to receive notifications (by text message, email, or phone call) about:
            </p>

            <ul className="space-y-2 text-sm pl-7">
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>New Appointment Requests</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Manual Service Assignments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Profile Completion Requests</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Pending Payment Notifications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Payment Confirmations</span>
              </li>
            </ul>

            <div className="pt-2 text-xs text-muted-foreground leading-relaxed pl-7">
              <p>
                By selecting this option, I agree to receive recurring SMS messages, emails, and phone calls from
                ChargeHomeSolutions related to these alerts. Message and data rates may apply.
              </p>
              <p className="mt-2">Reply STOP to unsubscribe, HELP for help. Consent is not a condition of service.</p>
              <p className="mt-2">
                See our{" "}
                <a href="/terms" className="text-primary hover:underline font-medium">
                  Terms and Conditions
                </a>
                .
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
