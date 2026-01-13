"use client";

import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import type { PaymentTerms } from "@/src/types/vendorsTypes";
import { BasicInfoIndividualProps } from "../../types/types";
import { InputPhoneFormateToBasicInfoToIndividualVendorForm } from "./inputPhoneFormateToBasicInfoVendorForm";
import { useState } from "react";

export function BasicInfoToIndivualVendor({ formData, onUpdateFormData, register, setValue, watch, errors }: BasicInfoIndividualProps) {
  const [isCustom, setIsCustom] = useState(false);

  const handleCustomPaymentTermChange = (value: string) => {
    setIsCustom(value === "custom");
    if (value === "custom") {
      // Limpiar el valor cuando se selecciona "custom"
      onUpdateFormData({ paymentTerms: "" as PaymentTerms });
    } else {
      onUpdateFormData({ paymentTerms: value as PaymentTerms });
    }
  }
  
  return (
    <section className="overflow-hidden rounded-2xl border border-[#EFECE6]/50 bg-white/80 shadow-sm backdrop-blur-sm">
      <header className="border-b border-[#EFECE6]/50 px-5 py-4 md:px-6">
        <h2 className="text-lg font-semibold text-[#1E3A8A] md:text-xl">Basic Information</h2>
      </header>
      <div className="px-5 py-6 md:px-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs uppercase tracking-wide text-[#5C769D]">Vendor Name *</Label>
            <Input
              id="name"
              value={formData.name}
              {...register("name", { required: true })}
              className="h-10 border-2 border-chart-5 bg-transparent px-2 text-base focus:border-[#1E3A8A] focus:ring-0"
            />
            {errors?.name && (
              <p className="mt-1 text-xs text-red-600">
                {errors.name.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultCurrency" className="text-xs uppercase tracking-wide text-[#5C769D]">Default Currency *</Label>
            <Input
              id="defaultCurrency"
              value={formData.defaultCurrency}
              onChange={(e) => onUpdateFormData({ defaultCurrency: e.target.value })}
              placeholder="USD"
              className="h-10 border-2 border-chart-5 bg-transparent px-2 text-base focus:border-[#1E3A8A] focus:ring-0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-wide text-[#5C769D]">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => onUpdateFormData({ email: e.target.value })}
              className="h-10 border-2 border-chart-5 bg-transparent px-2 text-base focus:border-[#1E3A8A] focus:ring-0"
            />
          </div>

          <div className="space-y-2">
            <InputPhoneFormateToBasicInfoToIndividualVendorForm
              errors={errors ?? {}}
              register={register}
              setValue={setValue}
              watch={watch}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentTerms" className="text-xs uppercase tracking-wide text-[#5C769D]">Payment Terms *</Label>
            <Select
              value={isCustom ? "custom" : formData.paymentTerms}
              onValueChange={handleCustomPaymentTermChange}
            >
              <SelectTrigger className="h-10 border-2 border-chart-5 bg-transparent focus:border-[#1E3A8A] focus:ring-0">
                <SelectValue placeholder="Select payment terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="net_0">Net 0</SelectItem>
                <SelectItem value="net_15">Net 15</SelectItem>
                <SelectItem value="net_30">Net 30</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isCustom && (
            <div className="space-y-2">
              <Label htmlFor="customPaymentTerms" className="text-xs uppercase tracking-wide text-[#5C769D]">Custom Payment Terms</Label>
              <Input
                id="customPaymentTerms"
                value={formData.paymentTerms || ""}
                onChange={(e) => onUpdateFormData({ paymentTerms: e.target.value as PaymentTerms })}
                className="h-10 border-2 border-chart-5 bg-transparent px-2 text-base focus:border-[#1E3A8A] focus:ring-0"
                placeholder="Enter custom payment terms (e.g., Net 45, Due on receipt)"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
