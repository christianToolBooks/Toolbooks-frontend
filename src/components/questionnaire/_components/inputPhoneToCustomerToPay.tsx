// components/PhoneField.tsx
"use client";

import type { CustomerFormToPaymentInput as T } from "../schemas/schemas";
import {
  FieldPath,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { usePhoneNumberInput } from "@/src/hooks/usePhonNumberInput";

type Props = {
  name: FieldPath<T>;
  label: string;
  required?: boolean;
  register: UseFormRegister<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  errorMsg?: string | null;
  placeholder?: string;
};

export function PhoneFieldToCustomerToPay({
  name,
  label,
  required,
  register,
  watch,
  setValue,
  errorMsg,
  placeholder = "+1 (555) 000-0000",
}: Props) {
  const phoneProps = usePhoneNumberInput<T>({
    name,
    setValue,
    watch,
    registerReturn: register(name, {
      validate: {
        e164Like: (val) => {
          const cleaned = String(val ?? "").replace(/\D/g, "");
          if (!required && cleaned.length === 0) return true; 
          return cleaned.length >= 11 || "Must include country code (+1) and 10 digits";
        },
      },
    }),
  });

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label} {required ? "*" : null}
      </Label>
      <Input id={name} type="tel" placeholder={placeholder} {...phoneProps} />
      {errorMsg && <p className="mt-1 text-xs text-red-600">{errorMsg}</p>}
    </div>
  );
}
