"use client"

import { Textarea } from "@/src/components/ui/textarea"
import { FormField } from "./form-field"
import { cn } from "@/src/lib/utils/utils"

interface FormTextareaProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  error?: string
  className?: string
  description?: string
  rows?: number
  disabled?: boolean
  autofilled?: boolean
}

export function FormTextarea({
  label, name, value, onChange, placeholder,
  required = false, error, className, description, rows = 3, disabled, autofilled
}: FormTextareaProps) {
  const hasError = !!error
  const errId = hasError ? `${name}__error` : undefined

  return (
    <FormField label={label} required={required} error={error} className={className} description={description}>
      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={errId}
        className={cn(
          autofilled ? "bg-input" : "bg-white",
          "border-border focus:ring-primary focus:border-primary",
          hasError && "border-destructive focus:border-destructive focus:ring-destructive",
        )}
      />
    </FormField>
  )
}
