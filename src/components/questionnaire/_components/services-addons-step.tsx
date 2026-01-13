"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  Check,
  X,
  Info,
  Receipt,
  CreditCard,
  Users,
  FileText,
} from "lucide-react";
import type {
  FinancialOverview,
  BusinessProfile,
} from "@/src/types/questionnaire";
import { useSubscriptionFlow } from "../_hooks/useSubscriptionFlow";
import { useState } from "react";
import { toast } from "sonner";
import { AddonCode } from "@/src/types/paymentMethods";
import { ModuleCard } from "./module-card";
import { getServiceLevelFromAmount } from "../_utils/questionnaire-logic";
import { Label } from "@/src/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Input } from "@/src/components/ui/input";

interface ServicesAddonsStepProps {
  data: {
    businessProfile: Partial<BusinessProfile>;
    businessFinancialOverview: Partial<FinancialOverview>;
  };
  onChange: (
    field: keyof BusinessProfile | keyof FinancialOverview,
    value: boolean | number | string,
    section:
      | "bookkeepingSettings"
      | "companyProfile"
      | "businessFinancialOverview"
  ) => void;
  subscriptionFlow: ReturnType<typeof useSubscriptionFlow>;
}

export function ServicesAddonsStep({
  data,
  onChange,
  subscriptionFlow,
}: ServicesAddonsStepProps) {
  const s = subscriptionFlow;
  const [payrollOption, setPayrollOption] = useState<
    "connect" | "complete" | null
  >(null);

  const handleAddModule = (moduleId: string) => {
    switch (moduleId) {
      case "invoicing":
        onChange("hasInvoices", true, "bookkeepingSettings");
        if (!s.addons.includes(AddonCode.INVOICING))
          s.toggleAddon(AddonCode.INVOICING);
        toast.success("Invoicing module added!");
        break;
      case "billPay":
        onChange("hasBills", true, "bookkeepingSettings");
        if (!s.addons.includes(AddonCode.BILL_PAY))
          s.toggleAddon(AddonCode.BILL_PAY);
        toast.success("Bill Pay module added!");
        break;
      case "payroll":
        if (payrollOption) {
          onChange("hasPayroll", true, "bookkeepingSettings");
          if (payrollOption === "connect") {
            if (s.addons.includes(AddonCode.PAYROLL_COMPLETE))
              s.toggleAddon(AddonCode.PAYROLL_COMPLETE);
            if (!s.addons.includes(AddonCode.PAYROLL_CONNECT))
              s.toggleAddon(AddonCode.PAYROLL_CONNECT);
          } else {
            if (s.addons.includes(AddonCode.PAYROLL_CONNECT))
              s.toggleAddon(AddonCode.PAYROLL_CONNECT);
            if (!s.addons.includes(AddonCode.PAYROLL_COMPLETE))
              s.toggleAddon(AddonCode.PAYROLL_COMPLETE);
          }
          toast.success(
            `Payroll ${payrollOption === "connect" ? "Connect" : "Complete"} added!`
          );
        } else {
          toast.warning("Please select a payroll option first");
        }
        break;
      case "tax":
        onChange("hasTaxReturnPreparation", true, "bookkeepingSettings");
        toast.success("Business Tax Return Preparation added!");
        break;
    }
  };

  const handleRemoveModule = (moduleId: string) => {
    switch (moduleId) {
      case "invoicing":
        onChange("hasInvoices", false, "bookkeepingSettings");
        if (s.addons.includes(AddonCode.INVOICING))
          s.toggleAddon(AddonCode.INVOICING);
        toast.info("Invoicing module removed");
        break;
      case "billPay":
        onChange("hasBills", false, "bookkeepingSettings");
        if (s.addons.includes(AddonCode.BILL_PAY))
          s.toggleAddon(AddonCode.BILL_PAY);
        toast.info("Bill Pay module removed");
        break;
      case "payroll":
        onChange("hasPayroll", false, "bookkeepingSettings");
        if (s.addons.includes(AddonCode.PAYROLL_CONNECT))
          s.toggleAddon(AddonCode.PAYROLL_CONNECT);
        if (s.addons.includes(AddonCode.PAYROLL_COMPLETE))
          s.toggleAddon(AddonCode.PAYROLL_COMPLETE);
        setPayrollOption(null);
        toast.info("Payroll module removed");
        break;
      case "tax":
        onChange("hasTaxReturnPreparation", false, "bookkeepingSettings");
        toast.info("Business Tax Return Preparation removed");
        break;
    }
  };

  const handleNeedMoreInfo = (moduleName: string) => {
    toast.info(
      `For more information about ${moduleName}, please contact our support team.`
    );
  };

  const avgExpense = data.businessFinancialOverview.avg_monthly_expenses || "0";
  const serviceLevel = getServiceLevelFromAmount(parseFloat(avgExpense));

  return (
    <div className=" pace-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary">
            Select Your ToolBooks Modules
          </CardTitle>
          <CardDescription>
            Choose the services your business needs to streamline operations
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          {/* Invoicing Module */}
          <ModuleCard
            title="Invoicing"
            description="Comprehensive invoicing solutions. Create professional invoices, track payment status and get paid faster."
            features={[
              "Professional invoice creation",
              "Smart data capture",
              "Customizable templates",
              "Client portal for easy payment",
              "Recurring invoice automation",
              "Payment tracking",
              "Automated reminders",
              "Integration with bookkeeping modules",
              "Real-time dashboard intel",
              "Customizable reports",
              "Data encryption and access control",
              "Regulatory compliance",
            ]}
            price="$29/month"
            onAdd={() => handleAddModule("invoicing")}
            onNotInterested={() => handleRemoveModule("invoicing")}
            onNeedMoreInfo={() => handleNeedMoreInfo("Invoicing")}
            isAdded={s.addons.includes(AddonCode.INVOICING)}
          />

          {/* Bill Pay Module */}

          <ModuleCard
            title="Bill Pay"
            description="Take control of your accounts payable with our bill payment solution. Automate payments, manage approvals and never miss a date."
            features={[
              "Vendor payment processing",
              "Automated payment scheduling",
              "Bank and payment gateway integration",
              "Integration with bookkeeping modules",
              "Multi-level workflow approvals",
              "Expense tracking and categorization",
              "Analytics and reporting",
              "Encryption and fraud prevention",
              "Regulatory compliance",
              "Vendor management portal",
            ]}
            price="$39/month"
            onAdd={() => handleAddModule("billPay")}
            onNotInterested={() => handleRemoveModule("billPay")}
            onNeedMoreInfo={() => handleNeedMoreInfo("Bill Pay")}
            isAdded={s.addons.includes(AddonCode.BILL_PAY)}
          />

          {/* Payroll Module */}
          <ModuleCard
            title="Payroll"
            description="Handle payroll with confidence. From direct deposits to tax filings, we manage every aspect of your payroll so you can focus on growing your business."
            features={[
              "Complete live payroll processing",
              "Direct deposits and pay stubs",
              "Automated tax calculations and filings",
              "Federal and state compliance",
              "Employee self-service portal",
              "Time tracking integration",
            ]}
            price="From $29/month"
            onAdd={() => handleAddModule("payroll")}
            onNotInterested={() => handleRemoveModule("payroll")}
            onNeedMoreInfo={() => handleNeedMoreInfo("Payroll")}
            isAdded={
              s.addons.includes(AddonCode.PAYROLL_CONNECT) ||
              s.addons.includes(AddonCode.PAYROLL_COMPLETE)
            }
          >
            <div className="space-y-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900">
                Choose Your Payroll Option
              </h4>

              <RadioGroup
                value={payrollOption || ""}
                onValueChange={(value) =>
                  setPayrollOption(value as "connect" | "complete")
                }
                className="space-y-3"
              >
                {/* PAYROLL CONNECT */}
                <label
                  htmlFor="payroll-connect"
                  className={`flex gap-4 rounded-xl border p-4 cursor-pointer transition
        ${
          payrollOption === "connect"
            ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500"
            : "border-gray-200 hover:border-primary-300 bg-white"
        }`}
                >
                  <RadioGroupItem
                    value="connect"
                    id="payroll-connect"
                    className="mt-1"
                  />

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900">
                        Payroll Connect
                      </p>
                      <span className="text-sm font-semibold text-primary-600">
                        $29 / month
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mt-1 leading-snug">
                      Integrate with your existing payroll provider and
                      seamlessly sync data between platforms.
                    </p>
                  </div>
                </label>

                {/* PAYROLL COMPLETE */}
                <label
                  htmlFor="payroll-complete"
                  className={`flex rounded-xl border p-2 cursor-pointer transition
        ${
          payrollOption === "complete"
            ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500"
            : "border-gray-200 hover:border-primary-300 bg-white"
        }`}
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-2 items-center">
                      <RadioGroupItem
                        value="complete"
                        id="payroll-complete"
                        className="mt-1"
                      />
                      <div className="flex gap-4 intems-center justify-between w-full">
                        <p className="font-semibold text-gray-900">
                          Payroll Complete
                        </p>
                        <span className="text-sm font-semibold text-gray-700">
                          Custom Pricing
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 leading-snug">
                      Full-service live payroll processing, including all tax
                      filings and compliance.
                    </p>

                    {payrollOption === "complete" && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-1 gap-2 rounded-lg bg-white p-3 border border-gray-200">
                        <div>
                          <Label
                            htmlFor="employees"
                            className="text-xs text-gray-700"
                          >
                            Number of Employees
                          </Label>
                          <Input
                            id="employees"
                            type="number"
                            min="0"
                            value={s.employees}
                            onChange={(e) =>
                              s.setEmployees(Number(e.target.value))
                            }
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="states"
                            className="text-xs text-gray-700"
                          >
                            Number of States
                          </Label>
                          <Input
                            id="states"
                            type="number"
                            min="0"
                            value={s.states}
                            onChange={(e) =>
                              s.setStates(Number(e.target.value))
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </RadioGroup>
            </div>
          </ModuleCard>
          <div>
            <ModuleCard
              title="Business Tax Return Preparation"
              description="Professional tax preparation and compliance services to ensure your business stays compliant and maximizes deductions."
              features={[
                "Annual tax return preparation",
                "Federal and state compliance",
                "Tax planning and strategy",
                "Audit support and representation",
                "Access to certified tax experts",
                "Year-round tax consultation",
              ]}
              price="Custom Pricing"
              onAdd={() => handleAddModule("tax")}
              onNotInterested={() => handleRemoveModule("tax")}
              onNeedMoreInfo={() =>
                handleNeedMoreInfo("Business Tax Return Preparation")
              }
              isAdded={data.businessProfile.hasTaxReturnPreparation || false}
            />
          </div>
          {/* Business Tax Return Preparation Module */}
        </CardContent>
      </Card>

      {/* Current Service Tier Display */}
      <Card className="mt-6 border-2 border-primary-200 bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Your Current Service Tier
          </CardTitle>
          <CardDescription>
            Based on your monthly expenses of $
            {parseFloat(avgExpense).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 rounded-lg border-2 border-primary-400 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {serviceLevel.name}
                </h3>
                <p className="text-lg font-semibold text-primary-600 mt-1">
                  {serviceLevel.price}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                <Check className="w-5 h-5" />
                Current Plan
              </div>
            </div>
            <div className="space-y-2">
              {serviceLevel.features?.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <Check className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            {serviceLevel.expenseRange && (
              <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                <p className="text-sm text-primary-900">
                  <span className="font-semibold">Expense Range:</span>{" "}
                  {serviceLevel.expenseRange}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
