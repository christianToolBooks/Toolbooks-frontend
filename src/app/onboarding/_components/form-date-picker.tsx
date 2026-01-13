"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Calendar } from "@/src/components/ui/calendar"
import { Input } from "@/src/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { cn } from "@/src/lib/utils/utils"

interface FormDatePickerProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  description?: string
  error?: string
  disabled?: boolean
  dateFormat?: string
  autoFilled?: boolean
  required?: boolean
}

function formatDate(date?: Date) {
  if (!date) return ""
  return date.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })
}

function parseDate(s: string): Date | undefined {
  if (!s) return undefined
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  const d = new Date(s)
  return isNaN(d.getTime()) ? undefined : d
}

function formatDateForForm(d: Date, fmt: string) {
  if (fmt === "yyyy-MM-dd") {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
  }
  return formatDate(d)
}

export function FormDatePicker({
  label, name, value, onChange, placeholder, description, error,
  disabled = false, dateFormat = "yyyy-MM-dd", autoFilled, required = false,
}: FormDatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const initial = parseDate(value)
  const [date, setDate] = React.useState<Date | undefined>(initial)
  const [month, setMonth] = React.useState<Date | undefined>(initial || new Date())
  const [displayValue, setDisplayValue] = React.useState(initial ? formatDate(initial) : value)

  const hasError = !!error
  const errId = hasError ? `${name}__error` : undefined

  React.useEffect(() => {
    const parsed = parseDate(value)
    if (parsed) {
      setDate(parsed)
      setMonth(parsed)
      setDisplayValue(formatDate(parsed))
    } else {
      setDate(undefined)
      setDisplayValue(value)
    }
  }, [value])

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium leading-none">
        {label}
      </label>

      <div className="relative">
        <Input
          id={name}
          name={name}
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={errId}
          className={cn(
            autoFilled ? "bg-input" : "bg-white",
            "w-full pr-10 border-border focus:ring-primary focus:border-primary",
            hasError && "border-destructive focus:border-destructive focus:ring-destructive",
          )}
          onChange={(e) => {
            const v = e.target.value
            setDisplayValue(v)
            const parsed = parseDate(v)
            if (parsed) {
              setDate(parsed)
              setMonth(parsed)
              onChange(formatDateForForm(parsed, dateFormat))
            } else if (v === "") {
              setDate(undefined)
              onChange("")
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" disabled={disabled} className="absolute top-1/2 right-2 size-6 -translate-y-1/2">
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10}>
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(d) => {
                setDate(d)
                setDisplayValue(formatDate(d))
                onChange(d ? formatDateForForm(d, dateFormat) : "")
                setOpen(false)
              }}
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
