"use client";

import { CardHeader, CardTitle } from "@/src/components/ui/card";
import { FormInput } from "../../form-input";
import { FormSelect } from "../../form-select";
import {
  AccountingBasisEnum,
  AvgAnnualRevenueBracket,
  BusinessType,
  FinancialObjective,
  LifeCyclePhase,
  OnboardingCompanyProfile,
  OnboardingFinancialOverview,
  SalesRevenueType,
} from "@/src/types/questionnaire";

import { BUSINESS_TYPES, INDUSTRIES, US_STATES } from "./constants";
import { FormDatePicker } from "../../form-date-picker";
import { FormMonthDayCalendarPicker } from "../../form-month-day-picker";
import { ACCOUNTING_BASIS, AVG_ANNUAL_REVENUE, LIFE_CYCLE_PHASE, OBJECTIVES_OPTIONS, SALES_REVENUE_TYPE } from "../../../_utils/onboarding-config";
import { fi } from "date-fns/locale";

type Props = {
  businessDetails: OnboardingCompanyProfile;
  financialOverview: OnboardingFinancialOverview;
  onBusinessDetailsChange: (data: Partial<OnboardingCompanyProfile>) => void;
  onFinancialOverviewChange: (data: Partial<OnboardingFinancialOverview>) => void;
  getFieldError: (field: string) => string | undefined;
  /** deshabilita inputs mientras se hidrata (opcional) */
  disabled?: boolean;
};

