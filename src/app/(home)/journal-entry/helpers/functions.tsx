import { TypesChartOfAccounts } from "@/src/types/chart-of-accounts";
import { NormalBalanceEnum } from "@/src/types/generaldLedgerTypes";

  // Determine the normal_balance based on account_type
export const determineNormalBalance = (
    accountType: TypesChartOfAccounts
  ): NormalBalanceEnum => {
    switch (accountType) {
      case "asset":
      case "expense":
        return NormalBalanceEnum.DEBIT;
      case "liability":
      case "equity":
      case "income":
        return NormalBalanceEnum.CREDIT;
      default:
        return NormalBalanceEnum.DEBIT;
    }
  };

// validate the account code according to the backend rules
export const validateAccountCode = (
    type: TypesChartOfAccounts,
    code: string
  ): string | null => {
    const ranges: Record<TypesChartOfAccounts, { min: number; max: number }> = {
      asset: { min: 10000, max: 19999 },
      liability: { min: 20000, max: 29999 },
      equity: { min: 30000, max: 39999 },
      income: { min: 40000, max: 49999 },
      expense: { min: 50000, max: 59999 },
    };

    const range = ranges[type];
    if (!range) {
      return `Invalid account type: ${type}`;
    }

    const numericCode = parseInt(code, 10);

    if (isNaN(numericCode)) {
      return `Account code "${code}" is not a valid number.`;
    }

    if (numericCode < range.min || numericCode > range.max) {
      return `Account number ${code} is out of range for account type "${type}". It must be between ${range.min} and ${range.max}.`;
    }

    return null;
  };

  // get the code placeholder according to the type
export const getCodePlaceholder = (type: TypesChartOfAccounts): string => {
    const ranges: Record<TypesChartOfAccounts, string> = {
      asset: "10000-19999",
      liability: "20000-29999",
      equity: "30000-39999",
      income: "40000-49999",
      expense: "50000-59999",
    };
    return `e.g., ${ranges[type]}`;
  };

export const accountTypeOptions: { value: TypesChartOfAccounts; label: string }[] = [
    { value: "asset", label: "Asset" },
    { value: "liability", label: "Liability" },
    { value: "equity", label: "Equity" },
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" },
  ];

export function toYMD(d?: Date): string {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatMoneyLive(raw: string, locale = "en-US") {
  let s = raw.replace(/[^\d.]/g, "");                 
  const i = s.indexOf(".");                           
  if (i !== -1) s = s.slice(0, i + 1) + s.slice(i + 1).replace(/\./g, "");

  let [intPart, decPart = ""] = s.split(".");
  decPart = decPart.slice(0, 2);
  intPart = intPart.replace(/^0+(?=\d)/, "");         

  const intNumber = intPart ? Number(intPart) : 0;
  const intDisplay = intPart === "" ? "" : intNumber.toLocaleString(locale);

  const display = i === -1 ? intDisplay : `${intDisplay || "0"}.${decPart}`;
  const valueNumber =
    intPart === "" && decPart === "" ? 0 : Number(`${intPart || "0"}.${decPart || "0"}`);

  return { display, valueNumber };
}

export function formatMoneyFixed2(n?: number, locale = "en-US") {
  const v = typeof n === "number" && isFinite(n) ? n : 0;
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v);
}

export const toFixed2Number = (n: number) => Number(n.toFixed(2));

export const yyyymmdd = (d = new Date()) =>
  `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;

const pad4 = (n: number) => String(n).padStart(4, "0");

/**
 * Construye el entry number de UI estilo "JE-YYYYMMDD-####".
 * - Si prev coincide con hoy: aumenta el consecutivo.
 * - Si es otro día o no hay prev: inicia en 0001 para hoy.
 */
export function nextEntryNumber(prev?: string, date = new Date()) {
  const today = yyyymmdd(date);
  const re = /^JE-(\d{8})-(\d{4})$/;

  if (prev && re.test(prev)) {
    const [, prevDate, prevSeq] = re.exec(prev)!;
    const seq = prevDate === today ? Number(prevSeq) + 1 : 1;
    return `JE-${pad4(seq)}`;
  }

  return `JE-0001`;
}

/**
 * Versión con persistencia local: no repite para el mismo día aunque recargues la página.
 * Usa localStorage: clave "je-seq-YYYYMMDD".
 */
export function nextEntryNumberPersistent(date = new Date()) {
  const today = yyyymmdd(date);
  const key = `je-seq-${today}`;

  const current = Number((typeof window !== "undefined" && localStorage.getItem(key)) || "0");
  const nextSeq = current + 1;

  if (typeof window !== "undefined") {
    localStorage.setItem(key, String(nextSeq));
  }

  return `JE-${pad4(nextSeq)}`;
}

/** Opcional: sincroniza el contador local usando el entry_no devuelto por el back ("YYYYMMDD-####"). */
export function syncFromBackendEntryNo(entry_no?: string) {
  if (!entry_no || typeof window === "undefined") return;
  const [date, seqStr] = entry_no.split("-");
  if (!date || !seqStr) return;
  const key = `je-seq-${date}`;
  const current = Number(localStorage.getItem(key) || "0");
  const seq = Number(seqStr);
  if (seq > current) localStorage.setItem(key, String(seq));
}
