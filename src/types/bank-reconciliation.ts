export type ReconciliationStatus = 'in_progress' | 'completed' | 'cancelled';

export interface BankReconciliationApiResponse {
  statementId: string;
  accountId: string;
  accountName: string;
  periodStart: string;
  periodEnd: string;
  openingBalance: number;
  closingBalance: number;
  reconciliation: reconciliation | null;

}

export interface liveAccountsReconciliationApiResponse {
    statementId: string;
  accountId: string;
  accountName: string;
  periodStart: string;
  periodEnd: string;
  openingBalance: number;
  closingBalance: number;
  totalBankTx: number;
  totalLedgerTx: number;
  matched: number;
  onlyInBank: number;
  onlyInBooks: number;
  pendingOutstanding: number;
  resolvedOutstanding: number;
  progress: number;
}
export interface ReconciliationQueryApiResponse {
  businessProfileid: string;
  period: string;
  accounts: BankReconciliationApiResponse[];
}



export interface reconciliation {
  sessionId: string,
  hasSessionItems: boolean,
  sessionItemsCount: number,
  totalBankTx: number,
  totalLedgerTx: number,
  matched: number,
  onlyInBank: number,
  onlyInBooks: number,
  completedAt: string | null
  createdAt: string;
}

export interface liveReconciliationResponse extends reconciliation {
  businessProfileId: string;
  period: string;
  pendingOutstanding: number;
  resolvedOutstanding: number;
  progress: number;
  accounts: liveAccountsReconciliationApiResponse[];
}


export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
}

export interface LedgerTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
}

export type ExceptionType =
| "only_in_bank"
| "only_in_books"
| "mismatch";

export interface ReconciliationSessionItem {
  id: string;
  type: "exception" | "match";
  bankTransaction: BankTransaction | null;
  ledgerTransaction: LedgerTransaction | null;
  exceptionType: ExceptionType | null;
  note: string | null;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
}
export interface PaginatedSessionResponse {
  items: ReconciliationSessionItem[];
  total: number;
  page: number;
  limit: number;
}
export interface PaginatedReconciliationsResponse {
  items: BankReconciliationApiResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface CachedPage {
  items: BankReconciliationApiResponse[];
  paginationInfo: PaginationInfo;
  timestamp: number;
}

export const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];