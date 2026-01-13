import { BusinessType } from "@/src/types/questionnaire";

export const BUSINESS_TYPES: { value: BusinessType; label: string }[] = [
  { value: BusinessType.S_CORP, label: "S Corporation" },
  { value: BusinessType.C_CORP, label: "C Corporation" },
  { value: BusinessType.PARTNERSHIP, label: "Partnership" },
  { value: BusinessType.SELF_EMPLOYED, label: "Self-employed / Sole Proprietor" },
];

export const INDUSTRIES = [
  { value: "accounting", label: "Accounting" },
  { value: "agriculture", label: "Agriculture" },
  { value: "automotive", label: "Automotive" },
  { value: "construction", label: "Construction" },
  { value: "consulting", label: "Consulting" },
  { value: "education", label: "Education" },
  { value: "finance", label: "Finance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "hospitality", label: "Hospitality" },
  { value: "legal", label: "Legal Services" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "real_estate", label: "Real Estate" },
  { value: "retail", label: "Retail" },
  { value: "technology", label: "Technology" },
  { value: "transportation", label: "Transportation" },
  { value: "other", label: "Other" },
] as const;

export const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
] as const;
