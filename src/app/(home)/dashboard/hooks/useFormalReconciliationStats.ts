import { ReconciliationQueryApiResponse } from "@/src/types/bank-reconciliation";

export function useFormalReconciliationStats(
  data: ReconciliationQueryApiResponse | null
) {
  const totalMatched =
    data?.accounts.reduce(
      (sum, acc) => sum + (acc?.reconciliation?.matched ?? 0),
      0
    ) ?? 0;

  const totalTransactions =
    data?.accounts.reduce(
      (sum, acc) => sum + (acc?.reconciliation?.totalBankTx ?? 0),
      0
    ) ?? 0;

  const matchRate =
    totalTransactions > 0
      ? ((totalMatched / totalTransactions) * 100).toFixed(1)
      : "0";

  return {
    totalMatched,
    totalTransactions,
    matchRate,
    accountsCount: data?.accounts.length ?? 0,
  };
}
