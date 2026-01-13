"use client"

import { Progress } from "@/src/components/ui/progress"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="mb-8">
      <Progress value={progress} className="h-3 mb-2" />
      <p className="text-right text-sm text-muted-foreground">
        Step {currentStep + 1} of {totalSteps}
      </p>
    </div>
  )
}
