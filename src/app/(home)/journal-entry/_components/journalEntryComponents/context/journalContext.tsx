"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import useCoaWithAllAccounts from "../../../hooks/journalEntryHooks/useCoaWhithAllAccounts";
import { AccountSearchHook, JournalEntryLineUI } from "@/src/types/journal";
import {
  CombinedAccount,
  TypesChartOfAccounts,
} from "@/src/types/chart-of-accounts";
import { AccountFormValues } from "@/src/lib/schemas/coa";
import { useCreateCoAForm } from "../../../hooks/journalEntryHooks/useCreateCoA";
import { toast } from "sonner";
import { JournalEntryPayload } from "@/src/types/generaldLedgerTypes";
import { nextEntryNumberPersistent, toYMD } from "../../../helpers/functions";
import { createJournalEntry } from "@/src/lib/services/journalService";

interface JournalEntryContextType {
  entryDate: Date | undefined;
  setEntryDate: (date: Date | undefined) => void;
  entryNumber: string;
  setEntryNumber: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  status: "draft" | "posted";
  setStatus: (s: "draft" | "posted") => void;
  currency: string;
  setCurrency: (c: string) => void;

  lines: JournalEntryLineUI[];
  setLines: (lines: JournalEntryLineUI[]) => void;

  addLine: () => void;
  removeLine: (id: string) => void;
  updateLine: (
    id: string,
    field: keyof JournalEntryLineUI,
    value: string | number | boolean
  ) => void;
  selectAccount: (lineId: string, account: CombinedAccount) => void;

  accountSearch: AccountSearchHook;
  accountSelectorStates: Record<string, boolean>;
  getAccountSelectorState: (lineId: string) => {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
  };

  coaForm: ReturnType<typeof useCreateCoAForm>;
  handleCreateAccount: (accountData: {
    account_code: string;
    account_name: string;
    account_type: TypesChartOfAccounts;
  }) => Promise<void>;

  isAddAccountDialogOpen: boolean;
  setIsAddAccountDialogOpen: (open: boolean) => void;

  newAccountForm: {
    account_code: string;
    account_name: string;
    account_type: TypesChartOfAccounts;
  };
  updateNewAccountForm: (
    updates: Partial<{
      account_code: string;
      account_name: string;
      account_type: TypesChartOfAccounts;
    }>
  ) => void;
  resetNewAccountForm: () => void;

  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;

  isSaving: boolean;
  handleSave: () => Promise<void>;
}

const JournalEntryContext = createContext<JournalEntryContextType | undefined>(
  undefined
);

interface JournalEntryProviderProps {
  children: ReactNode;
}

