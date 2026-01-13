// ---------------- ENUMS ----------------

export enum PositionTitle {
  Owner = "Owner",
  President = "President",
  CEO = "CEO",
  Director = "Director",
  Partner = "Partner",
  Proprietor = "Proprietor",
  SelfEmployed = "Self-Employed",
  Entrepreneur = "Entrepreneur",
  Other = "Other",
}

export enum BookkeepingStatus {
  UP_TO_DATE = "up_to_date",
  CATCH_UP_REQUIRED = "catch_up_work_required",
  NEW_BUSINESS = "new_business_or_none_presently",
}

export enum BusinessType {
  S_CORP = "s_corp",
  C_CORP = "c_corp",
  PARTNERSHIP = "partnership",
  SELF_EMPLOYED = "self_employed",
  UNDEFINED = "undefined",
}

export enum ContactMethod {
  EMAIL = "email",
  PHONE = "phone",
  MOBILE = "mobile",
  FAX = "fax",
}

export enum EmailKind {
  WORK = "work",
  PERSONAL = "personal",
  OTHER = "other",
}

export enum PhoneKind {
  MAIN = "main",
  MOBILE = "mobile",
  WORK = "work",
  FAX = "fax",
}

// ---------- ENUMS PARA ONBOARDING -----------

export enum SalesRevenueType {
  SERVICES = 'services',
  GOODS = 'goods',
  BOTH = 'both',
}

export enum AvgAnnualRevenueBracket {
  LESS_500K = 'less_500k',
  _500K_1M = '500k_1m',
  _1M_1_5M = '1m_1.5m',
  _1_5M_2M = '1.5m_2m',
  _2M_2_5M = '2m_2.5m',
  _2_5M_5M = '2.5m_5m',
  _5M_7_5M = '5m_7.5m',
  _7_5M_10M = '7.5m_10m',
  _10M_12_5M = '10m_12.5m',
  _12_5M_15M = '12.5m_15m',
  _15M_17_5M = '15m_17.5m',
  _17_5M_20M = '17.5m_20m',
  _20M_PLUS = '20m_plus',
}

export enum LifeCyclePhase {
  STARTUP = 'startup_formation',
  GROWTH = 'growth_expansion',
  MATURITY = 'maturity_stability',
  DIVERSIFICATION = 'diversification_evolution',
  EXIT = 'exit_succession',
}

export enum FinancialObjective {
  CLARITY = 'clarity',
  COMPLIANCE = 'compliance',
  DECISION = 'decision',
  EFFICIENCY = 'efficiency',
  GROWTH = 'growth',
  OTHER = 'other',
}

export enum AccountingBasisEnum {
  CASH = 'cash',
  ACCRUAL = 'accrual',
  BOTH = 'both',
  HYBRID_OTHER = 'hybrid_other',
}

export enum BusinessTaxForm {
  FORM_1120 = '1120',
  FORM_1120S = '1120S',
  FORM_1065 = '1065',
  FORM_990 = '990',
  FORM_1041 = '1041',
  SCH_C_1040 = '1040_SCH_C',
  OTHER = 'other',
}

export enum BookkeepingService {
  OUTSOURCED = 'outsourced',
  IN_HOUSE = 'in_house',
}

export enum InhouseHandler {
  CPA = 'CPA',
  INTERNAL_STAFF = 'Internal staff',
  OWNER = 'Owner',
  VIRTUAL_ASSISTANT = 'Virtual assistant',
  OTHER = 'Other',
}

export enum BookkeepingFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually',
  OTHER = 'other',
}

export enum BookkeepingSoftware {
  FRESHBOOKS = 'freshbooks',
  QBD = 'quickbooks_desktop',
  QBO = 'quickbooks_online',
  SAGE = 'sage',
  WAVE = 'wave',
  XERO = 'xero',
  ZOHO = 'zoho',
}

export enum ReconcileFrequency {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  OTHER = 'other',
  NO_OR_UNSURE = 'no_or_unsure',
}

export enum BookkeepingUtilization {
  TAX = 'tax',
  REPORTING = 'reporting',
  TRACKING = 'tracking',
  INVOICES = 'invoices',
  PAYROLL = 'payroll',
  RARELY = 'rarely',
}

