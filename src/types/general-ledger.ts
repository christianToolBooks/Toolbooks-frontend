export interface GeneralLedgerEntry {
  date: string;
  accountName: string; // Name of the account from Chart of Accounts that was affected
  description: string; // Transaction description or memo
  debit?: number; // Amount if it's a debit to this GL account
  credit?: number; // Amount if it's a credit to this GL account
  // referenceToOriginalTransaction?: string; // ID of the source transaction in a register
  // runningBalancePerAccount?: number; // If showing GL by account with running balance
}
