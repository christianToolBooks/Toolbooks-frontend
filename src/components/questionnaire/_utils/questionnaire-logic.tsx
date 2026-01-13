/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorResponse } from "@/src/api/errorResponse";
import { CreateQuestionnaireResponse } from "@/src/lib/services/questionnarieService";
import { Questionnaire } from "@/src/types/questionnaire";

export interface ServiceLevel {
  name: string
  baseFee: number
  description: string
  minAmount: number
  maxAmount: number
  price?: string
  features?: string[]
  expenseRange?: string
}


export const serviceLevels: Record<string, ServiceLevel> = {
  Essential: { 
    name: "Essential", 
    baseFee: 149, 
    description: "Under $10,000",
    minAmount: 0,
    maxAmount: 10000,
    price: "$149/month",
    features: [
      "Monthly bookkeeping and reconciliation",
      "Financial statements",
      "Basic support"
    ],
    expenseRange: "$0 - $10,000 monthly expenses"
  },
  Professional: { 
    name: "Professional", 
    baseFee: 299, 
    description: "$10,001 - $25,000",
    minAmount: 10001,
    maxAmount: 25000,
    price: "$299/month",
    features: [
      "Everything in Essential",
      "Advanced reporting",
      "Priority support",
      "Quarterly reviews"
    ],
    expenseRange: "$10,001 - $25,000 monthly expenses"
  },
  "Premium 1": { 
    name: "Premium 1", 
    baseFee: 449, 
    description: "$25,001 - $50,000",
    minAmount: 25001,
    maxAmount: 50000,
    price: "$449/month",
    features: [
      "Everything in Professional",
      "Individual tax return service (for business owner) - INCLUDED",
      "Dedicated account manager"
    ],
    expenseRange: "$25,001 - $50,000 monthly expenses"
  },
  "Premium 2": { 
    name: "Premium 2", 
    baseFee: 549, 
    description: "$50,001 - $125,000",
    minAmount: 50001,
    maxAmount: 125000,
    price: "$549/month",
    features: [
      "Everything in Premium 1",
      "Enhanced financial analysis",
      "Custom integrations"
    ],
    expenseRange: "$50,001 - $125,000 monthly expenses"
  },
  "Premium 3": { 
    name: "Premium 3", 
    baseFee: 649, 
    description: "$125,001 - $200,000",
    minAmount: 125001,
    maxAmount: 200000,
    price: "$649/month",
    features: [
      "Everything in Premium 2",
      "Advanced forecasting",
      "CFO-level insights"
    ],
    expenseRange: "$125,001 - $200,000 monthly expenses"
  },
  Enterprise: { 
    name: "Enterprise", 
    baseFee: 0, 
    description: "Over $200,001",
    minAmount: 200001,
    maxAmount: Infinity,
    price: "Custom Pricing",
    features: [
      "Fully customized solution",
      "Dedicated team",
      "White-glove service"
    ],
    expenseRange: "Over $200,000 monthly expenses"
  },
}

export const taxPrices = {
  business: 1000,
  individual: 500,
};

export const modulePrices = {
  invoicing: 39,
  billPay: 39,
};

export interface QuoteCalculation {
  monthlyTotal: number;
  detailsHtml: string;
  isEnterprise: boolean;
  serviceLevel: string;
}

export function getServiceLevelFromAmount(expenseAmount: number): ServiceLevel {
  switch (true) {
    case expenseAmount <= 10000 :
      return serviceLevels.Essential;

    case expenseAmount <= 25000:
      return serviceLevels.Professional;

    case expenseAmount >= 25001 && expenseAmount <= 50000:
      return serviceLevels["Premium 1"];

    case expenseAmount >= 50001 && expenseAmount <= 125000:
      return serviceLevels["Premium 2"];

    case expenseAmount >= 120001 && expenseAmount <= 200000:
      return serviceLevels["Premium 3"];

    default:
      return serviceLevels.Enterprise;
  }
}

export function calculateQuote(
  formData: Partial<Questionnaire>,
  addOns: {
    addBusinessTax?: boolean;
    addIndividualTax?: boolean;
    invoicing?: boolean;
    billPay?: boolean;
  }
): QuoteCalculation {
  const expenseAmount =
    formData.businessFinancialOverview?.avg_monthly_expenses || "0";
  const serviceLevel = getServiceLevelFromAmount(parseFloat(expenseAmount));

  if (serviceLevel.name === "Enterprise") {
    return {
      monthlyTotal: 0,
      detailsHtml: "Enterprise pricing requires custom quote",
      isEnterprise: true,
      serviceLevel: serviceLevel.name,
    };
  }

  let monthlyTotal = serviceLevel.baseFee;
  let details = `${serviceLevel.name} Plan: $${serviceLevel.baseFee}/month\n`;

  if (serviceLevel.name === "Essential") {
    if (addOns.addBusinessTax) {
      monthlyTotal += taxPrices.business;
      details += `Business Tax Preparation: +$${taxPrices.business}\n`;
    }
    if (addOns.addIndividualTax) {
      monthlyTotal += taxPrices.individual;
      details += `Individual Tax Preparation: +$${taxPrices.individual}\n`;
    }
  } else if (serviceLevel.name === "Professional") {
    details += "Business Tax Preparation: Included\n";
    if (addOns.addIndividualTax) {
      monthlyTotal += taxPrices.individual;
      details += `Individual Tax Preparation: +$${taxPrices.individual}\n`;
    }
  } else {
    details += "Business & Individual Tax Preparation: Included\n";
  }

  if (addOns.invoicing) {
    monthlyTotal += modulePrices.invoicing;
    details += `Invoicing Module: +$${modulePrices.invoicing}/month\n`;
  }
  if (addOns.billPay) {
    monthlyTotal += modulePrices.billPay;
    details += `Bill Pay Module: +$${modulePrices.billPay}/month\n`;
  }

  return {
    monthlyTotal,
    detailsHtml: details,
    isEnterprise: false,
    serviceLevel: serviceLevel.name,
  };
}

export function validateStep(
  stepData: any,
  requiredFields: string[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const field of requiredFields) {
    if (
      !stepData[field] ||
      (typeof stepData[field] === "string" && stepData[field].trim() === "")
    ) {
      errors.push(`${field} is required`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

export function isObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

export function deepMerge<TBase extends Record<string, unknown>>(
  base: TBase,
  patch?: Partial<TBase>
): TBase {
  if (!patch) return base;
  const out: Record<string, unknown> = { ...base };
  for (const k of Object.keys(patch)) {
    const pv = (patch as Record<string, unknown>)[k];
    const bv = (base as Record<string, unknown>)[k];
    if (Array.isArray(pv)) {
      out[k] = pv;
    } else if (isObject(pv) && isObject(bv)) {
      out[k] = deepMerge(bv, pv);
    } else if (pv !== undefined) {
      out[k] = pv;
    }
  }
  return out as TBase;
}

export function isApiResponse(
  r: CreateQuestionnaireResponse | ErrorResponse
): r is CreateQuestionnaireResponse {
  return (r as CreateQuestionnaireResponse)?.data !== undefined;
}

export const handleExpenseChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  onChange: (field: string, value: number, section: "bookkeepingSettings" | "companyProfile" | "businessFinancialOverview") => void
) => {
  const value = e.target.value;
  const numericValue = value === "" ? 0 : parseFloat(value);
  if (!isNaN(numericValue)) {
    onChange("avg_monthly_expenses", numericValue, "businessFinancialOverview");
  }
};