export enum BookkeepingBenefit {
  CASH_FLOW = 'cash_flow',
  TAX_SEASON = 'tax_season',
  TRENDS = 'trends',
  COMPLIANCE = 'compliance',
  METRICS = 'metrics',
  MINIMAL = 'minimal',
  STRATEGIC = 'strategic',
}

export enum ReportsReviewed {
  PL = 'pl',
  BALANCE_SHEET = 'balance_sheet',
  CASH_FLOW = 'cash_flow',
  AGING = 'aging',
  RECONCILIATIONS = 'reconciliations',
  BANK_RECONCILIATION = 'bank_reconciliation',
  NONE = 'none',
  OTHER = 'other',
}

export enum ImprovementsWanted {
  INSIGHTS = 'insights',
  EASE = 'ease',
  INTEGRATE = 'integrate',
  SAVE_TIME = 'save_time',
  ACCURACY = 'accuracy',
  TIMELY = 'timely',
}

export enum VendorListFormat {
  SPREADSHEET = 'spreadsheet',
  EXPORT = 'export',
  MANUAL = 'manual',
}

export enum BillReceptionChannel {
  EMAIL = 'email',
  SCANNED = 'scanned',
  PAPER_MAIL = 'paper_mail',
  VENDOR_PORTALS = 'vendor_portals',
}

export enum BillPaymentFrequency {
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  AD_HOC = 'ad_hoc',
}

export enum AgingTracking {
  MANUALLY = 'manually',
  SOFTWARE = 'software',
  NOT_CURRENTLY = 'not_currently',
}

export enum CreationTrackingMethod {
  ACCOUNTING_SOFTWARE = 'accounting_software',
  INVOICING_TOOL = 'invoicing_tool',
  SPREADSHEET = 'spreadsheet',
  OTHER = 'other',
}

export enum CustomerListFormat {
  SPREADSHEET = 'spreadsheet',
  EXPORT = 'export',
  MANUAL = 'manual',
}

export enum InvoiceFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  PROJECT_BASED = 'project_based',
}

export enum DeliveryMethod {
  EMAIL = 'email',
  PDF = 'pdf',
  PORTAL = 'portal',
  OTHER = 'other',
}

export enum EmployeeListFormat {
  SPREADSHEET = 'spreadsheet',
  EXPORT = 'export',
  MANUAL = 'manual',
}

export enum NumEmployeesBand {
  ONE_TO_FIVE = '1-5',
  SIX_TO_TWENTY = '6-20',
  TWENTYONE_TO_FIFTY = '21-50',
  FIFTYONE_PLUS = '51+',
}

export enum PayFrequency {
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  OTHER = 'other',
}

export enum SalaryType {
  HOURLY = 'hourly',
  SALARIED = 'salaried',
  MIXED = 'mixed',
}

export enum YesNoNotSure {
  YES = 'yes',
  NO = 'no',
  NOT_SURE = 'not_sure',
}

// ---------------- INTERFACES ----------------
export interface Questionnaire {
  businessProfile: BusinessProfile;
  businessCompanyProfile: CompanyProfile;
  bookkeepingSettings: BookkeepingSettings;
  businessFinancialOverview: FinancialOverview;
  businessAddress: Address[];
  contact: Contact[];
}

export interface BusinessProfile {
  business_name: string;
  dba?: string;
  website?: string;
  hasInvoices: boolean;
  hasBills: boolean;
  hasPayroll: boolean;
  hasTaxReturnPreparation: boolean;
  userId?: string;
}

export interface CompanyProfile {
  business_type: BusinessType;
}

export interface BookkeepingSettings {
  status: BookkeepingStatus;
}


export interface Address {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  business_profile_id?: string;
  latitude?: number;
  longitude?: number;
  line1: string;
  line2?: string;
  city: string;
  country?: string;
  state: string;
  zip_code: string;
}

export interface Contact {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  business_profile_id?: string;
  first_name: string;
  last_name: string;
  title?: string;
  isPrimary: boolean;
  isAuthorized: boolean;
  preferred_contact_method: ContactMethod;
  preferred_email_kind?: EmailKind;
  preferred_phone_kind?: PhoneKind;
  phones: ContactPhones;
  emails: ContactEmails;
}

