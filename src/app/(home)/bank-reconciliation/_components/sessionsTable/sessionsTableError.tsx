"use client"

import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/src/components/ui/button"

interface SessionsTableErrorProps {
  onRetry?: () => void
}

export function SessionsTableError({ onRetry }: SessionsTableErrorProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>Failed to load reconciliation session</span>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
