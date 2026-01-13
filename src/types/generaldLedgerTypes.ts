
import { QueryPaginationInterface } from "./paginaton";

export enum AccountTypeEnum {
  ASSET = 'asset',
  LIABILITY = 'liability',
  EQUITY = 'equity',
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface TransactionPaginationResponseDto {
  data: GeneralLedgerLine[];
  total: number;
  page: number;
  limit: number;
}

export interface FetchTransactionsParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  accountId?: string;
  subaccountId?: string;
}

export interface TransactionsRequest extends QueryPaginationInterface {
  startDate?: string;
  endDate?: string;
}

export interface TransactionRequestByChartOfAccount
  extends QueryPaginationInterface {
  startDate?: string;
  endDate?: string;
  accountId?: string;
  type?: 'account' | 'subaccount';
}

export interface TransactionRequestWithAdvancedFilters
  extends QueryPaginationInterface {
  startDate?: string;
  endDate?: string;
  type?: 'account' | 'subaccount';
  chartAccountId?: string;
  bankAccountId?: string;
}

// ---------- RAW PAYLOAD ----------
export interface RawPayloadLocation {
  lat: number | null;
  lon: number | null;
  city: string | null;
  region: string | null;
  address: string | null;
  country: string | null;
  postal_code: string | null;
  store_number: string | null;
}

export interface RawPayloadPaymentMeta {
  payee: string | null;
  payer: string | null;
  ppd_id: string | null;
  reason: string | null;
  by_order_of: string | null;
  payment_method: string | null;
  reference_number: string | null;
  payment_processor: string | null;
}

export interface PersonalFinanceCategory {
  primary: string;
  detailed: string;
  confidence_level: string;
}

export interface RawPayload {
  date: string;
  name: string;
  amount: number;
  pending: boolean;
  website: string | null;
  category: string | null;
  datetime: string | null;
  location: RawPayloadLocation;
  logo_url: string | null;
  account_id: string;
  category_id: string | null;
  check_number: string | null;
  payment_meta: RawPayloadPaymentMeta;
  account_owner: string | null;
  merchant_name: string | null;
  counterparties: unknown[];
  transaction_id: string;
  authorized_date: string | null;
  payment_channel: string;
  transaction_code: string | null;
  transaction_type: string;
  iso_currency_code: string;
  merchant_entity_id: string | null;
  authorized_datetime: string | null;
  pending_transaction_id: string | null;
  unofficial_currency_code: string | null;
  personal_finance_category: PersonalFinanceCategory;
  personal_finance_category_icon_url: string;
}

// ---------- BANK ACCOUNT ----------
export enum NormalBalanceEnum {
  DEBIT = "debit",
  CREDIT = "credit",
}

export interface BankAccount {
  id: string;
  createdAt: string;
  updatedAt: string;
  account_id: string;
  name: string;
  mask: string;
  subtype: string;
  type: string; 
  limit_balance: string;
  holder_category: string | null;
  available_balance: string | null;
  current_balance: string;
  iso_currency_code: string;
  official_name: string;
  unofficial_currency_code: string | null;
  userId: string;
  plaidItemId: string;
  businessProfileId: string;
}

// ---------- BANK TRANSACTION ----------
export interface BankTransaction {
  id: string;
  createdAt: string;
  updatedAt: string;
  plaid_transaction_id: string;
  pending_transaction_id: string | null;
  plaid_transaction_code: string | null;
  plaid_account_id: string;
  amount: string;
  iso_currency_code: string;
  date: string;
  authorized_date: string | null;
  authorized_datetime: string | null;
  name: string;
  merchant_name: string | null;
  pending: boolean;
  address: string | null;
  city: string | null;
  country: string | null;
  postal_code: string | null;
  detailed: string;
  primary_detail: string;
  raw_payload: RawPayload;
  is_removed: boolean;
  bankAccountId: string;
  businessProfileId: string;
  statementId: string | null;
  plaidItemId: string;
  bankAccount?: BankAccount;
}

// ---------- TRANSACTION ----------
export type TransactionStatus = "draft" | "posted" | string;

export interface Transaction {
  id: string;
  createdAt: string;
  updatedAt: string;
  entry_no: string;
  entry_date: string;
  currency: string;
  source: string;
  status: TransactionStatus;
  locked: boolean;
  memo: string;
  businessProfileId: string;
  bankTransactionId: string;
  bankTransaction: BankTransaction;
}

// ---------- ACCOUNT ----------
export interface Account {
  id: string;
  createdAt: string;
  updatedAt: string;
  account_code: string;
  account_name: string;
  account_type: string;
  normal_balance: string;
  description: string;
  status: boolean;
  reporting_category: string | null;
  businessProfileId: string;
  business_type: string;
  userId: string;
}

export interface SubAccount {
  id: string;
  account_name: string;
  account_code: string;
}

// ---------- JOURNAL LINE ----------
export interface JournalEntryLine {
  accountId: string;
  debit?: number;
  credit?: number;
  memo?: string;
}

export interface JournalEntryPayload {
  entry_date: string;     
  status: "draft" | "posted";
  currency: string;        
  description: string;
  lines: JournalEntryLine[];
}

// ---------- GENERAL LEDGER ----------
export interface GeneralLedgerLine {
  id: string;
  line_no: number;
  debit: string;
  credit: string;
  account: Account;
  subaccount?: SubAccount | null;
  running_balance: string;
  memo: string;
  transaction: {
    id: string;
    entry_no: string;
    description: string;
    entry_date: string;
    status: string;
    bankTransaction: BankTransaction;
    currency: string;
  };
}

// ---------- RESPONSE ----------
export type JournalLineResponse = JournalEntryPayload[];
