/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Contact,
  OnboardingPayload,
} from "@/src/types/questionnaire";

/* -------------------- strip meta -------------------- */

const DROP_KEYS = new Set([
  "id",
  "createdAt",
  "updatedAt",
  "contact_id",
  "business_profile_id",
] as const);

type DropKeys = typeof DROP_KEYS extends Set<infer T> ? T : never;

type StripMeta<T> = T extends object
  ? T extends Array<infer U>
    ? StripMeta<U>[]
    : { [K in keyof T as K extends DropKeys ? never : K]: StripMeta<T[K]> }
  : T;

function stripMeta<T extends object>(obj: T): StripMeta<T> {
  if (!obj || typeof obj !== "object") return obj as StripMeta<T>;
  if (Array.isArray(obj)) return obj.map((i) => stripMeta(i)) as StripMeta<T>;

  const out = {} as StripMeta<T>;
  for (const [k, v] of Object.entries(obj)) {
    if (DROP_KEYS.has(k as DropKeys)) continue;
    if (v && typeof v === "object") {
      (out as any)[k] = stripMeta(v as object);
    } else if (v !== undefined) {
      (out as any)[k] = v;
    }
  }
  return out;
}

const norm = (v?: string | null) => {
  const s = (v ?? "").trim();
  return s.length ? s : null;
};

// Helper to check if a value is "empty" (should not be sent)
const isEmpty = (v: any): boolean => {
  if (v === null || v === undefined) return true;
  if (typeof v === 'string' && v.trim() === '') return true;
  if (Array.isArray(v) && v.length === 0) return true;
  return false;
};

// Helper to clean an object by removing empty values
const cleanObject = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj;

  const cleaned: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (!isEmpty(value)) {
      cleaned[key] = value;
    }
  }
  
  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
};

/* -------------------- serializer -------------------- */

