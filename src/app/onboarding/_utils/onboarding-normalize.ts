// app/onboarding/_utils/onboarding-normalize.ts
import {
  OnboardingPayload,
  OnboardingBusinessProfile,
  OnboardingCompanyProfile,
  OnboardingAddress,
  OnboardingEmergencyContact,
  OnboardingBookkeepingSettings,
  OnboardingTaxReturnPreparation,
  InvoicingSettings,
  BillPaySettings,
  PayrollSettings,
  Contact,
  ContactMethod,
  EmailKind,
  PhoneKind,
} from "@/src/types/questionnaire";
import { normalizeUSState } from "../_components/steps/bookkeping-services-step/constants";

/* --------- Tipos tolerantes a lo que devuelve el server --------- */
type ServerAddress = {
  line1?: string;
  address_line1?: string;
  line2?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  zip_code?: string;
};

type ServerPhones = {
  main?: string;
  mobile?: string;
  work?: string;
  fax?: string;
};

type ServerEmails = {
  work?: string;
  personal?: string;
  other?: string;
  email?: string;
  work_email?: string;
  personal_email?: string;
  other_email?: string;
};

type ServerContact = {
  first_name?: string;
  last_name?: string;
  title?: string;
  isPrimary?: boolean;
  isAuthorized?: boolean;
  preferred_contact_method?: ContactMethod;
  preferred_email_kind?: unknown;
  preferred_phone_kind?: unknown;
  phones?: ServerPhones;
  main_phone?: string;
  mobile_phone?: string;
  work_phone?: string;
  fax?: string;
  emails?: ServerEmails;
};

type ServerCompanyProfile = Partial<OnboardingCompanyProfile>;
type ServerBookkeepingSettings = Partial<OnboardingBookkeepingSettings>;
type ServerTaxReturnPreparation = Partial<OnboardingTaxReturnPreparation>;
type ServerInvoicingSettings = Partial<InvoicingSettings>;
type ServerBillPaySettings = Partial<BillPaySettings>;
type ServerPayrollSettings = Partial<PayrollSettings>;
type ServerEmergencyContact = Partial<OnboardingEmergencyContact>;

type ServerQuestionnaire = {
  business_name?: string;
  businessName?: string;
  dba?: string;
  website?: string;
  email?: string;
  phone_number?: string;
  phoneNumber?: string;
  logo_url?: string | null;
  hasInvoices?: boolean;
  hasBills?: boolean;
  hasPayroll?: boolean;
  hasTaxReturnPreparation?: boolean;
  addresses?: ServerAddress[];
  contacts?: ServerContact[];
  companyProfile?: ServerCompanyProfile;
  businessCompanyProfile?: ServerCompanyProfile;
  bookkeepingSettings?: ServerBookkeepingSettings;
  taxReturnPreparation?: ServerTaxReturnPreparation;
  payrollModuleSettings?: ServerPayrollSettings;
  payrrollSettings?: ServerPayrollSettings;
  invoicingModuleSettings?: ServerInvoicingSettings;
  invoicingSettings?: ServerInvoicingSettings;
  billPayModuleSettings?: ServerBillPaySettings;
  billPaySettings?: ServerBillPaySettings;
  emergencyContact?: ServerEmergencyContact;
  businessEmergencyContact?: ServerEmergencyContact;
};

/* -------------------- helpers -------------------- */
const toStr = (v: unknown): string =>
  typeof v === "string" ? v : v == null ? "" : String(v);

const pick = <T>(...vals: ReadonlyArray<T | undefined>): T | undefined =>
  vals.find((v) => v !== undefined);

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const isServerQuestionnaire = (v: unknown): v is ServerQuestionnaire =>
  isObject(v); // basta con comprobar que es objeto para poder mapear de forma defensiva

const mapAddress = (a: ServerAddress): OnboardingAddress => ({
  line1: toStr(pick(a.line1, a.address_line1)),
  line2: toStr(pick(a.line2, a.address_line2)),
  city: toStr(a.city),
  state: normalizeUSState(a.state), 
  country: toStr(a.country),
  zip_code: toStr(pick(a.zip_code, a.zip_code)),
  postalCode: toStr(pick(a.postalCode, a.postalCode)), 
});

const mapContact = (c: ServerContact): Contact => ({
  first_name: toStr(c.first_name),
  last_name: toStr(c.last_name),
  title: toStr(c.title),
  isPrimary: Boolean(c.isPrimary),
  isAuthorized: Boolean(c.isAuthorized),
  preferred_contact_method: (c.preferred_contact_method ??
    ContactMethod.EMAIL) as ContactMethod,
  preferred_email_kind: c.preferred_email_kind as EmailKind,
  preferred_phone_kind: c.preferred_phone_kind as PhoneKind,
  phones: {
    main: toStr(pick(c.phones?.main, c.main_phone)),
    mobile: toStr(pick(c.phones?.mobile, c.mobile_phone)),
    work: toStr(pick(c.phones?.work, c.work_phone)),
    fax: toStr(pick(c.phones?.fax, c.fax)),
  },
  emails: {
    work: toStr(pick(c.emails?.work, c.emails?.email, c.emails?.work_email)),
    personal: toStr(pick(c.emails?.personal, c.emails?.personal_email)),
    other: toStr(pick(c.emails?.other, c.emails?.other_email)),
  },
});

