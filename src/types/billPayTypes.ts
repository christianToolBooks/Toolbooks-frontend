export enum BillAgingStage {
  CURRENT = "current",
  DUE_SOON = "due_soon",
  OVERDUE = "overdue",
}

export enum BillFinancialStatus {
  UNPAID = "unpaid",
  PARTIALLY_PAID = "partially_paid",
  PAID = "paid",
  OVERPAID = "overpaid",
}

export enum BillStatus {
  DRAFT = "draft",
  PENDING_APPROVAL = "pending_approval",
  APPROVED = "approved",
  ON_HOLD = "on_hold",
  DISPUTED = "disputed",
  VOIDED = "voided",
}

export enum PaymentTerms {
  NET_0 = "net_0",
  NET_15 = "net_15",
  NET_30 = "net_30",
  CUSTOM = "custom",
}

export interface BaseLineItem {
  description?: string;
  quantity: string;
  unitPrice: string;
  amount: string;
  department?: string | null;
  taxCode?: string | null;
}

export interface BillLineItem extends BaseLineItem {
  lineNo: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ApBillLinePayload extends BillLineItem {}

export interface BillLine {
  line_no: number;
  description: string;
  quantity: string;
  unit_price: string;
  amount: string;
  department: string | null;
  tax_code: string | null;
}

export interface ApBillCreatePayload {
  vendorId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  subtotal: string;
  taxTotal: string;
  discountTotal: string;
  total: string;
  memo?: string;
  account_id?: string | null;
  subaccount_id?: string | null;
  lines: ApBillLinePayload[];
  confidence?: number;
  warnings?: string[];
  discrepancies?: string[];
}
export interface Vendor {
  id: string;
  name: string;
  legalName: string;
  email?: string;
  phone?: string;
  paymentTerms?: PaymentTerms;
  defaultCurrency?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BillMetrics {
  id: string;
  totalBills: number;
  totalAmount: string;
  dueToday: number;
  overdue: number;
}
export interface BillDataResponseFromAPI {
  id: string;
  createdAt: string;
  updatedAt: string;
  vendorId: string;
  invoiceNumber: string;
  invoice_date: string;
  dueDate: string;
  currency: string;
  subtotal: string;
  vendor_name: string;
  vendor_address?: string;
  tax_total: string;
  discount_total: string;
  total: string;
  memo?: string;
  status?: BillStatus;
  financialStatus?: BillFinancialStatus;
  agingStage?: BillAgingStage;
  account_id?: string | null;
  subaccount_id?: string | null;
  line_items: BillLine[];
  confidence?: number;
  warnings?: string[];
  discrepancies?: string[];
  payment_terms?: PaymentTerms;
}
export interface BillDataByIdFromAPI extends BillDataResponseFromAPI {
  businessProfileId: string;
  discountTotal: string;
  taxTotal: string;
  invoiceDate: string;
  lines: {
    id: string;
    lineNo: number;
    createdAt?: string;
    updatedAt?: string;
    description: string;
    quantity: string;
    unitPrice: string;
    amount: string;
    department: string | null;
    taxCode: string | null;
  };
  vendor: {
    businessProfileId: string;
    createdAt: string;
    defaultCurrency: string;
    default_split_amount_cents: number | null;
    default_split_percent: number | null;
    email: string;
    id: string;
    isActive: boolean;
    legalName: string;
    name: string;
    notes: string;
    payarc_agreement_sent_at: string | null;
    payarc_contact_email: string | null;
    payarc_last_webhook: string | null;
    payarc_merchant_code: string | null;
    payarc_merchant_id: string | null;
    payarc_onboarded_at: string | null;
    payarc_onboarding_status: string | null;
    paymentTerms: PaymentTerms;
    phone: string;
    taxId: string | null;
    type: "individual";
    updatedAt: string;
  };
}

export type BillData = ApBillCreatePayload;
