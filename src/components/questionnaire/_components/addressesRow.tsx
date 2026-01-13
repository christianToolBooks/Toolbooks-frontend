// AddressRow.tsx
"use client";
import {  UseFormSetValue } from "react-hook-form";
import type { Address } from "@/src/types/questionnaire";
import type { CreateGetStartedOnboardingInput as T } from "../schemas/schemas";
import { useAddressFormLogicToQuestionnaire } from "../_hooks/useAddressFormLogicToQuestionnaire";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "DC", name: "District of Columbia" },
];

type Props = {
  i: number;
  addr: Partial<Address>;
  onAddressChange: (i: number, field: keyof Address, v: string) => void;
  getFieldError: (p: string) => string | null;
  setValue: UseFormSetValue<T>;
  onRemoveAddress: (i: number) => void;
};

export function AddressRow({
  i,
  addr,
  onAddressChange,
  getFieldError,
  setValue,
  onRemoveAddress,
}: Props) {
  const { inputRef } = useAddressFormLogicToQuestionnaire({
    setValue,
    addressIndex: i,
    onError: (e) => console.error("Autocomplete error:", e),
  });

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemoveAddress(i)}
          aria-label="Remove address"
          className={`w-4 h-4 text-red-500 ${i.valueOf() === 0 ? "hidden" : ""}`}
        >
          <Trash2 />
        </Button>
      </div>
      <div className="space-y-2">
        <Label>Address Line 1 *</Label>
        <Input
          ref={inputRef}
          value={addr.line1 ?? ""}
          onChange={(e) => onAddressChange(i, "line1", e.target.value)}
          placeholder="Street address"
          required
          className={
            getFieldError(`businessAddress.${i}.line1`) ? "border-red-500" : ""
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Address Line 2</Label>
        <Input
          value={addr.line2 ?? ""}
          onChange={(e) => onAddressChange(i, "line2", e.target.value)}
          placeholder="Apartment, suite, etc."
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
          <Select
            value={addr.state ?? ""}
            onValueChange={(value) => onAddressChange(i, "state", value)}
          >
            <SelectTrigger
              className={
                getFieldError(`businessAddress.${i}.state`)
                  ? "border-red-500"
                  : ""
              }
            >
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((state) => (
                <SelectItem key={state.code} value={state.code}>
                  {state.code} - {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            onChange={(e) => {
              // Allow only numbers and hyphen, format as XXXXX or XXXXX-XXXX
              const value = e.target.value.replace(/[^\d-]/g, "");
              const parts = value.split("-");
              let formatted = parts[0].slice(0, 5);
              if (parts[1]) {
                formatted += "-" + parts[1].slice(0, 4);
              }
              onAddressChange(i, "zip_code", formatted);
            }}
            placeholder="12345 or 12345-6789"
            required
            maxLength={10}
            className={
              getFieldError(`businessAddress.${i}.zip_code`) ? "border-red-500" : ""
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
