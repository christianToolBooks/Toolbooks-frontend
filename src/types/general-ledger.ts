export interface GeneralLedgerEntry {
  date: string;
  accountName: string;
  description: string;
  debit?: number;
  credit?: number;
}
