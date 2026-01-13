"use client";

import { useMemo, useState } from "react";
import { BankReconciliationApiResponse } from "@/src/types/bank-reconciliation";

export function useReconciliationFilters(reconciliations: BankReconciliationApiResponse[] = []) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return reconciliations.filter((rec) => {
      const periodDate = new Date(rec.periodEnd);
      const period = periodDate.toLocaleString("default", { month: "long", year: "numeric" });

      return (
        period.toLowerCase().includes(term) ||
        rec.accountName.toLowerCase().includes(term)
      );
    });
  }, [search, reconciliations]);

  return {
    search,
    setSearch,
    filtered,
  };
}
