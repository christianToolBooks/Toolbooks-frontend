import { BankReconciliationApiResponse } from "@/src/types/bank-reconciliation";

export function useLastBankReconciliation(
  rec: BankReconciliationApiResponse
) {
  if (!rec.reconciliation?.createdAt) {
    return {
      hasReconciliation: false,
      label: "Not reconciled yet",
      date: null,
    };
  }

  const date = new Date(rec.reconciliation.createdAt);

  return {
    hasReconciliation: true,
    date,
    label: date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  };
}
