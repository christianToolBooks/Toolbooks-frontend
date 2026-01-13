import { CombinedAccount } from "./chart-of-accounts";

export interface JournalEntryLineUI {
  id: string;
  accountId: string | undefined;
  accountNumber: string;
  accountName: string;
  debit: number;
  credit: number;
  memo: string;
  name: string;
  billable: boolean;
}

export interface NewAccountForm {
  number: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE';
}

export interface AccountSearchHook {
  query: string;
  setQuery: (query: string) => void;
  displayAccounts: CombinedAccount[];
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputFocus: () => void;
  clearQuery: () => void;
  combinedAccounts: CombinedAccount[];
  loading: boolean;
  refreshAccounts: () => Promise<void>;
}