export function JournalEntryProvider({ children }: JournalEntryProviderProps) {
  const [entryDate, setEntryDate] = useState<Date | undefined>(new Date());
  const [entryNumber, setEntryNumber] = useState(nextEntryNumberPersistent());
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"draft" | "posted">("draft");
  const [currency, setCurrency] = useState<string>("USD");

  const [lines, setLines] = useState<JournalEntryLineUI[]>([
    {
      id: "1",
      accountId: undefined,
      accountNumber: "",
      accountName: "",
      debit: 0,
      credit: 0,
      memo: "",
      name: "",
      billable: false,
    },
    {
      id: "2",
      accountId: undefined,
      accountNumber: "",
      accountName: "",
      debit: 0,
      credit: 0,
      memo: "",
      name: "",
      billable: false,
    },
  ]);

  const accountSearch = useCoaWithAllAccounts();
  const [accountSelectorStates, setAccountSelectorStates] = useState<
    Record<string, boolean>
  >({});

  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);
  const [newAccountForm, setNewAccountForm] = useState({
    account_code: "",
    account_name: "",
    account_type: "asset" as TypesChartOfAccounts,
  });

  const coaForm = useCreateCoAForm({
    onSuccess: async () => {
      setIsAddAccountDialogOpen(false);
      resetNewAccountForm();
    },
  });

  const updateNewAccountForm = useCallback(
    (updates: Partial<typeof newAccountForm>) => {
      setNewAccountForm((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const resetNewAccountForm = useCallback(() => {
    setNewAccountForm({
      account_code: "",
      account_name: "",
      account_type: "asset",
    });
  }, []);

  const handleCreateAccount = useCallback(
    async (accountData: {
      account_code: string;
      account_name: string;
      account_type: TypesChartOfAccounts;
    }) => {
      try {
        const validationError = coaForm.validateAccountCode(
          accountData.account_type,
          accountData.account_code
        );
        if (validationError) {
          toast.error(validationError);
          throw new Error(validationError);
        }
        coaForm.setValue("account_code", accountData.account_code);
        coaForm.setValue("account_name", accountData.account_name);
        coaForm.setValue("account_type", accountData.account_type);

        const formData: AccountFormValues = {
          account_code: accountData.account_code,
          account_name: accountData.account_name,
          account_type: accountData.account_type,
          normal_balance: coaForm.determineNormalBalance(
            accountData.account_type
          ),
          status: true,
        };

        await coaForm.onSubmit(formData);
        localStorage.removeItem("form");
        toast.success("Account created successfully!");
        await accountSearch.refreshAccounts();
      } catch (error) {
        toast.error(`Error creating account: ${error}`);
        throw error;
      }
    },
    [coaForm, accountSearch]
  );

  const addLine = useCallback(() => {
    setLines((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        accountId: undefined,
        accountNumber: "",
        accountName: "",
        debit: 0,
        credit: 0,
        memo: "",
        name: "",
        billable: false,
      },
    ]);
  }, []);

  const removeLine = useCallback((id: string) => {
    setLines((prev) =>
      prev.length > 2 ? prev.filter((l) => l.id !== id) : prev
    );
  }, []);

  const updateLine = useCallback(
    (
      id: string,
      field: keyof JournalEntryLineUI,
      value: string | number | boolean
    ) => {
      setLines((prev) =>
        prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
      );
    },
    []
  );

  const selectAccount = useCallback(
    (lineId: string, account: CombinedAccount) => {
      updateLine(lineId, "accountId", account.id);
      updateLine(lineId, "accountNumber", account.account_code);
      updateLine(lineId, "accountName", account.account_name);

      setAccountSelectorStates((prev) => ({ ...prev, [lineId]: false }));
      if (accountSearch.setQuery) accountSearch.setQuery("");
    },
    [updateLine, accountSearch]
  );

  const getAccountSelectorState = useCallback(
    (lineId: string) => {
      const isOpen = accountSelectorStates[lineId] || false;
      const setIsOpen = (open: boolean) => {
        setAccountSelectorStates((prev) => ({ ...prev, [lineId]: open }));
        if (open && accountSearch.setQuery) accountSearch.setQuery("");
      };
      return { isOpen, setIsOpen };
    },
    [accountSelectorStates, accountSearch]
  );

  const totalDebits = lines.reduce((s, l) => s + (l.debit || 0), 0);
  const totalCredits = lines.reduce((s, l) => s + (l.credit || 0), 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!entryDate) {
      toast.error("Please choose a date.");
      return;
    }
    if (lines.some((l) => !l.accountId)) {
      toast.error("All lines must have an account selected.");
      return;
    }

    if (!isBalanced) {
      toast.error(
        "Journal entry must be balanced (debits must equal credits)."
      );
      return;
    }

    const usableLines = lines
      .filter((l) => l.accountId && ((l.debit ?? 0) > 0 || (l.credit ?? 0) > 0))
      .map((l) => ({
        accountId: l.accountId as string,
        debit: l.debit ? Number(l.debit) : undefined,
        credit: l.credit ? Number(l.credit) : undefined,
        memo: l.memo?.trim() ? l.memo : undefined,
      }));

    if (usableLines.length === 0) {
      toast.error("At least one line with debit or credit is required.");
      return;
    }

    const payload: JournalEntryPayload = {
      entry_date: toYMD(entryDate),
      status,
      currency,
      description: (description || "").trim(),
      lines: usableLines,
    };

    setIsSaving(true);
    const res = await createJournalEntry(payload);
    setIsSaving(false);

    if ("statusCode" in res) {
      toast.error(res.message || "Error saving journal entry.");
      return;
    }

    toast.success(res.message || "Journal entry saved.");
    setEntryNumber(nextEntryNumberPersistent(entryDate ?? new Date()));
    setDescription("");
    setLines([
      {
        id: "1",
        accountId: undefined,
        accountNumber: "",
        accountName: "",
        debit: 0,
        credit: 0,
        memo: "",
        name: "",
        billable: false,
      },
      {
        id: "2",
        accountId: undefined,
        accountNumber: "",
        accountName: "",
        debit: 0,
        credit: 0,
        memo: "",
        name: "",
        billable: false,
      },
    ]);
  }, [entryDate, isBalanced, lines, status, currency, description]);

  const value: JournalEntryContextType = {
    entryDate,
    setEntryDate,
    entryNumber,
    setEntryNumber,
    description,
    setDescription,
    status,
    setStatus,
    currency,
    setCurrency,

    lines,
    setLines,
    addLine,
    removeLine,
    updateLine,
    selectAccount,

    accountSearch,
    accountSelectorStates,
    getAccountSelectorState,

    coaForm,
    handleCreateAccount,

    isAddAccountDialogOpen,
    setIsAddAccountDialogOpen,

    newAccountForm,
    updateNewAccountForm,
    resetNewAccountForm,

    totalDebits,
    totalCredits,
    isBalanced,

    isSaving,
    handleSave,
  };

  return (
    <JournalEntryContext.Provider value={value}>
      {children}
    </JournalEntryContext.Provider>
  );
}

export function useJournalEntry() {
  const ctx = useContext(JournalEntryContext);
  if (!ctx)
    throw new Error(
      "useJournalEntry must be used within a JournalEntryProvider"
    );
  return ctx;
}
