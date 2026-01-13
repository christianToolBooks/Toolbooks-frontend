"use client";

import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Label } from "@/src/components/ui/label";
import { FormField } from "./form-field";
import { cn } from "@/src/lib/utils/utils";

interface RadioOption {
  value: string;
  label: string;
}

interface FormRadioGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  required?: boolean;
  error?: string;
  className?: string;
  description?: string;
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
  autoFilled?: boolean;
}

export function FormRadioGroup({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  error,
  className,
  description,
  orientation = "vertical",
  disabled,
  autoFilled,
}: FormRadioGroupProps) {
  const hasError = !!error;
  const errId = hasError ? `${name}__error` : undefined;

  return (
    <FormField
      label={label}
      required={required}
      error={error}
      className={className}
      description={description}
    >
      <RadioGroup
        value={value}
        onValueChange={onChange}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={errId}
        className={cn(
          "gap-4",
          orientation === "horizontal" && "flex flex-row",
          orientation === "vertical" && "flex flex-col",
        )}
      >
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          return (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={id}
                disabled={disabled}
                className={cn(
                  autoFilled ? "bg-input" : "bg-white",
                  "border-border focus:ring-primary focus:ring-2 focus:ring-offset-0",
                  hasError && "border-destructive focus:border-destructive focus:ring-destructive",
                )}
              />
              <Label
                htmlFor={id}
                className="text-sm font-medium cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </FormField>
  );
}
