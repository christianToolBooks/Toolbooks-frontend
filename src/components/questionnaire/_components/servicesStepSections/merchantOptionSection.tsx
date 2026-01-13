import { Button } from "@/src/components/ui/button";
import { BusinessProfile, FinancialOverview } from "@/src/types/questionnaire";

interface MerchantOptionSectionProps {
  data: {
    businessProfile: Partial<BusinessProfile>;
    businessFinancialOverview: Partial<FinancialOverview>;
  };
 onChange: (
    field: keyof BusinessProfile | keyof FinancialOverview,
    value: boolean | number | string,
    section: "bookkeepingSettings" | "companyProfile" | "businessFinancialOverview"
  ) => void;
}

export function MerchantOptionSection({
  data,
  onChange,
}: MerchantOptionSectionProps) {
  return (
    <div className="space-y-3 p-4 bg-muted/50 rounded-lg border border-border">
      <h3 className="text-lg font-semibold text-primary">
        Payment & Invoicing Preferences
      </h3>
      <p className="text-sm text-muted-foreground">
        Would you like to use our system to issue invoices and receive payments?
      </p>
      <div className="flex gap-4 justify-center">
        <Button
        //   onClick={() => onChange("useToolbooksBilling", true, "bookkeepingSettings")}
          className="px-3 py-1 rounded bg-chart-1 text-white hover:bg-chart-1/90 hover:shadow-lg"
        >
          Yes, I want to use ToolBooks billing
        </Button>
        <Button
        //   onClick={() => onChange("useToolbooksBilling", false, "bookkeepingSettings")}
          className="px-3 py-1 rounded bg-chart-2 text-white hover:bg-chart-1 hover:shadow-lg"
        >
          No, I use another billing system
        </Button>
      </div>
      {/* {data.businessProfile? && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-800">
          You can start your <strong>merchant application</strong> to enable payment processing.
        </div>
      )} */}
    </div>
  );
}
