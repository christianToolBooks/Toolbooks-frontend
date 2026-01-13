"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { BusinessDetailsCard } from "./BusinessDetailsCard";
import type { OnboardingCompanyProfile, OnboardingFinancialOverview } from "@/src/types/questionnaire";

type Props = {
  businessDetails: OnboardingCompanyProfile;
  financialOverview: OnboardingFinancialOverview;
  onBusinessDetailsChange: (data: Partial<OnboardingCompanyProfile>) => void;
  onFinancialOverviewChange: (data: Partial<OnboardingFinancialOverview>) => void;
  getFieldError: (field: string) => string | undefined;
  /** opcional: deshabilitar UI (útil mientras se hidrata) */
  disabled?: boolean;
};

export function BusinessDetailsStep({
  businessDetails,
  financialOverview,
  onBusinessDetailsChange,
  onFinancialOverviewChange,
  getFieldError,
  disabled = false,
}: Props) {
  return (
    <div className="space-y-8">
      <Card className="border-none shadow-none">
        <CardContent className="p-0">
          <BusinessDetailsCard
            businessDetails={businessDetails}
            onBusinessDetailsChange={onBusinessDetailsChange}
            onFinancialOverviewChange={onFinancialOverviewChange}
            financialOverview={financialOverview}
            getFieldError={getFieldError}
            disabled={disabled}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default BusinessDetailsStep;