export function serializeForApi(
  input: Partial<OnboardingPayload>
): OnboardingPayload {
  const d = stripMeta(input) as Partial<OnboardingPayload>;

  const ecRaw = d.businessEmergencyContact;
  const ecNormalized = ecRaw
    ? {
        first_name: norm(ecRaw.first_name),
        last_name: norm(ecRaw.last_name),
        relationship_or_position: norm(ecRaw.relationship_or_position),
        phone: norm(ecRaw.phone),
        email: norm(ecRaw.email),
      }
    : undefined;

  const hasEmergency =
    !!ecNormalized && Object.values(ecNormalized).some(Boolean);

  const businessProfile = {
    business_name: d.businessProfile?.business_name ?? null,
    dba: d.businessProfile?.dba ?? null,
    logo_url: norm(d.businessProfile?.logo_url),
    phone_number: d.businessProfile?.phone_number ?? null,
    email: d.businessProfile?.email ?? null,
    website: d.businessProfile?.website ?? null,
    hasInvoices: !!d.businessProfile?.hasInvoices,
    hasBills: !!d.businessProfile?.hasBills,
    hasPayroll: !!d.businessProfile?.hasPayroll,
    hasTaxReturnPreparation: !!d.businessProfile?.hasTaxReturnPreparation,
  };

  // Extract business flags for conditional logic
  const businessFlags = {
    hasInvoices: businessProfile.hasInvoices,
    hasBills: businessProfile.hasBills,
    hasPayroll: businessProfile.hasPayroll,
    hasTaxReturnPreparation: businessProfile.hasTaxReturnPreparation,
  };

  const businessCompanyProfile = cleanObject({
    industry: d.businessCompanyProfile?.industry ?? null,
    business_type: d.businessCompanyProfile?.business_type || null,
    ein: d.businessCompanyProfile?.ein ?? null,
    naics_code: d.businessCompanyProfile?.naics_code ?? null,
    start_date: d.businessCompanyProfile?.start_date ?? null,
    s_corp_election_date: d.businessCompanyProfile?.s_corp_election_date ?? null,
    year_end_mmdd: d.businessCompanyProfile?.year_end_mmdd ?? null,
    state_of_incorporation: d.businessCompanyProfile?.state_of_incorporation ?? null,
    state_id_number: d.businessCompanyProfile?.state_id_number ?? null,
  });

  const businessAddresses = Array.isArray(d.businessAddresses)
    ? d.businessAddresses.map((a) => ({
        line1: a?.line1 ?? null,
        line2: a?.line2 ?? null,
        city: a?.city ?? null,
        state: a?.state ?? null,
        postalCode: a?.postalCode ?? null,
        country: a?.country ?? "US",
        zip_code: a?.zip_code ?? null,
      }))
    : [];

  const businessContacts = Array.isArray(d.businessContacts)
    ? d.businessContacts.map((c: Contact) => ({
        first_name: c.first_name ?? null,
        last_name: c.last_name ?? null,
        title: c.title ?? null,
        isPrimary: !!c.isPrimary,
        isAuthorized: !!c.isAuthorized,
        preferred_contact_method: c.preferred_contact_method || null,
        preferred_email_kind: c.preferred_email_kind || null,
        preferred_phone_kind: c.preferred_phone_kind || null,
        phones: {
          main: c.phones?.main ?? null,
          mobile: c.phones?.mobile ?? null,
          work: c.phones?.work ?? null,
          fax: c.phones?.fax ?? null,
        },
        emails: {
          work: c.emails?.work ?? null,
          personal: c.emails?.personal ?? null,
          other: c.emails?.other ?? null,
        },
      }))
    : [];

  const businessEmergencyContact = {
    first_name: d.businessEmergencyContact?.first_name ?? null,
    last_name: d.businessEmergencyContact?.last_name ?? null,
    relationship_or_position:
      d.businessEmergencyContact?.relationship_or_position ?? null,
    phone: d.businessEmergencyContact?.phone ?? null,
    email: d.businessEmergencyContact?.email ?? null,
  };

  // Build financial overview - ALWAYS required with proper defaults
  const financialOverviewRaw = d.businessFinancialOverview;
  const businessFinancialOverview = {
    sales_revenue_type: financialOverviewRaw?.sales_revenue_type || null,
    avg_annual_revenue_bracket: financialOverviewRaw?.avg_annual_revenue_bracket || null,
    avg_monthly_expenses: financialOverviewRaw?.avg_monthly_expenses 
      ? String(financialOverviewRaw.avg_monthly_expenses) 
      : null,
    life_cycle_phase: financialOverviewRaw?.life_cycle_phase || null,
    accounting_basis: financialOverviewRaw?.accounting_basis || null,
    objectives: Array.isArray(financialOverviewRaw?.objectives) && financialOverviewRaw.objectives.length > 0
      ? financialOverviewRaw.objectives
      : [],
    objective_other_text: financialOverviewRaw?.objective_other_text ?? null,
    business_challenges: financialOverviewRaw?.business_challenges ?? null,
  };

  // Build bookkeeping settings - ALWAYS required with proper defaults
  const bookkeepingRaw = d.bookkeepingSettings;
  const bookkeepingSettings = {
    status: bookkeepingRaw?.status || null,
    service: bookkeepingRaw?.service || null,
    inhouse_handlers: Array.isArray(bookkeepingRaw?.inhouse_handlers) && bookkeepingRaw.inhouse_handlers.length > 0
      ? bookkeepingRaw.inhouse_handlers
      : [],
    frequency: bookkeepingRaw?.frequency || null,
    tools_software: bookkeepingRaw?.tools_software ?? false,
    tools_software_used: bookkeepingRaw?.tools_software_used || null,
    tools_spreadsheets: bookkeepingRaw?.tools_spreadsheets ?? false,
    tools_other: bookkeepingRaw?.tools_other ?? false,
    tools_other_text: bookkeepingRaw?.tools_other_text ?? null,
    tools_none: bookkeepingRaw?.tools_none ?? false,
    reconcile_frequency: bookkeepingRaw?.reconcile_frequency || null,
    challenges_current_setup: bookkeepingRaw?.challenges_current_setup ?? null,
    utilization: Array.isArray(bookkeepingRaw?.utilization) && bookkeepingRaw.utilization.length > 0
      ? bookkeepingRaw.utilization
      : [],
    benefits: Array.isArray(bookkeepingRaw?.benefits) && bookkeepingRaw.benefits.length > 0
      ? bookkeepingRaw.benefits
      : [],
    reports_reviewed: Array.isArray(bookkeepingRaw?.reports_reviewed) && bookkeepingRaw.reports_reviewed.length > 0
      ? bookkeepingRaw.reports_reviewed
      : [],
    improvements_wanted: Array.isArray(bookkeepingRaw?.improvements_wanted) && bookkeepingRaw.improvements_wanted.length > 0
      ? bookkeepingRaw.improvements_wanted
      : [],
    report_other_text: bookkeepingRaw?.report_other_text ?? null,
  };

  // Build the base payload with required sections
  const payload: any = {
    businessProfile,
    ...(businessCompanyProfile ? { businessCompanyProfile } : {}),
    businessAddresses,
    businessContacts,
    businessFinancialOverview,
    bookkeepingSettings,
    ...(hasEmergency ? { businessEmergencyContact: ecNormalized } : {}),
  };

  // ✅ Tax Return Preparation - SIEMPRE incluir (asumimos que siempre es true)
  const taxBusiness = d.taxReturnPreparation?.business;
  const taxIndividual = d.taxReturnPreparation?.individual;
  
  // Helper para convertir a número válido o null
  const toValidNumber = (value: any): number | null => {
    if (value === null || value === undefined || value === "") return null;
    const num = typeof value === "string" ? parseInt(value, 10) : Number(value);
    return isNaN(num) ? null : num;
  };

  payload.taxReturnPreparation = {
    business: {
      biz_last_filed_year: toValidNumber(taxBusiness?.biz_last_filed_year),
      biz_num_states_filed: toValidNumber(taxBusiness?.biz_num_states_filed),
      business_form_filed: taxBusiness?.business_form_filed ?? null,
      biz_tax_states: Array.isArray(taxBusiness?.biz_tax_states) && taxBusiness.biz_tax_states.length > 0
        ? taxBusiness.biz_tax_states
        : [],
    },
    individual: {
      ind_last_filed_year: toValidNumber(taxIndividual?.ind_last_filed_year),
      ind_num_states_filed: toValidNumber(taxIndividual?.ind_num_states_filed),
      ind_tax_states: Array.isArray(taxIndividual?.ind_tax_states) && taxIndividual.ind_tax_states.length > 0
        ? taxIndividual.ind_tax_states
        : [],
    },
  };

  // Invoicing Settings - only if flag is true
  if (businessFlags.hasInvoices) {
    const invoicing = {
      creation_tracking_method: d.invoicingSettings?.creation_tracking_method || null,
      customer_list_format: d.invoicingSettings?.customer_list_format || null,
      invoice_frequency: d.invoicingSettings?.invoice_frequency || null,
      customizations_applied: d.invoicingSettings?.customizations_applied ?? false,
      customization_specify: d.invoicingSettings?.customization_specify ?? null,
      delivery_method: d.invoicingSettings?.delivery_method || null,
    };

    payload.invoicingSettings = invoicing;
  }

  // Bill Pay Settings - only if flag is true
  if (businessFlags.hasBills) {
    const billPay = {
      vendor_list_format: d.billPaySettings?.vendor_list_format || null,
      bill_reception_channels: Array.isArray(d.billPaySettings?.bill_reception_channels) && 
        d.billPaySettings.bill_reception_channels.length > 0
        ? d.billPaySettings.bill_reception_channels
        : [],
      scan_extract_auto: d.billPaySettings?.scan_extract_auto ?? false,
      payment_frequency: d.billPaySettings?.payment_frequency || null,
      approval_workflow: d.billPaySettings?.approval_workflow ?? false,
      approval_specify: d.billPaySettings?.approval_specify ?? null,
      aging_tracking: d.billPaySettings?.aging_tracking || null,
    };

    payload.billPaySettings = billPay;
  }

  // Payroll Settings - only if flag is true
  if (businessFlags.hasPayroll) {
    const payroll = {
      employee_list_format: d.payrrollSettings?.employee_list_format || null,
      num_employees_band: d.payrrollSettings?.num_employees_band || null,
      pay_frequency: d.payrrollSettings?.pay_frequency || null,
      salary_type: d.payrrollSettings?.salary_type || null,
      benefits_or_deductions: d.payrrollSettings?.benefits_or_deductions ?? false,
      benefits_specify: d.payrrollSettings?.benefits_specify ?? null,
      tax_compliance_support: d.payrrollSettings?.tax_compliance_support || null,
    };

    payload.payrrollSettings = payroll;
  }

  return payload as OnboardingPayload;
}