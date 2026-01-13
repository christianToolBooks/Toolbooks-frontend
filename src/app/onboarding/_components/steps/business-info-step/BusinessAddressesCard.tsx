"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { X, Plus } from "lucide-react";
import { FormInput } from "../../form-input";
import { FormSelect } from "../../form-select";
import type { OnboardingAddress } from "@/src/types/questionnaire";
import {
  normalizeUSState,
  US_STATES,
} from "../bookkeping-services-step/constants";

type Props = {
  addresses: OnboardingAddress[];
  onAddressChange: (index: number, data: Partial<OnboardingAddress>) => void;
  onAddAddress: () => void;
  onRemoveAddress: (index: number) => void;
  getFieldError?: (field: string) => string | undefined;
  disabled?: boolean;
};

export function BusinessAddressesCard({
  addresses,
  onAddressChange,
  onAddAddress,
  onRemoveAddress,
  getFieldError,
  disabled = false,
}: Props) {
  const isEmpty = !addresses || addresses.length === 0;

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-xl font-semibold text-foreground">
          Business Addresses
        </CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddAddress}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add address
        </Button>
      </CardHeader>

      <CardContent className="space-y-8">
        {isEmpty ? (
          <div className="text-sm text-muted-foreground">
            No addresses yet. Click <strong>Add address</strong> to create one.
          </div>
        ) : (
          addresses.map((addr, index) => (
            <div key={index} className="relative border rounded-lg p-6">
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveAddress(index)}
                  disabled={disabled}
                  className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-medium">
                  {index === 0 ? "Primary Address" : `Address #${index + 1}`}
                </h3>
                {index === 0 && (
                  <p className="text-xs text-muted-foreground">
                    This will be used as your default business address.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Address line 1"
                  name={`businessAddresses.${index}.line1`}
                  value={addr.line1 ?? ""}
                  onChange={(v) => onAddressChange(index, { line1: v })}
                  required={index === 0}
                  error={getFieldError?.(`businessAddresses.${index}.line1`)}
                  disabled={disabled}
                  autofilled={!!addr.line1}
                />
                <FormInput
                  label="Address line 2"
                  name={`businessAddresses.${index}.line2`}
                  value={addr.line2 ?? ""}
                  onChange={(v) => onAddressChange(index, { line2: v })}
                  disabled={disabled}
                  autofilled={!!addr.line2}
                />
                <FormInput
                  label="City"
                  name={`businessAddresses.${index}.city`}
                  value={addr.city ?? ""}
                  onChange={(v) => onAddressChange(index, { city: v })}
                  required={index === 0}
                  error={getFieldError?.(`businessAddresses.${index}.city`)}
                  disabled={disabled}
                  autofilled={!!addr.city}
                />
                <FormSelect
                  label="Country"
                  name={`businessAddresses.${index}.country`}
                  value={addr.country ?? ""}
                  onChange={(v) => onAddressChange(index, { country: v })}
                  options={[{ value: "US", label: "United States" }]}
                  placeholder="Select country"
                  required={index === 0}
                  disabled={disabled}
                  error={getFieldError?.(`businessAddresses.${index}.country`)}
                  autoFilled={!!addr.country}
                />
                <FormInput
                  label="ZIP / Postal Code"
                  name={`businessAddresses.${index}.zip_code`}
                  value={addr.zip_code ?? ""}
                  onChange={(v) => onAddressChange(index, { zip_code: v })}
                  required={index === 0}
                  error={getFieldError?.(
                    `businessAddresses.${index}.zip_code`
                  )}
                  disabled={disabled}
                  autofilled={!!addr.zip_code}
                />
                <FormSelect
                  label="State"
                  name={`businessAddresses.${index}.state`}
                  value={normalizeUSState(addr.state) ?? ""}
                  onChange={(v) => onAddressChange(index, { state: v })}
                  options={US_STATES.map((s) => ({ value: s, label: s }))}
                  disabled={disabled}
                  autoFilled={!!addr.state}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
