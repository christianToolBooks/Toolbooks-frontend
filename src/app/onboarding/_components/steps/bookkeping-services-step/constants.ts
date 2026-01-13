import {
  BookkeepingBenefit,
  BookkeepingFrequency,
  BookkeepingService,
  BookkeepingSoftware,
  BookkeepingStatus,
  BookkeepingUtilization,
  BusinessTaxForm,
  ImprovementsWanted,
  InhouseHandler,
  ReconcileFrequency,
  ReportsReviewed,
} from "@/src/types/questionnaire";

// Opciones tipadas
export const BOOKKEEPING_STATUS_OPTIONS: { value: BookkeepingStatus; label: string }[] = [
  { value: BookkeepingStatus.UP_TO_DATE, label: "Up to date" },
  { value: BookkeepingStatus.CATCH_UP_REQUIRED, label: "Catch-up work required" },
  { value: BookkeepingStatus.TRANSITIONING, label: "Transitioning between systems" },
  { value: BookkeepingStatus.UNSURE, label: "Unsure / need help assessing" },
];

export const BOOKKEEPING_SERVICES_OPTIONS: { value: BookkeepingService; label: string }[] = [
  { value: BookkeepingService.OUTSOURCED, label: "Outsourced" },
  { value: BookkeepingService.IN_HOUSE, label: "Prepared in house" },
];

export const IN_HOUSE_HANDLER_OPTIONS: { value: InhouseHandler; label: string }[] = [
  { value: InhouseHandler.CPA, label: "CPA" },
  { value: InhouseHandler.INTERNAL_STAFF, label: "Internal staff" },
  { value: InhouseHandler.OWNER, label: "Owner" },
  { value: InhouseHandler.VIRTUAL_ASSISTANT, label: "Virtual assistant" },
  { value: InhouseHandler.OTHER, label: "Other" },
];

export const BOOKKEEPING_FREQUENCIES: { value: BookkeepingFrequency; label: string }[] = [
  { value: BookkeepingFrequency.DAILY, label: "Daily" },
  { value: BookkeepingFrequency.WEEKLY, label: "Weekly" },
  { value: BookkeepingFrequency.MONTHLY, label: "Monthly" },
  { value: BookkeepingFrequency.QUARTERLY, label: "Quarterly" },
  { value: BookkeepingFrequency.ANNUALLY, label: "Annually" },
  { value: BookkeepingFrequency.OTHER, label: "Other" },
];

export const BOOKKEEPING_TOOLS_CHECKS = [
  { value: "software", label: "Software" },
  { value: "spreadsheets", label: "Spreadsheets (Excel, Google Sheets)" },
  { value: "other", label: "Other" },
  { value: "none", label: "None" },
] as const;
export type ToolKey = typeof BOOKKEEPING_TOOLS_CHECKS[number]["value"];

export const BOOKKEEPING_SOFTWARE: { value: BookkeepingSoftware; label: string }[] = [
  { value: BookkeepingSoftware.FRESHBOOKS, label: "Freshbooks" },
  { value: BookkeepingSoftware.QBD, label: "QuickBooks Desktop" },
  { value: BookkeepingSoftware.QBO, label: "QuickBooks Online" },
  { value: BookkeepingSoftware.SAGE, label: "Sage" },
  { value: BookkeepingSoftware.WAVE, label: "Wave" },
  { value: BookkeepingSoftware.XERO, label: "Xero" },
  { value: BookkeepingSoftware.ZOHO, label: "Zoho" },
];

export const RECONCILE_FREQUENCY_OPTIONS: { value: ReconcileFrequency; label: string }[] = [
  { value: ReconcileFrequency.MONTHLY, label: "Yes, monthly" },
  { value: ReconcileFrequency.QUARTERLY, label: "Yes, quarterly" },
  { value: ReconcileFrequency.OTHER, label: "Other" },
  { value: ReconcileFrequency.NO_OR_UNSURE, label: "No/unsure" },
];

export const UTILIZATION_OPTIONS: { value: BookkeepingUtilization; label: string }[] = [
  { value: BookkeepingUtilization.TAX, label: "Primarily for tax preparation" },
  { value: BookkeepingUtilization.REPORTING, label: "Used for financial reporting and decision-making" },
  { value: BookkeepingUtilization.TRACKING, label: "Tracking income and expenses online" },
  { value: BookkeepingUtilization.INVOICES, label: "Creating and managing invoices and payments" },
  { value: BookkeepingUtilization.PAYROLL, label: "Payroll and employee expense tracking" },
  { value: BookkeepingUtilization.RARELY, label: "Rarely used/not sure how to use it effectively" },
];

