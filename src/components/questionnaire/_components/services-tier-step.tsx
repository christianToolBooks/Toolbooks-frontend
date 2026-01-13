"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import type {
  FinancialOverview,
  BusinessProfile,
} from "@/src/types/questionnaire";
import { CurrentServiceLevel } from "./servicesStepSections/currentServiceLevelSection";
import { ServiceTiersSection } from "./servicesStepSections/serviceTierCard";
import { useState } from "react";

interface ServicesTierStepProps {
  expense: string;
  onChange: (
    field: keyof BusinessProfile | keyof FinancialOverview,
    value: boolean | number | string,
    section:
      | "bookkeepingSettings"
      | "companyProfile"
      | "businessFinancialOverview"
  ) => void;
  onExpenseChange: (value: string) => void;
}

export function ServicesTierStep({
  expense,
  onChange,
  onExpenseChange,
}: ServicesTierStepProps) {
  const [isEditingExpense, setIsEditingExpense] = useState(false);

  const handleChange = (
    field: keyof FinancialOverview | keyof BusinessProfile | "term" | "employees" | "states",
    value: string | number | boolean,
    section:
      | "bookkeepingSettings"
      | "companyProfile"
      | "businessFinancialOverview"
      | "createSubscription"
      | "getPreviewQuote"
  ) => {
    if (
      field === "avg_monthly_expenses" &&
      section === "businessFinancialOverview"
    ) {
      onExpenseChange(value as string);
    } else if (
      field !== "term" && 
      field !== "employees" && 
      field !== "states" &&
      (section === "bookkeepingSettings" || section === "companyProfile" || section === "businessFinancialOverview")
    ) {
      onChange(field as keyof BusinessProfile | keyof FinancialOverview, value, section);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">
          Your Service Tier
        </CardTitle>
        <CardDescription>
          Review your service level based on your monthly expenses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <CurrentServiceLevel
          expenseRange={expense}
          isEditingExpense={isEditingExpense}
          setIsEditingExpense={setIsEditingExpense}
          onChange={handleChange}
        />

        <ServiceTiersSection expenseRange={expense} />
      </CardContent>
    </Card>
  );
}