export function BusinessDetailsCard({
  businessDetails,
  financialOverview,
  onBusinessDetailsChange,
  onFinancialOverviewChange,
  getFieldError,
  disabled = false,
}: Props) {
  return (
    <div className="space-y-6 p-6">
      <CardHeader className="px-0">
        <CardTitle className="text-xl font-semibold text-foreground">
          About Your Business
        </CardTitle>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          label="Business Type"
          name="businessCompanyProfile.business_type"
          value={businessDetails.business_type}
          onChange={(value) =>
            onBusinessDetailsChange({ business_type: value as BusinessType })
          }
          options={BUSINESS_TYPES}
          placeholder="Select business type"
          error={getFieldError("businessCompanyProfile.business_type")}
          disabled={disabled}
          autoFilled={!!businessDetails.business_type}
        />

        <FormSelect
          label="Industry"
          name="businessCompanyProfile.industry"
          value={businessDetails.industry ?? ""}
          onChange={(value) => onBusinessDetailsChange({ industry: value })}
          options={INDUSTRIES.slice()}
          placeholder="Select industry"
          disabled={disabled}
          autoFilled={!!businessDetails.industry}
        />

        <FormInput
          label="Employer Identification Number (EIN)"
          name="businessCompanyProfile.ein"
          value={businessDetails.ein ?? ""}
          onChange={(value) => onBusinessDetailsChange({ ein: value })}
          placeholder="XX-XXXXXXX"
          description="Format: 12-3456789"
          disabled={disabled}
          autofilled={!!businessDetails.ein}
        />

        <FormInput
          label="NAICS Code"
          name="businessCompanyProfile.naics_code"
          value={businessDetails.naics_code ?? ""}
          onChange={(value) => onBusinessDetailsChange({ naics_code: value })}
          placeholder="e.g., 541110"
          disabled={disabled}
          autofilled={!!businessDetails.naics_code}
        />

        <FormDatePicker
          label="Business Start Date / Incorporation Date"
          name="businessCompanyProfile.start_date"
          value={businessDetails.start_date ?? ""}
          onChange={(value) => onBusinessDetailsChange({ start_date: value })}
          disabled={disabled}
          dateFormat="yyyy-MM-dd"
          placeholder="YYYY-MM-DD"
          autoFilled={!!businessDetails.start_date}
        />

        <FormDatePicker
          label="S Corp Election Date (if applicable)"
          name="businessCompanyProfile.s_corp_election_date"
          value={businessDetails.s_corp_election_date ?? ""}
          onChange={(value) => onBusinessDetailsChange({ s_corp_election_date: value })}
          disabled={disabled}
          dateFormat="yyyy-MM-dd"
          placeholder="YYYY-MM-DD"
          autoFilled={!!businessDetails.s_corp_election_date}
          required={false}
          error={getFieldError("businessCompanyProfile.s_corp_election_date")}
        />

        <FormMonthDayCalendarPicker
          label="Business Year End (MM-DD)"
          name="businessCompanyProfile.year_end_mmdd"
          value={businessDetails.year_end_mmdd ?? ""}
          onChange={(value) => onBusinessDetailsChange({ year_end_mmdd: value })}
          placeholder="MM-DD"
          disabled={disabled}
          autoFilled={!!businessDetails.year_end_mmdd}
        />

        <FormSelect
          label="State of Incorporation"
          name="businessCompanyProfile.state_of_incorporation"
          value={businessDetails.state_of_incorporation ?? ""}
          onChange={(value) =>
            onBusinessDetailsChange({ state_of_incorporation: value })
          }
          options={US_STATES.map((s) => ({ value: s, label: s }))}
          placeholder="Select state"
          disabled={disabled}
          autoFilled={!!businessDetails.state_of_incorporation}
        />

        <FormInput
          label="State Identification Number"
          name="businessCompanyProfile.state_id_number"
          value={businessDetails.state_id_number ?? ""}
          onChange={(value) =>
            onBusinessDetailsChange({ state_id_number: value })
          }
          placeholder="State ID number"
          disabled={disabled}
          autofilled={!!businessDetails.state_id_number}
        />

        <FormSelect
          label="Sales Revenue Type"
          name="businessFinancialOverview.sales_revenue_type"
          value={financialOverview.sales_revenue_type ?? ""}
          onChange={(value) =>
            onFinancialOverviewChange({ sales_revenue_type: value as SalesRevenueType })
          }
          options={SALES_REVENUE_TYPE}
          placeholder="Select business structure"
          disabled={disabled}
          autoFilled={!!financialOverview.sales_revenue_type}
          required={true}
          error={getFieldError("businessFinancialOverview.sales_revenue_type")}
        />
        <FormSelect
          label="Average Annual Revenue Bracket"
          name="businessFinancialOverview.avg_annual_revenue_bracket"
          value={financialOverview.avg_annual_revenue_bracket ?? ""}
          onChange={(value) =>
            onFinancialOverviewChange({ avg_annual_revenue_bracket: value as AvgAnnualRevenueBracket})
          }
          options={AVG_ANNUAL_REVENUE}
          placeholder="Select average annual sales revenue"
          disabled={disabled}
          autoFilled={!!financialOverview.avg_annual_revenue_bracket}
          required={true}
          error={getFieldError("businessFinancialOverview.avg_annual_revenue_bracket")}
        />
        <FormSelect
          label="Business Life Cycle Phase"
          name="businessFinancialOverview.business_life_cycle_phase"
          value={financialOverview.life_cycle_phase ?? ""}
          onChange={(value) =>
            onFinancialOverviewChange({ life_cycle_phase: value  as LifeCyclePhase})
          }
          options={LIFE_CYCLE_PHASE}
          placeholder="Select business life cycle phase"
          disabled={disabled}
          autoFilled={!!financialOverview.life_cycle_phase}
          required={true}
          error={getFieldError("businessFinancialOverview.life_cycle_phase")}
        />

        <FormSelect
          label="Accounting Basis"
          name="businessFinancialOverview.accounting_basis"
          value={financialOverview.accounting_basis ?? ""}
          onChange={(value) =>
            onFinancialOverviewChange({ accounting_basis: value as AccountingBasisEnum })
          }
          options={ACCOUNTING_BASIS}
          placeholder="Select accounting basis"
          disabled={disabled}
          autoFilled={!!financialOverview.accounting_basis}
          required={true}
          error={getFieldError("businessFinancialOverview.accounting_basis")}
        />
        <FormInput
          label="Average Monthly Expenses"
          name="businessFinancialOverview.avg_monthly_expenses"
          value={financialOverview.avg_monthly_expenses !== undefined ? String(financialOverview.avg_monthly_expenses) : ""}
          onChange={(value) =>
            onFinancialOverviewChange({ avg_monthly_expenses: value ? Number(value) : undefined })
          }
          placeholder="Average Monthly Expenses"
          disabled={disabled}
          autofilled={!!financialOverview.avg_monthly_expenses}
          required={true}
          error={getFieldError("businessFinancialOverview.avg_monthly_expenses")}
        />

        <FormSelect
          label="What are your objectives?"
          name="businessFinancialOverview.objectives"
          value={
            Array.isArray(financialOverview.objectives)
              ? financialOverview.objectives.join(",")
              : financialOverview.objectives ?? ""
          }
          onChange={(value) =>
            onFinancialOverviewChange({ objectives: Array.isArray(value) ? value as FinancialObjective[] : [value as FinancialObjective] })
          }
          options={OBJECTIVES_OPTIONS}
          placeholder="Select your objectives"
          disabled={disabled}
          autoFilled={!!financialOverview.objectives}
          required={true}
          error={getFieldError("businessFinancialOverview.objectives")}
        />
        <FormInput
          label="What are your business challenges?"
          name="businessFinancialOverview.business_challenges"
          value={financialOverview.business_challenges ?? ""}
          onChange={(value) =>
            onFinancialOverviewChange({ business_challenges: value })
          }
          placeholder="Describe your business challenges"
          disabled={disabled}
          autofilled={!!financialOverview.business_challenges}
          required={true}
          error={getFieldError("businessFinancialOverview.business_challenges")}
        />
        {financialOverview.objectives?.includes(FinancialObjective.OTHER) && (
          <FormInput
            label="If Other, please specify"
            name="businessFinancialOverview.objective_other_text"
            value={financialOverview.objective_other_text ?? ""}
            onChange={(value) =>
              onFinancialOverviewChange({ objective_other_text: value })
            }
            placeholder="Please specify"
            disabled={disabled}
            autofilled={!!financialOverview.objective_other_text}
            required={true}
            error={getFieldError("businessFinancialOverview.objective_other_text")}
          />
        )}
      </div>
    </div>
  );
}
