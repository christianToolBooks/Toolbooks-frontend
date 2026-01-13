"use client";

import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import type { PaymentTerms } from "@/src/types/vendorsTypes";
import { BasicInfoProps } from "../types/types";
import { InputPhoneFormateToBasicInfoToVendorForm } from "./inputPhoneFormateToBasicInfoVendorForm";

export function BasicInfo({ formData, onUpdateFormData, register, setValue, watch, errors }: BasicInfoProps) {
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
            <Label htmlFor="legalName" className="text-xs uppercase tracking-wide text-[#5C769D]">Legal Name</Label>
            <Input
              id="legalName"
              value={formData.legalName || ""}
              onChange={(e) => onUpdateFormData({ legalName: e.target.value })}
              className="h-10 border-2 border-chart-5 bg-transparent px-2 text-base focus:border-[#1E3A8A] focus:ring-0"
            />
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
            <InputPhoneFormateToBasicInfoToVendorForm
              errors={errors ?? {}}
              register={register}
              setValue={setValue}
              watch={watch}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="paymentTerms" className="text-xs uppercase tracking-wide text-[#5C769D]">Payment Terms *</Label>
            <Select
              value={formData.paymentTerms}
              onValueChange={(value) => onUpdateFormData({ paymentTerms: value as PaymentTerms })}
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
        </div>
      </div>
    </section>
  );
}
