import { OnboardingStep, StepConfig } from "@/src/types/questionnaire";

export const ONBOARDING_STEPS: StepConfig[] = [
  {
    id: "business-info",
    title: "Business & User Information",
    description: "Tell us about your business and primary contact infrmation",
    fields: [
      "businessInfo",
      "primaryUser",
      "additionalUser1",
      "additionalUser2",
      "emergencyContact",
    ],
  },
  {
    id: "business-details",
    title: "About Your Business",
    description: "Help us understand your business structure and industry",
    fields: ["businessDetails"],
  },
  {
    id: "bookkeeping-services",
    title: "Bookkeeping & Tax Services",
    description: "Current bookkeeping practices and tax preparation needs",
    fields: ["bookkeepingServices", "taxReturnPreparation"],
  },
  {
    id: "toolbooks-modules",
    title: "ToolBooks Modules",
    description: "Configure payroll, invoicing, and bill pay modules",
    fields: ["payrollModule", "invoicingModule", "billPayModule"],
  },
];

export const getStepIndex = (step: OnboardingStep): number => {
  return ONBOARDING_STEPS.findIndex((s) => s.id === step);
};

export const getNextStep = (
  currentStep: OnboardingStep
): OnboardingStep | null => {
  const currentIndex = getStepIndex(currentStep);
  const nextIndex = currentIndex + 1;
  return nextIndex < ONBOARDING_STEPS.length
    ? ONBOARDING_STEPS[nextIndex].id
    : null;
};

export const getPreviousStep = (
  currentStep: OnboardingStep
): OnboardingStep | null => {
  const currentIndex = getStepIndex(currentStep);
  const prevIndex = currentIndex - 1;
  return prevIndex >= 0 ? ONBOARDING_STEPS[prevIndex].id : null;
};

// Form field options
export const CONTACT_METHODS = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "mobile", label: "Mobile" },
  { value: "fax", label: "Fax" },
];

export const EMPLOYEE_COUNTS = [
  { value: "1-5", label: "1-5" },
  { value: "6-20", label: "6-20" },
  { value: "21-50", label: "21-50" },
  { value: "51+", label: "51+" },
];

export const PAY_FREQUENCIES = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
  { value: "monthly", label: "Monthly" },
  { value: "other", label: "Other" },
];

export const BOOKKEEPING_FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annually", label: "Annually" },
  { value: "other", label: "Other" },
];

export const BOOKKEEPING_SOFTWARE = [
  { value: "freshbooks", label: "Freshbooks" },
  { value: "quickbooks_desktop", label: "QuickBooks Desktop" },
  { value: "quickbooks_online", label: "QuickBooks Online" },
  { value: "sage", label: "Sage" },
  { value: "wave", label: "Wave" },
  { value: "xero", label: "Xero" },
  { value: "zoho", label: "Zoho" },
];

export const EMAIL_KINDS = [
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
  { value: "other", label: "Other" },
];

export const PHONE_KINDS = [
  { value: "main", label: "Main" },
  { value: "mobile", label: "Mobile" },
  { value: "work", label: "Work" },
  { value: "fax", label: "Fax" },
];

export const SALES_REVENUE_TYPE = [
  { value: "services", label: "Services" },
  { value: "goods", label: "Goods" },
  { value: "both", label: "Both" },
]

export const AVG_ANNUAL_REVENUE = [
  { value: "less_500k", label: "Less than $500k" },
  { value: "500k_1m", label: "$500k - $1M" },
  { value: "1m_1.5m", label: "$1M - $1.5M" },
  { value: "1.5m_2m", label: "$1.5M - $2M" },
  { value: "2m_2.5m", label: "$2M - $2.5M" },
  { value: "2.5m_5m", label: "$2.5M - $5M" },
  { value: "5m_7.5m", label: "$5M - $7.5M" },
  { value: "7.5m_10m", label: "$7.5M - $10M" },
  { value: "10m_12.5m", label: "$10M - $12.5M" },
  { value: "12.5m_15m", label: "$12.5M - $15M" },
  { value: "15m_17.5m", label: "$15M - $17.5M" },
  { value: "17.5m_20m", label: "$17.5M - $20M" },
  { value: "20m_plus", label: "More than $20M" },
]

export const LIFE_CYCLE_PHASE = [
  { value: "startup_formation", label: "Startup" },
  { value: "growth_expansion", label: "Growth" },
  { value: "maturity_stability", label: "Maturity" },
  { value: "diversification_evolution", label: "Diversification" },
  { value: "exit_succession", label: "Exit" },
]

export const ACCOUNTING_BASIS = [
  { value: "cash", label: "Cash" },
  { value: "accrual", label: "Accrual" },
  { value: "both", label: "Both" },
  { value: "hybrid_other", label: "Hybrid/Other" },
];

export const OBJECTIVES_OPTIONS = [
  { value: "clarity", label: "Clarity" },
  { value: "compliance", label: "Compliance" },
  { value: "decision", label: "Business Decision" },
  { value: "growth", label: "Growth" },
  { value: "efficiency", label: "Efficiency" },
  { value: "other", label: "Other" },
];

 export const getByPath = (obj: unknown, path: string): unknown => {
    return path.split(".").reduce<unknown>((acc, key) => {
      if (acc == null) return undefined;
      const idx = Number.isInteger(Number(key)) ? Number(key) : key;
      return (acc as Record<string, unknown>)?.[idx];
    }, obj);
  };