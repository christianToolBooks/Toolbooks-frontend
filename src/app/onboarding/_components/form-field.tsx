"use client"

import { Label } from "@/src/components/ui/label"
import { cn } from "@/src/lib/utils/utils"
import type { ReactNode } from "react"

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  children: ReactNode
  className?: string
  description?: string
}

export function FormField({
  label,
  required = false,
  error,
  children,
  className,
  description,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-foreground flex items-center ">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {description && <p className="text-xs text-muted-foreground">{description}</p>}

      {children}

      {error && (
        <p className="text-xs text-destructive" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  )
}
