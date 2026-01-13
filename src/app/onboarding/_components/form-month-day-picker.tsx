"use client"

import { useState } from "react"
import { Calendar } from "@/src/components/ui/calendar"
import { Input } from "@/src/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { Button } from "@/src/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/src/lib/utils/utils"

interface FormMonthDayCalendarPickerProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  description?: string
  error?: string
  disabled?: boolean
  autoFilled?: boolean
}

function formatMonthDay(month: number, day: number): string {
  return `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

function parseMonthDay(value: string): { month: number; day: number } | null {
  if (!value) return null
  const [mm, dd] = value.split("-")
  const m = Number(mm), d = Number(dd)
  if (!mm || !dd || Number.isNaN(m) || Number.isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) return null
  return { month: m, day: d }
}

export function FormMonthDayCalendarPicker({
  label, name, value, onChange, placeholder = "MM-DD", description, error, disabled = false, autoFilled,
}: FormMonthDayCalendarPickerProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value || "")
  const currentYear = new Date().getFullYear()
  const parsed = parseMonthDay(value)
  const calendarDate = parsed ? new Date(currentYear, parsed.month - 1, parsed.day) : undefined

  const hasError = !!error
  const errId = hasError ? `${name}__error` : undefined

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium leading-none">
        {label}
      </label>

      <div className="relative">
        <Input
          id={name}
          value={value || inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => {
            const parsed = parseMonthDay(inputValue)
            if (parsed) onChange(formatMonthDay(parsed.month, parsed.day))
            else if (inputValue === "") onChange("")
            else setInputValue(value || "")
          }}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={errId}
          className={cn(
            autoFilled ? "bg-input" : "bg-white",
            "w-full pr-10 border-border focus:ring-primary focus:border-primary",
            hasError && "border-destructive focus:border-destructive focus:ring-destructive",
          )}
        />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              disabled={disabled}
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={calendarDate}
              onSelect={(d) => {
                if (d) {
                  const v = formatMonthDay(d.getMonth() + 1, d.getDate())
                  onChange(v)
                  setInputValue(v)
                }
                setOpen(false)
              }}
              captionLayout="dropdown"
              fromYear={currentYear}
              toYear={currentYear}
              disabled={disabled}
            />
          </PopoverContent>
        </Popover>
      </div>

      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {hasError && (
        <p id={errId} className="text-sm text-destructive" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  )
}
