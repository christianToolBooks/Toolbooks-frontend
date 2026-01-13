"use client"

import { Checkbox } from "@/src/components/ui/checkbox"
import { FormField } from "./form-field"
import { cn } from "@/src/lib/utils/utils"

interface CheckboxOption { value: string; label: string }

interface FormCheckboxGroupProps {
  label: string
  name: string
  value: string[]
  onChange: (value: string[]) => void
  options: CheckboxOption[]
  required?: boolean
  error?: string
  className?: string
  description?: string
  columns?: 1 | 2 | 3
  disabled?: boolean
  autoFilled?: boolean
}

export function FormCheckboxGroup({
  label, name, value, onChange, options,
  required = false, error, className, description, columns = 2, disabled,
  autoFilled,
}: FormCheckboxGroupProps) {
  const hasError = !!error
  const errId = hasError ? `${name}__error` : undefined

  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    onChange(checked ? [...value, optionValue] : value.filter((v) => v !== optionValue))
  }

  return (
    <FormField label={label} required={required} error={error} className={className} description={description}>
      <div
        role="group"
        aria-describedby={errId}
        className={cn(
          "gap-4",
          columns === 1 && "grid grid-cols-1",
          columns === 2 && "grid grid-cols-2",
          columns === 3 && "grid grid-cols-3",
        )}
      >
        {options.map((option) => {
          const id = `${name}-${option.value}`
          return (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={id}
                checked={value.includes(option.value)}
                onCheckedChange={(checked) => handleCheckboxChange(option.value, !!checked)}
                className={cn(
                  autoFilled ? "bg-input" : "bg-white",
                  "border-border focus:ring-primary focus:ring-2 focus:ring-offset-0",
                  hasError && "border-destructive focus:border-destructive focus:ring-destructive",
                )}
                disabled={disabled}
              />
              <label htmlFor={id} className="text-sm font-medium leading-none cursor-pointer">
                {option.label}
              </label>
            </div>
          )
        })}
      </div>
    </FormField>
  )
}
