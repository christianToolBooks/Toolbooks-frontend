export enum PayarcSecCode {
  MANUAL = "manual",
  PHONE = "phone",
  MAIL = "mail",
  INTERNET = "internet",
}


export enum PayarcCardSourceEnum {
  MANUAL = "manual",
  PHONE = "phone",
  MAIL = "mail",
  INTERNET = "internet",
}

export interface CreateCardToPay {
  payarc_card_source: PayarcCardSourceEnum;
  card_number: number;
  exp_month: string;
  exp_year: string;
  cvv: string;
  card_holder_name: string;
  is_default?: boolean;
}

export interface PaymentCardResponse {
  id: string;
  userId: string;
  toolbooks_customerId: string;
  payarc_customer_id: string;
  payarc_card_id: string;
  card_brand: string;
  payarc_card_source: string;
  token_id: string;
  brand: string;
  card_holder_name: string;
  card_type: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  is_default: boolean;
  address_line_1: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  createdAt: string; 
  updatedAt: string;
}

export interface UpdateCardToPay extends Omit<CreateCardToPay, "is_default"> {
  card_id: string;
}

export interface CreateChargeCard {
  amount: number;
  currency: string;
  statement_description?: string;
  purpose?: string;
}

export interface CreateACHToPay {
  account_number: string;
  routing_number: string;
  first_name: string;
  last_name: string;
  account_type: PayarcAccountType;
  sec_code?: PayarcSecCodeToACHForm;
  customer_id: string;
  company_name?: string;
}

export interface ACHToPayResponse {
  id: string;
  userId: string;
  toolbooks_customerId: string;
  payarc_customer_id: string;
  payarc_bank_account_id: string;
  company_name: string;
  first_name: string;
  last_name: string;
  account_type: string;
  account_number: string;
  account_last4: string;
  routing_number: string;
  sec_code: string;
  is_default: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}


export interface UpdateACHToPay {
  first_name: string;
  last_name: string;
  account_type: string;
}

export interface CreateChargeACH {
  amount: number;
  currency: string;
  type: string;
  purpose?: string;
}

export enum AddonCode {
  // MI_CASA = "mi_casa",
  PAYROLL_CONNECT = "payroll_connect",
  PAYROLL_COMPLETE = "payroll_complete",
  INVOICING = "invoicing",
  BILL_PAY = "bill_pay",
  INV_BP_BUNDLE = "inv_bp_bundle",
}

export enum typePayMethod {
  CARD = "card",
  ACH = "ach",
}

export enum PayarcSecCodeToACHForm {
  CCD = 'CCD',
  PPD = 'PPD',
  TEL = 'TEL',
  WEB = 'WEB',
}

export enum BankToPayTypeEnum {
DEBIT = "debit",
CREDIT = "credit",
}

export enum tiers {
  ESSENTIAL = "essential",
  PROFESSIONAL = "professional",
  PREMIUM1 = "premium1",
  PREMIUM2 = "premium2",
  PREMIUM3 = "premium3",
  ENTERPRISE = "enterprise",
}

export enum termOptions {
  MONTHLY = "monthly",
  ANNUAL = "annual",
  MONTHS_24 = "months_24",
}

export enum PayarcAccountType {
  PERSONAL_CHECKING = "Personal Checking",
  PERSONAL_SAVINGS = "Personal Savings",
  BUSINESS_CHECKING = "Business Checking",
  BUSINESS_SAVINGS = "Business Savings",
}

export interface getPreviewQuote {
  tier: tiers;
  addons: AddonCode[];
  term: termOptions;
  employees: number;
  states: number;
}

export interface PreviewSubscriptionResponse {
  plan_month_cents: number;
  addons_month_cents: number;
  monthly_total_cents: number;
  months: number;
  discount_percent: number;
  period_total_cents: number;     
  tier: string;                    
  addons: AddonCode[];                
  term: string;                    
  variables: {
    employees: number;             
    states: number;                
  };
}

export interface CreateSubscription {
  tier: tiers;
  addons: AddonCode[];
  term: string;
  employees?: number;
  states?: number;
  typePayMethod: typePayMethod;
  isTrial?: boolean;
  type_ach_bank?: BankToPayTypeEnum;
}

export enum SubscriptionStatus {
  TRIALING = "trialing",
  ACTIVE = "active",
  PAST_DUE = "past_due",
  CANCELED = "canceled",
  PENDING_PAYMENT = "pending_payment",
}

export interface SubscriptionResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  businessProfileId: string;
  businessProfile: string;
  userId: string;
  plan_code: tiers;
  term: termOptions;
  status: SubscriptionStatus;
  plan_month_cents: number;
  addons_month_cents: number;
  monthly_total_cents: string;
  discount_percent: string;
  period_total_cents: number;
  months: number;
  trial_end_at: string;
  started_at: Date;
  current_period_start: Date;
  current_period_end: Date;
  next_invoice_at: Date | null;
  cancel_at_period_end: boolean;
  cancel_reason: string | null;
  canceled_at: Date | null;
  pending_effective_at: Date | null;
  pending_change_payload: string | null;
  type_pay_method: typePayMethod;
  dunning_status: string;
  dunning_retry_count: number;
  dunning_last_attempt_at: Date | null;
  dunning_next_attempt_at: Date | null;
  price_lock_cents: number | null;
  addons: {
    id: string;
    subscriptionId: string;
    addon_code: string;
    monthly_cents: number;
    employees: number | null;
    states: number | null;
    quantity: number | null;
  }[];
}

export interface CreateCustomerToPay {
  name: string,
  email: string,
  send_email_address: string,
  country: string,
  address_line_1: string,
  city: string,
  latitude?: number,
  longitude?: number,
  state: string,
  zip_code: string,
  phone_number: string
}

export interface CustomerResponse {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone_number: string;
  send_email_address: string;
  address_line_1: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  payarc_customer_id: string;
  token_id: string | null;
  invoice_prefix: string | null;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface CancelSubscription {
  cancel_at_period_end?: boolean;
  reason?: string;
}