export interface ContactEmails {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  contact_id?: string;
  work: string;
  personal?: string;
  other?: string;
}

export interface ContactPhones {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  contact_id?: string;
  main?: string;
  mobile: string;
  work?: string;
  fax?: string;
}

export interface OnboardingBusinessProfile extends BusinessProfile {
  logo_url?: string | null;
  phone_number?: string;
  email?: string;
}

export interface OnboardingCompanyProfile extends CompanyProfile {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  business_profile_id?: string;
  industry?: string;
  ein?: string;
  naics_code?: string;
  start_date?: string;
  s_corp_election_date?: string;
  year_end_mmdd?: string;
  state_of_incorporation?: string;
  state_id_number?: string;
}

export type OnboardingAddress = Omit<Address, 'zip'> & {
  postalCode?: string;
  zip_code?: string;
};

export interface OnboardingEmergencyContact {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  business_profile_id?: string;
  first_name: string | null;
  last_name: string | null;
  relationship_or_position?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface FinancialOverview {
  business_profile_id?: string;
  avg_monthly_expenses: string | undefined;
}

export type OnboardingFinancialOverview = FinancialOverview & {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  sales_revenue_type?: SalesRevenueType;
  avg_annual_revenue_bracket?: AvgAnnualRevenueBracket;
  life_cycle_phase?: LifeCyclePhase;
  accounting_basis?: AccountingBasisEnum;
  objectives?: FinancialObjective[];
  objective_other_text?: string;
  business_challenges?: string;
};

export interface OnboardingTaxReturnPreparation {
  business?: {
    biz_tax_last_filed_year?: number;
    biz_last_filed_year?: number;
    biz_num_states_filed?: number;
    business_form_filed?: BusinessTaxForm;
    biz_tax_states?: string[];
  };
  individual?: {
    ind_tax_last_filed_year?: number;
    ind_last_filed_year?: number;
    ind_num_states_filed?: number;
    ind_tax_states?: string[];
  };
}

export interface TaxReturnPreparationApiResponse {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  business_profile_id?: string;
  type?: string;
  biz_tax_last_filed_year?: number | null;
  biz_num_states_filed?: number | null;
  business_form_filed?: string | null;
  biz_tax_states?: string[];
  ind_tax_last_filed_year?: number | null;
  ind_num_states_filed?: number | null;
  ind_tax_states?: string[];
}


export interface OnboardingBookkeepingSettings extends BookkeepingSettings {
  service?: BookkeepingService;
  inhouse_handlers?: InhouseHandler[];
  frequency?: BookkeepingFrequency;
  tools_software?: boolean;
  tools_software_used?: BookkeepingSoftware;
  tools_spreadsheets?: boolean;
  tools_other?: boolean;
  tools_none?: boolean;
  tools_other_text?: string;
  reconcile_frequency?: ReconcileFrequency;
  challenges_current_setup?: string;
  utilization?: BookkeepingUtilization[];
  benefits?: BookkeepingBenefit[];
  reports_reviewed?: ReportsReviewed[];
  report_other_text?: string;
  improvements_wanted?: ImprovementsWanted[];
}

export interface InvoicingSettings {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  business_profile_id?: string;
  creation_tracking_method?: CreationTrackingMethod;
  customer_list_format?: CustomerListFormat;
  invoice_frequency?: InvoiceFrequency;
  customizations_applied?: boolean;
  customization_specify?: string;
  delivery_method?: DeliveryMethod;
}

export interface BillPaySettings {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  business_profile_id?: string;
  vendor_list_format?: VendorListFormat;
  bill_reception_channels?: BillReceptionChannel[];
  scan_extract_auto?: boolean;
  payment_frequency?: BillPaymentFrequency;
  approval_workflow?: boolean;
  approval_specify?: string;
  aging_tracking?: AgingTracking;
}

export interface PayrollSettings {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  business_profile_id?: string;
  employee_list_format?: EmployeeListFormat;
  num_employees_band?: NumEmployeesBand;
  pay_frequency?: PayFrequency;
  salary_type?: SalaryType;
  benefits_or_deductions?: boolean;
  benefits_specify?: string;
  tax_compliance_support?: YesNoNotSure;
}

export interface OnboardingPayload {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  business_name?: string;
  dba?: string;
  logo_url?: string | null;
  phone_number?: string | null;
  email?: string | null;
  website?: string;
  userId?: string;
  onboarding_complete?: boolean;
  get_started_complete?: boolean;
  hasInvoices?: boolean;
  hasBills?: boolean;
  hasPayroll?: boolean;
  hasTaxReturnPreparation?: boolean;
  payarc_connect_enabled?: boolean;
  payarc_merchant_code?: string | null;
  payarc_merchant_id?: string | null;
  payarc_onboarding_status?: string;
  payarc_agreement_sent_at?: string | null;
  payarc_onboarded_at?: string | null;
  payarc_last_webhook?: string | null;
  default_statement_description?: string | null;
  businessProfile?: OnboardingBusinessProfile;
  businessCompanyProfile?: OnboardingCompanyProfile;
  companyProfile?: OnboardingCompanyProfile;
  businessAddresses?: OnboardingAddress[];
  addresses?: OnboardingAddress[];
  businessContacts?: Contact[];
  contacts?: Contact[];
  businessEmergencyContact?: OnboardingEmergencyContact;
  emergencyContact?: OnboardingEmergencyContact;
  businessFinancialOverview?: OnboardingFinancialOverview;
  financialOverview?: OnboardingFinancialOverview;
  taxReturnPreparation?: OnboardingTaxReturnPreparation;
  bookkeepingSettings?: OnboardingBookkeepingSettings;
  invoicingSettings?: InvoicingSettings;
  invoicingModuleSettings?: InvoicingSettings;
  billPaySettings?: BillPaySettings;
  billPayModuleSettings?: BillPaySettings;
  payrrollSettings?: PayrollSettings;
  payrollModuleSettings?: PayrollSettings;
}

export interface BusinessProfileResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  businessProfile: BusinessProfile; 
  business_name: string;
  dba?: string;
  logo_url?: string | null;
  phone_number?: string;
  email?: string;
  website?: string;     
  userId?: string;
  onboarding_complete: boolean;
  get_started_complete: boolean;
  hasInvoices: boolean;
  hasBills: boolean;
  hasPayroll: boolean;
  hasTaxReturnPreparation: boolean;
  addresses: Address[];                             
  contacts: Contact[];                              
  emergencyContact?: OnboardingEmergencyContact | null;
  bookkeepingSettings: OnboardingBookkeepingSettings | null;
  invoicingModuleSettings?: InvoicingSettings | null;
  billPayModuleSettings?: BillPaySettings | null;
  payrollModuleSettings?: PayrollSettings | null;
  taxReturnPreparation?: TaxReturnPreparationApiResponse | null;
  payarc_connect_enabled?: boolean;
  payarc_merchant_code?: string | null;
  payarc_merchant_id?: string | null;
  payarc_onboarding_status?: string;
  payarc_agreement_sent_at?: string | null;
  payarc_onboarded_at?: string | null;
  payarc_last_webhook?: string | null;
  default_statement_description?: string | null;
  companyProfile: OnboardingCompanyProfile;                   
  financialOverview: OnboardingFinancialOverview | null;
}

export interface FormState {
  currentStep: OnboardingStep
  data: Partial<OnboardingPayload>
  errors: ValidationError[]
  isSubmitting: boolean
  isValid: boolean
}

export type OnboardingStep = "business-info" | "business-details" | "bookkeeping-services" | "toolbooks-modules"

export interface ValidationError {
  field: string
  message: string
}

export type StepConfig = {
  id: OnboardingStep;
  title: string;
  description: string;
  fields: string[];
};

export interface EditableBusinessProfile {
  business_name: string
  dba: string
  logo_url: string | null
  email: string
  website: string
  phone_number: string
  companyProfile: {
    industry: string
    business_type: BusinessType
    ein: string
    naics_code: string
    start_date: string
    s_corp_election_date: string
    year_end_mmdd: string
    state_of_incorporation: string
    state_id_number: string
  }
}

export interface EditableContactsPayload {
  contacts: Contact[]
  emergencyContact: OnboardingEmergencyContact | null
}