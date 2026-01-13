// components/pricing-step/sections/PreviewSummary.tsx
"use client";

import { Separator } from "@/src/components/ui/separator";
import { Clock } from "lucide-react";
import { PreviewSubscriptionResponse } from "@/src/types/paymentMethods";
import { Badge } from "@/src/components/ui/badge";
import { Sparkles } from "lucide-react";

const formatCurrency = (cents: number): string => {
  const dollars = cents / 100;
  return dollars.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export function PreviewSummary({ subscription }: { subscription: PreviewSubscriptionResponse }) {
  const {
    plan_month_cents,
    addons_month_cents,
    monthly_total_cents,
    months,
    discount_percent,
    period_total_cents,
    addons,
    variables,
  } = subscription;

  const baseFee = formatCurrency(plan_month_cents);
  const addonsFee = formatCurrency(addons_month_cents);
  const monthlyTotal = formatCurrency(monthly_total_cents);
  const totalPeriod = formatCurrency(period_total_cents);
  const discount = discount_percent ?? 0;
  const discountAmount = formatCurrency((monthly_total_cents * discount) / 100);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden p-6 bg-gradient-to-br from-[#1E3A8A] to-[#5C769D] rounded-xl shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
        <div className="relative">
          <p className="text-white/80 text-sm font-medium mb-2">Monthly Subscription</p>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-5xl font-bold text-white">${monthlyTotal}</span>
            <span className="text-white/80 text-lg">/month</span>
          </div>
          <p className="text-white/90 text-sm">Includes all selected services and add-ons</p>
        </div>
      </div>

      <div className="p-5 rounded-xl space-y-3">
        <h4 className="font-semibold text-[#1E3A8A] mb-3">Price Breakdown</h4>

        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-[#5C769D]">Base Plan</span>
            <span className="font-medium text-gray-900">${baseFee}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#5C769D]">Add-ons</span>
            <span className="font-medium text-gray-900">${addonsFee}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between items-center p-2 bg-[#F0F6FE] rounded-lg -mx-2 px-4 border border-[#5C769D]/20">
              <span className="text-[#1E3A8A] font-medium">
                Discount ({discount}% for {months} months)
              </span>
              <span className="text-[#1E3A8A] font-semibold">- ${discountAmount}</span>
            </div>
          )}

          <Separator className="my-3" />

          <div className="flex justify-between items-center pt-1">
            <span className="font-semibold text-gray-900">Total Monthly</span>
            <span className="text-xl font-bold text-[#1E3A8A]">${monthlyTotal}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-[#F0F6FE] rounded-lg -mx-2 px-4 border border-[#5C769D]/20">
            <span className="font-semibold text-[#1E3A8A]">Total for {months} months</span>
            <span className="text-xl font-bold text-[#1E3A8A]">${totalPeriod}</span>
          </div>
        </div>
      </div>

      <div className="p-5 bg-[#F0F6FE] rounded-xl border border-[#5C769D]/30">
        <h4 className="font-semibold text-[#1E3A8A] mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Payroll Details
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {variables.employees !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#5C769D] font-medium">Employees:</span>
              <span className="text-[#1E3A8A] font-semibold">{variables.employees}</span>
            </div>
          )}
          {variables.states !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#5C769D] font-medium">States:</span>
              <span className="text-[#1E3A8A] font-semibold">{variables.states}</span>
            </div>
          )}
        </div>
      </div>

      {/* Addons */}
      {addons?.length > 0 && (
        <div className="p-5 rounded-xl bg-[#F0F6FE] border border-[#A2A8AB]/30">
          <h4 className="font-semibold text-[#1E3A8A] mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Included Add-ons
          </h4>
          <div className="flex flex-wrap gap-2">
            {addons.map((a: string) => (
              <Badge
                key={a}
                variant="secondary"
                className="bg-[#F0F6FE] text-[#1E3A8A] border-[#5C769D]/30 capitalize"
              >
                {a.replaceAll("_", " ")}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