/* -------------------- normalizer con firma compatible -------------------- */
export function normalizeFromServer(
  server: unknown
): Partial<OnboardingPayload> {
  if (!isServerQuestionnaire(server)) return {};

  const businessProfile: OnboardingBusinessProfile = {
    business_name: toStr(pick(server.business_name, server.businessName)),
    dba: toStr(server.dba),
    website: toStr(server.website),
    phone_number: toStr(pick(server.phone_number, server.phoneNumber)),
    email: toStr(server.email),
    logo_url: server.logo_url ?? "",
    hasInvoices: Boolean(server.hasInvoices),
    hasBills: Boolean(server.hasBills),
    hasPayroll: Boolean(server.hasPayroll),
    hasTaxReturnPreparation: Boolean(server.hasTaxReturnPreparation),
  };

  const businessAddresses: OnboardingAddress[] = Array.isArray(server.addresses)
    ? server.addresses.map(mapAddress)
    : [];

  let businessContacts: Contact[] = Array.isArray(server.contacts)
    ? server.contacts.map(mapContact)
    : [];

  if (businessContacts.length === 0) {
    businessContacts = [
      {
        first_name: "",
        last_name: "",
        title: "",
        isPrimary: true,
        isAuthorized: true,
        preferred_contact_method: ContactMethod.EMAIL,
        phones: { main: "", mobile: "", work: "", fax: "" },
        emails: { work: "", personal: "", other: "" },
      },
    ];
  }

  const cp = pick(server.companyProfile, server.businessCompanyProfile) ?? {};
  const businessCompanyProfile: OnboardingCompanyProfile = {
    business_type: (cp as OnboardingCompanyProfile).business_type!,
    industry: toStr((cp as OnboardingCompanyProfile).industry),
    ein: toStr((cp as OnboardingCompanyProfile).ein),
    naics_code: toStr((cp as OnboardingCompanyProfile).naics_code),
    start_date: toStr((cp as OnboardingCompanyProfile).start_date),
    s_corp_election_date: toStr(
      (cp as OnboardingCompanyProfile).s_corp_election_date
    ),
    year_end_mmdd: toStr((cp as OnboardingCompanyProfile).year_end_mmdd),
    state_of_incorporation: toStr(
      (cp as OnboardingCompanyProfile).state_of_incorporation
    ),
    state_id_number: toStr((cp as OnboardingCompanyProfile).state_id_number),
  };

  const bookkeepingSettings = (server.bookkeepingSettings ??
    {}) as OnboardingBookkeepingSettings;

  // ✅ Asegurar estructura completa para taxReturnPreparation
  const taxReturnPreparation: OnboardingTaxReturnPreparation = {
    business: {
      biz_last_filed_year: server.taxReturnPreparation?.business?.biz_last_filed_year,
      biz_num_states_filed: server.taxReturnPreparation?.business?.biz_num_states_filed,
      business_form_filed: server.taxReturnPreparation?.business?.business_form_filed,
      biz_tax_states: Array.isArray(server.taxReturnPreparation?.business?.biz_tax_states)
        ? server.taxReturnPreparation.business.biz_tax_states
        : [],
    },
    individual: {
      ind_last_filed_year: server.taxReturnPreparation?.individual?.ind_last_filed_year,
      ind_num_states_filed: server.taxReturnPreparation?.individual?.ind_num_states_filed,
      ind_tax_states: Array.isArray(server.taxReturnPreparation?.individual?.ind_tax_states)
        ? server.taxReturnPreparation.individual.ind_tax_states
        : [],
    },
  };

  const payrrollSettings = (pick(
    server.payrollModuleSettings,
    server.payrrollSettings
  ) ?? {}) as PayrollSettings;

  const invoicingSettings = (pick(
    server.invoicingModuleSettings,
    server.invoicingSettings
  ) ?? {}) as InvoicingSettings;

  const billPaySettings = (pick(
    server.billPayModuleSettings,
    server.billPaySettings
  ) ?? {}) as BillPaySettings;

  const businessEmergencyContact = (pick(
    server.emergencyContact,
    server.businessEmergencyContact
  ) ?? {}) as OnboardingEmergencyContact;

  return {
    businessProfile,
    businessAddresses,
    businessContacts,
    businessEmergencyContact,
    businessCompanyProfile,
    bookkeepingSettings,
    taxReturnPreparation, // ✅ Siempre incluir con estructura completa
    payrrollSettings,
    invoicingSettings,
    billPaySettings,
  };
}
