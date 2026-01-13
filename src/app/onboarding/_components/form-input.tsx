"use client"

import { Input } from "@/src/components/ui/input"
import { FormField } from "./form-field"
import { cn } from "@/src/lib/utils/utils"

interface FormInputProps {
  label: string
  name: string
  value: string 
  onChange: (value: string) => void
  type?: "text" | "email" | "tel" | "url" | "number"
  placeholder?: string
  required?: boolean
  error?: string
  className?: string
  description?: string
  disabled?: boolean
  autofilled?: boolean
  min?: number
  max?: number
}

export function FormInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  error,
  className,
  description,
  disabled = false,
  autofilled,
  min,
  max,
}: FormInputProps) {
  const hasError = !!error
  const errId = hasError ? `${name}__error` : undefined

  return (
    <FormField label={label} required={required} error={error} className={className} description={description}>
      <Input
        id={name}
        name={name}
        type={type}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={errId}
        min={min}
        max={max}
        className={cn(
          autofilled ? "bg-input" : "bg-white",
          "border-border focus:ring-primary focus:border-primary",
          hasError && "border-destructive focus:border-destructive focus:ring-destructive",
        )}
      />
    </FormField>
  )
}
