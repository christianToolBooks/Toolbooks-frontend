"use client";

import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Switch } from "@/src/components/ui/switch";
import { Trash2 } from "lucide-react";
import type {  VendorAddressType } from "@/src/types/vendorsTypes";
import { FieldErrors, UseFormSetValue } from "react-hook-form";
import { useAddressFormLogicToVendorForm } from "../../../../../hooks/useAddressFormLogicVendorForm";
import { CreateVendorAddressInput, CreateVendorInputSchemaType } from "@/src/app/(home)/bill-pay/_schemas/businessVendorSchema";

type Props = {
  index: number;
  address: CreateVendorAddressInput;
  onUpdateAddress: (index: number, field: keyof CreateVendorAddressInput, value: string | boolean | number) => void;
  onRemoveAddress: (index: number) => void;
  setValue: UseFormSetValue<CreateVendorInputSchemaType>;
  errors?: FieldErrors<CreateVendorInputSchemaType>;
};

export function AddressRow({ index, address, onUpdateAddress, onRemoveAddress, setValue, errors}: Props) {
  const { inputRef } = useAddressFormLogicToVendorForm({
    setValue,
    onError: (e) => console.error("Autocomplete error:", e),
    addressIndex: index,
  });

  return (
    <div className="rounded-xl border border-[#EFECE6]/60 bg-white/60 p-4 backdrop-blur-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-2 space-y-1.5">
          <Label className="text-[11px] uppercase tracking-wide text-[#5C769D]">Type</Label>
          <Select
            value={address.type}
            onValueChange={(v) => onUpdateAddress(index, "type", v as VendorAddressType)}
          >
            <SelectTrigger className="h-10 border-2 border-chart-5 bg-transparent focus:border-[#1E3A8A] focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="billed_from">Billed From</SelectItem>
              <SelectItem value="shipped_from">Shipped From</SelectItem>
              <SelectItem value="remit_to">Remit To</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-4 space-y-1.5">
          <Label className="text-[11px] uppercase tracking-wide text-[#5C769D]">Address Line 1</Label>
          <Input
            ref={inputRef}                 
            value={address.line1 || ""}    
            onChange={(e) => onUpdateAddress(index, "line1", e.target.value)}
            className="h-10 border-2 border-chart-5 bg-transparent px-2 text-sm focus:border-[#1E3A8A] focus:ring-0"
          />
          {errors?.addresses?.[index]?.line1 && (
            <p className="mt-1 text-xs text-red-600">
              {errors.addresses[index]?.line1?.message as string}
            </p>
          )}
        </div>

        <div className="md:col-span-3 space-y-1.5">
          <Label className="text-[11px] uppercase tracking-wide text-[#5C769D]">Address Line 2</Label>
          <Input
            value={address.line2 || ""}
            onChange={(e) => onUpdateAddress(index, "line2", e.target.value)}
            className="h-10 border-2 border-chart-5 bg-transparent px-2 text-sm focus:border-[#1E3A8A] focus:ring-0"
          />
          {errors?.addresses?.[index]?.line2 && (
            <p className="mt-1 text-xs text-red-600">
              {errors.addresses[index]?.line2?.message as string}
            </p>
          )}
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <Label className="text-[11px] uppercase tracking-wide text-[#5C769D]">City</Label>
          <Input
            value={address.city || ""}
            onChange={(e) => onUpdateAddress(index, "city", e.target.value)}
            className="h-10 border-2 border-chart-5 bg-transparent px-2 text-sm focus:border-[#1E3A8A] focus:ring-0"
          />
          {errors?.addresses?.[index]?.city && (
            <p className="mt-1 text-xs text-red-600">
              {errors.addresses[index]?.city?.message as string}
            </p>
          )}
        </div>

        <div className="md:col-span-1 flex items-end justify-end">
          <button
            type="button"
            onClick={() => onRemoveAddress(index)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <Label className="text-[11px] uppercase tracking-wide text-[#5C769D]">State</Label>
          <Input
            value={address.state || ""}
            onChange={(e) => onUpdateAddress(index, "state", e.target.value)}
            className="h-10 border-2 border-chart-5 bg-transparent px-2 text-sm focus:border-[#1E3A8A] focus:ring-0"
          />
          {errors?.addresses?.[index]?.state && (
            <p className="mt-1 text-xs text-red-600">
              {errors.addresses[index]?.state?.message as string}
            </p>
          )}
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <Label className="text-[11px] uppercase tracking-wide text-[#5C769D]">Postal Code</Label>
          <Input
            value={address.postalCode || ""}
            onChange={(e) => onUpdateAddress(index, "postalCode", e.target.value)}
            className="h-10 border-2 border-chart-5 bg-transparent px-2 text-sm focus:border-[#1E3A8A] focus:ring-0"
          />
          {errors?.addresses?.[index]?.postalCode && (
            <p className="mt-1 text-xs text-red-600">
              {errors.addresses[index]?.postalCode?.message as string}
            </p>
          )}
        </div>

        <div className="md:col-span-2 space-y-1.5">
          <Label className="text-[11px] uppercase tracking-wide text-[#5C769D]">Country</Label>
          <Input
            value={address.country || ""}
            onChange={(e) => onUpdateAddress(index, "country", e.target.value)}
            className="h-10 border-2 border-chart-5 bg-transparent px-2 text-sm focus:border-[#1E3A8A] focus:ring-0"
          />
          {errors?.addresses?.[index]?.country && (
            <p className="mt-1 text-xs text-red-600">
              {errors.addresses[index]?.country?.message as string}
            </p>
          )}
        </div>

        <div className="md:col-span-5 flex items-center space-y-1.5">
          <div className="flex items-center space-x-2">
            <Switch
              checked={address.isDefault || false}
              onCheckedChange={(checked) => onUpdateAddress(index, "isDefault", checked)}
            />
            <Label className="text-[11px] uppercase tracking-wide text-[#5C769D]">Default Address</Label>
          </div>
        </div>
      </div>
    </div>
  );
}
