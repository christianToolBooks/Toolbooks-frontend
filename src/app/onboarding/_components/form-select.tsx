"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { FormField } from "./form-field"
import { cn } from "@/src/lib/utils/utils"

interface SelectOption { value: string; label: string }

interface FormSelectProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  required?: boolean
  error?: string
  className?: string
  description?: string
  disabled?: boolean
  autoFilled?: boolean
}

export function FormSelect({
  label, name, value, onChange, options,
  placeholder = "Select an option",
  required = false, error, className, description, disabled,
  autoFilled,
}: FormSelectProps) {
  const hasError = !!error
  const errId = hasError ? `${name}__error` : undefined

  return (
    <FormField label={label} required={required} error={error} className={className} description={description}>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={name}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={errId}
          className={cn(
            autoFilled ? "bg-input" : "bg-white",
            "border-border focus:ring-primary focus:border-primary",
            hasError && "border-destructive focus:border-destructive focus:ring-destructive",
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  )
}
