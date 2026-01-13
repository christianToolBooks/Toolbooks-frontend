import { NormalBalanceEnum } from "./generaldLedgerTypes";

export interface Account {
  id: string;
  createdAt: string;
  updatedAt: string;
  account_code: string;
  account_name: string;
  account_type: TypesChartOfAccounts;
  normal_balance: 'debit' | 'credit';
  description?: string | null;
  status: boolean;
  reporting_category?: string | null;
  businessProfileId: string;
  business_type: 's_corp' | 'c_corp' | 'partnership' | 'self_employed';
  userId: string;
}
export interface AccountWithCurrentBalanceAndSubAccounts extends Account {
  currentBalance: number;
  subAccounts?: SubAccount[];
}

export interface SubAccount {
  id: string;
  createdAt: string;
  updatedAt: string;
  accountId: string;
  account_code: string;
  account_name: string;
  account_type: TypesChartOfAccounts;
  normal_balance: 'debit' | 'credit';
  description?: string | null;
  status: boolean;
  reporting_category?: string | null;
  businessProfileId: string;
  business_type: 's_corp' | 'c_corp' | 'partnership' | 'self_employed';
  userId: string;
  currentBalance: number;
}

export type TypesChartOfAccounts =
  | 'asset'
  | 'liability'
  | 'equity'
  | 'income'
  | 'expense';



export const normalBalanceTypes = [
  { value: 'debit', label: 'Debit' },
  { value: 'credit', label: 'Credit' },
];

export interface AccountWithType extends Account {
  type: 'account';
}

export interface SubAccountWithType extends SubAccount {
  type: 'subAccount';
}

export interface ChartOfAccountResponse {
  accounts: AccountWithType[];
  subAccounts: SubAccountWithType[];
}

export interface CombinedAccount {
  id: string;
  account_code: string;
  account_name: string;
  account_type: TypesChartOfAccounts;
  type: 'account' | 'subAccount';
  uniqueId: string;
}

export interface CreateCustomAccountDto {
  account_code: string;
  account_name: string;
  account_type: TypesChartOfAccounts;
  normal_balance?: NormalBalanceEnum;
  description?: string;
  status?: boolean;
  reporting_category?: string;
}