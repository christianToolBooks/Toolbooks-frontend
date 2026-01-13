"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import {
  BookkeepingSettings,
  BookkeepingStatus,
  BusinessType,
  CompanyProfile,
  FinancialOverview,
} from "@/src/types/questionnaire";

interface BookkeepingStepProps {
  data: {
    bookkeepingSettings: Partial<BookkeepingSettings>;
    companyProfile: Partial<CompanyProfile>;
    businessFinancialOverview: Partial<FinancialOverview>;
  };
  onChange: (
    field: string,
    value: string | number,
    section: "bookkeepingSettings" | "companyProfile" | "businessFinancialOverview"
  ) => void;
  getFieldError: (fieldPath: string) => string | null;
}

export function BookkeepingStep({ data, onChange, getFieldError }: BookkeepingStepProps) {


  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <Label>Current Bookkeeping Status *</Label>
          <RadioGroup
            value={data.bookkeepingSettings.status ?? ""}
            onValueChange={(value) =>
              onChange("status", value, "bookkeepingSettings")
            }
            className={getFieldError("bookkeepingSettings.status") ? "border-red-500 p-2 rounded" : "space-y-2"}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={BookkeepingStatus.UP_TO_DATE}
                id="up-to-date"
              />
              <Label htmlFor="up-to-date" className="font-normal">
                Up to date
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={BookkeepingStatus.CATCH_UP_REQUIRED}
                id="catch-up"
              />
              <Label htmlFor="catch-up" className="font-normal">
                Catch-up work required
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={BookkeepingStatus.NEW_BUSINESS}
                id="new-business"
              />
              <Label htmlFor="new-business" className="font-normal">
                New business or None presently
              </Label>
            </div>
          </RadioGroup>
          {getFieldError("bookkeepingSettings.status") && (
            <p className="flex justify-start text-sm text-red-500">
              {getFieldError("bookkeepingSettings.status")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessType">Business Type *</Label>
          <Select
            value={data.companyProfile.business_type ?? ""}
            onValueChange={(value) =>
              onChange("business_type", value, "companyProfile")
            }
          >
            <SelectTrigger
              className={getFieldError("businessCompanyProfile.business_type") ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Select a business type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={BusinessType.SELF_EMPLOYED}>
                Sole Proprietor (files Schedule C)
              </SelectItem>
              <SelectItem value={BusinessType.PARTNERSHIP}>
                Partnership or LLP (files Form 1065)
              </SelectItem>
              <SelectItem value={BusinessType.C_CORP}>
                Corporation (files Form 1120)
              </SelectItem>
              <SelectItem value={BusinessType.S_CORP}>
                S Corporation (files Form 1120-S)
              </SelectItem>
            </SelectContent>
          </Select>
          {getFieldError("businessCompanyProfile.business_type") && (
            <p className="flex justify-start text-sm text-red-500">
              {getFieldError("businessCompanyProfile.business_type")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="avgMonthlyExpenses">
            Average Monthly Business Expenses *
          </Label>
          <Select
            value={data.businessFinancialOverview.avg_monthly_expenses?.toString() ?? ""}
            onValueChange={(value) =>
              onChange("avg_monthly_expenses", value, "businessFinancialOverview")
            }
          >
            <SelectTrigger
              className={getFieldError("businessFinancialOverview.avg_monthly_expenses") ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Select expense range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-10000">$0 - $10,000</SelectItem>
              <SelectItem value="10001-25000">$10,001 - $25,000</SelectItem>
              <SelectItem value="25001-50000">$25,001 - $50,000</SelectItem>
              <SelectItem value="50001-125000">$50,001 - $125,000</SelectItem>
              <SelectItem value="125001-200000">$125,001 - $200,000</SelectItem>
              <SelectItem value="200000+">$200,000+</SelectItem>
            </SelectContent>
          </Select>
          {getFieldError("businessFinancialOverview.avg_monthly_expenses") && (
            <p className="flex justify-start text-sm text-red-500">
              {getFieldError("businessFinancialOverview.avg_monthly_expenses")}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}