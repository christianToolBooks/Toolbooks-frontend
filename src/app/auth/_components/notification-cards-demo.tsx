"use client"

import { useState } from "react"
import { SmsSubscriptionCard } from "./sms-subscription-card"
import { AlertPreferencesCard } from "./alert-preferences-card"

export function NotificationCardsDemo() {
  const [smsSubscribed, setSmsSubscribed] = useState(false)

  return (
    <div className="space-y-4">
      <SmsSubscriptionCard
        checked={smsSubscribed}
        onCheckedChange={(checked) => setSmsSubscribed(checked as boolean)}
      />
    </div>
  )
}