export const BENEFITS_OPTIONS: { value: BookkeepingBenefit; label: string }[] = [
  { value: BookkeepingBenefit.CASH_FLOW, label: "Gives me clarity on cash flow" },
  { value: BookkeepingBenefit.TAX_SEASON, label: "Helps me stay organized for tax season" },
  { value: BookkeepingBenefit.TRENDS, label: "Identifies trends or areas to cut costs" },
  { value: BookkeepingBenefit.COMPLIANCE, label: "Keeps records for compliance purposes" },
  { value: BookkeepingBenefit.METRICS, label: "Provides key metrics to understand my business" },
  { value: BookkeepingBenefit.MINIMAL, label: "Minimal benefits/mostly a chore" },
  { value: BookkeepingBenefit.STRATEGIC, label: "Helps me make strategic decisions" },
];

export const FINANCIAL_REPORTS_OPTIONS: { value: ReportsReviewed; label: string }[] = [
  { value: ReportsReviewed.PL, label: "Profit & Loss Statement" },
  { value: ReportsReviewed.BALANCE_SHEET, label: "Balance Sheet" },
  { value: ReportsReviewed.CASH_FLOW, label: "Cash Flow Statement" },
  { value: ReportsReviewed.AGING, label: "Aging Reports" },
  { value: ReportsReviewed.RECONCILIATIONS, label: "Reconciliations" },
  { value: ReportsReviewed.BANK_RECONCILIATION, label: "Bank Reconciliation" },
  { value: ReportsReviewed.NONE, label: "None/not sure" },
  { value: ReportsReviewed.OTHER, label: "Other" },
];

export const IMPROVEMENT_OPTIONS: { value: ImprovementsWanted; label: string }[] = [
  { value: ImprovementsWanted.INSIGHTS, label: "Provide clearer insights" },
  { value: ImprovementsWanted.EASE, label: "Be easier to use" },
  { value: ImprovementsWanted.INTEGRATE, label: "Integrate with other tools" },
  { value: ImprovementsWanted.SAVE_TIME, label: "Save time" },
  { value: ImprovementsWanted.ACCURACY, label: "Improve accuracy" },
  { value: ImprovementsWanted.TIMELY, label: "Provide more timely information" },
];

export const BUSINESS_TAX_FORMS = [
  { value: BusinessTaxForm.FORM_1120, label: "1120 (C-Corp)" },
  { value: BusinessTaxForm.FORM_1120S, label: "1120S (S-Corp)" },
  { value: BusinessTaxForm.FORM_1065, label: "1065 (Partnership)" },
  { value: BusinessTaxForm.FORM_990, label: "990 (Non-profit)" },
  { value: BusinessTaxForm.FORM_1041, label: "1041 (Estate/Trust)" },
  { value: BusinessTaxForm.SCH_C_1040, label: "1040 Schedule C" },
  { value: BusinessTaxForm.OTHER, label: "Other" },
];

export const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
] as const;

const NAME_TO_CODE: Record<string, (typeof US_STATES)[number]> = {
  "alabama": "AL",
  "alaska": "AK",
  "arizona": "AZ",
  "arkansas": "AR",
  "california": "CA",
  "colorado": "CO",
  "connecticut": "CT",
  "delaware": "DE",
  "florida": "FL",
  "georgia": "GA",
  "hawaii": "HI",
  "idaho": "ID",
  "illinois": "IL",
  "indiana": "IN",
  "iowa": "IA",
  "kansas": "KS",
  "kentucky": "KY",
  "louisiana": "LA",
  "maine": "ME",
  "maryland": "MD",
  "massachusetts": "MA",
  "michigan": "MI",
  "minnesota": "MN",
  "mississippi": "MS",
  "missouri": "MO",
  "montana": "MT",
  "nebraska": "NE",
  "nevada": "NV",
  "new hampshire": "NH",
  "new jersey": "NJ",
  "new mexico": "NM",
  "new york": "NY",
  "north carolina": "NC",
  "north dakota": "ND",
  "ohio": "OH",
  "oklahoma": "OK",
  "oregon": "OR",
  "pennsylvania": "PA",
  "rhode island": "RI",
  "south carolina": "SC",
  "south dakota": "SD",
  "tennessee": "TN",
  "texas": "TX",
  "utah": "UT",
  "vermont": "VT",
  "virginia": "VA",
  "washington": "WA",
  "west virginia": "WV",
  "wisconsin": "WI",
  "wyoming": "WY",
};

export function normalizeUSState(input: string | undefined | null): string {
  if (!input) return "";
  const trimmed = String(input).trim();
  const upper = trimmed.toUpperCase();

  if ((US_STATES as readonly string[]).includes(upper)) return upper;

  const key = trimmed.toLowerCase();
  return NAME_TO_CODE[key] ?? trimmed; 
}