// AddressRow.tsx
"use client";
import { UseFormSetValue } from "react-hook-form";
import type { Address } from "@/src/types/questionnaire";
import type { CustomerFormToPaymentInput as T } from "../../schemas/schemas";
import { useAddressFormLogicToPay } from "../../_hooks/useAddressFormLogicToPay";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { CreateCustomerToPay } from "@/src/types/paymentMethods";

type Props = {
  i: number;
  addr: Partial<CreateCustomerToPay>;
  onAddressChange: (i: number, field: keyof CreateCustomerToPay, v: string) => void;
  getFieldError: (p: string) => string | null;
  setValue: UseFormSetValue<T>;
};

export function CustomerAddressToPay({
  addr,
  onAddressChange,
  getFieldError,
  setValue,
  i,
}: Props) {
  const { inputRef } = useAddressFormLogicToPay({
    setValue,
    onError: (e) => console.error("Autocomplete error:", e),
  });

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="space-y-2">
        <Label>Address Line 1 *</Label>
        <Input
          ref={inputRef}
          value={addr.address_line_1 ?? ""}
          onChange={(e) => onAddressChange(i, "address_line_1", e.target.value)}
          placeholder="Street address"
          required
          className={
            getFieldError(`businessAddress.${i}.line1`) ? "border-red-500" : ""
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>City *</Label>
          <Input
            value={addr.city ?? ""}
            onChange={(e) => onAddressChange(i, "city", e.target.value)}
            placeholder="City"
            required
            className={
              getFieldError(`businessAddress.${i}.city`) ? "border-red-500" : ""
            }
          />
          {getFieldError(`businessAddress.${i}.city`) && (
            <p className="text-sm text-red-500">
              {getFieldError(`businessAddress.${i}.city`)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>State *</Label>
          <Input
            value={addr.state ?? ""}
            onChange={(e) => onAddressChange(i, "state", e.target.value)}
            placeholder="State"
            required
            className={
              getFieldError(`businessAddress.${i}.state`)
                ? "border-red-500"
                : ""
            }
          />
          {getFieldError(`businessAddress.${i}.state`) && (
            <p className="text-sm text-red-500">
              {getFieldError(`businessAddress.${i}.state`)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>ZIP Code *</Label>
          <Input
            value={addr.zip_code ?? ""}
            onChange={(e) => onAddressChange(i, "zip_code", e.target.value)}
            placeholder="12345"
            required
            className={
              getFieldError(`businessAddress.${i}.zip_code`)
                ? "border-red-500"
                : ""
            }
          />
          {getFieldError(`businessAddress.${i}.zip`) && (
            <p className="text-sm text-red-500">
              {getFieldError(`businessAddress.${i}.zip`)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
