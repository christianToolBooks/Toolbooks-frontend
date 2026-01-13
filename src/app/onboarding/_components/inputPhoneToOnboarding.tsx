// components/PhoneUSField.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils/utils";

type Props = {
  label: string;
  valueE164: string | null | undefined;
  onChangeE164: (v: string) => void;
  required?: boolean;
  disabled?: boolean;
  errorMsg?: string;
  placeholder?: string;
  name?: string;
  autoFilled?: boolean;
};

function formatUSFromDigits(d: string): string {
  if (!d) return "";
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  let out = "+1";
  if (a) out += ` (${a}${a.length === 3 ? ")" : ""}`;
  if (b) out += `${a ? " " : " "} ${b}`;
  if (c) out += `-${c}`;
  return out.trim();
}

function e164FromLocalDigits(d: string): string {
  if (!d) return "";
  return `+1${d.slice(0, 10)}`;
}

function localDigitsFromE164(e164?: string | null): string {
  if (!e164) return "";
  const digits = String(e164).replace(/\D/g, "");
  const local = digits.startsWith("1") ? digits.slice(1) : digits;
  return local.slice(0, 10);
}

export function PhoneUSField({
  label,
  valueE164,
  onChangeE164,
  required,
  disabled,
  errorMsg,
  placeholder = "+1 (555) 000-0000",
  name = "phone_number",
  autoFilled = false,
}: Props) {
  const [digits, setDigits] = useState<string>(localDigitsFromE164(valueE164));
  useEffect(() => setDigits(localDigitsFromE164(valueE164)), [valueE164]);
  const hasError = !!errorMsg;
  const errId = hasError ? `${name}__error` : undefined;
  const display = formatUSFromDigits(digits);
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label} {required ? <span className="text-destructive">*</span> : null}
      </Label>

      <Input
        id={name}
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder={placeholder}
        value={display}
        disabled={disabled}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={errId}
        className={cn(
          autoFilled ? "bg-input" : "bg-white",
          "border-border focus:ring-primary focus:border-primary",
          hasError &&
            "border-destructive focus:border-destructive focus:ring-destructive"
        )}
        onBeforeInput={(e: React.InputEvent<HTMLInputElement>) => {
          const data: string | null = e.data ?? null;
          if (data && /\D/.test(data)) {
            e.preventDefault();
          }
        }}
        onChange={(e) => {
          const onlyDigits = e.target.value
            .replace(/\D/g, "")
            .replace(/^1/, "");
          const nextLocal = onlyDigits.slice(0, 10);
          setDigits(nextLocal);
          onChangeE164(e164FromLocalDigits(nextLocal));
        }}
      />

      {hasError && (
        <p
          id={errId}
          className="text-xs text-destructive"
          role="alert"
          aria-live="polite"
        >
          {errorMsg}
        </p>
      )}
    </div>
  );
}
