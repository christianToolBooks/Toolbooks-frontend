"use client"

import { Check } from "lucide-react"
import { getStepIndex, ONBOARDING_STEPS } from "../_utils/onboarding-config"
import { cn } from "@/src/lib/utils/utils"
import { OnboardingStep } from "@/src/types/questionnaire"

interface StepIndicatorProps {
  currentStep: OnboardingStep
  completedSteps: OnboardingStep[]
  onStepClick?: (step: OnboardingStep) => void
}

export function StepIndicator({ currentStep, completedSteps, onStepClick }: StepIndicatorProps) {
  const currentStepIndex = getStepIndex(currentStep)

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {ONBOARDING_STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id)
          const isCurrent = step.id === currentStep
          const isClickable = onStepClick && (isCompleted || index <= currentStepIndex)

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                  isCompleted && "bg-primary border-primary text-primary-foreground",
                  isCurrent && !isCompleted && "border-primary bg-background text-primary",
                  !isCurrent && !isCompleted && "border-muted-foreground bg-background text-muted-foreground",
                  isClickable && "cursor-pointer hover:scale-105",
                )}
                onClick={() => isClickable && onStepClick(step.id)}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="ml-3 hidden md:block">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isCurrent && "text-primary",
                    isCompleted && "text-foreground",
                    !isCurrent && !isCompleted && "text-muted-foreground",
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground max-w-32">{step.description}</p>
              </div>

              {/* Connector Line */}
              {index < ONBOARDING_STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-colors duration-200",
                    index < currentStepIndex || isCompleted ? "bg-primary" : "bg-muted",
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile Step Labels */}
      <div className="md:hidden mt-4 text-center">
        <p className="text-sm font-medium text-primary">{ONBOARDING_STEPS[currentStepIndex].title}</p>
        <p className="text-xs text-muted-foreground">
          Step {currentStepIndex + 1} of {ONBOARDING_STEPS.length}
        </p>
      </div>
    </div>
  )
}
