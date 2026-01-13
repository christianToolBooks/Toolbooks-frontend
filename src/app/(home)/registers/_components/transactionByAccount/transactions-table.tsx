"use client";
import { useState } from "react";
import { columns } from "./transactions-columns";
import { TransactionsFilters } from "./transactions-filters";
import { TransactionsPagination } from "./transactions-pagination";
import { Button } from "@/src/components/ui/button";
import { DataTable } from "./data-table";
import { useTransactionsByPlaidItem } from "../../hooks/useTransactionsByAccount";
import { GeneralLedgerTableSkeleton } from "../../../general-ledger/_components/generalLedgerComponents/GlLoader";
import { CombinedAccountFromTransactions } from "../../hooks/useTransactionAccountSearch";
import { GeneralLedgerLine } from "@/src/types/generaldLedgerTypes";
import UseCoaFilter from "../../../general-ledger/hooks/generalLedgerHooks/useCoaFilter";
interface TransactionsTableProps {
  plaidItemId: string;
  transactions: GeneralLedgerLine[];
  onAccountSelect: (account: CombinedAccountFromTransactions | null) => void;
  selectedAccountId?: string;
  className?: string;
}

type DateRangeKey =
  | "All"
  | "Today"
  | "This Week"
  | "Last Week"
  | "This Month"
  | "Last Month"
  | "Last 2 Months"
  | "Last 6 Months"
  | "Custom";

function computeRange(key: DateRangeKey): { from?: Date; to?: Date } {
  const today = new Date();
  const startOf = (d: Date, unit: "month" | "week" | "day") => {
    const x = new Date(d);
    if (unit === "day") {
      x.setHours(0, 0, 0, 0);
      return x;
    }
    if (unit === "week") {
      const day = x.getDay();
      const diff = (day + 6) % 7;
      x.setDate(x.getDate() - diff);
      x.setHours(0, 0, 0, 0);
      return x;
    }
    x.setDate(1);
    x.setHours(0, 0, 0, 0);
    return x;
  };
  switch (key) {
    case "All":
      return {};
    case "Today":
      return { from: startOf(today, "day"), to: today };
    case "This Week":
      return { from: startOf(today, "week"), to: today };
    case "Last Week": {
      const end = startOf(today, "week");
      const start = new Date(end);
      start.setDate(start.getDate() - 7);
      return { from: start, to: new Date(end.getTime() - 1) };
    }
    case "This Month":
      return { from: startOf(today, "month"), to: today };
    case "Last Month": {
      const start = startOf(today, "month");
      start.setMonth(start.getMonth() - 1);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      end.setMilliseconds(-1);
      return { from: start, to: end };
    }
    case "Last 2 Months": {
      const end = today;
      const start = new Date(end);
      start.setMonth(start.getMonth() - 2);
      return { from: startOf(start, "day"), to: end };
    }
    case "Last 6 Months": {
      const end = today;
      const start = new Date(end);
      start.setMonth(start.getMonth() - 6);
      return { from: startOf(start, "day"), to: end };
    }
    default:
      return {};
  }
}

export function TransactionsTable({ plaidItemId }: TransactionsTableProps) {
  const [dateRange, setDateRange] = useState<DateRangeKey>("All");
  const [customDateFrom, setCustomDateFrom] = useState<string>("");
  const [customDateTo, setCustomDateTo] = useState<string>("");
  const {
    data: rows,
    loading,
    error,
    refetch,
    page,
    totalPages,
    totalItems,
    setPage,
    setDateFilter,
    setAccountTarget,
    clearFilters,
  } = useTransactionsByPlaidItem({ plaidItemId, autoFetch: true });
  const { setSelectedAccount, selectedAccount } = UseCoaFilter();
  const handleClearFilters = () => {
    clearFilters();
    setSelectedAccount(null);
  };

  const handleDateRangeChange = (value: string) => {
    const key = value as DateRangeKey;
    setDateRange(key);

    if (key === "Custom") return;
    if (key === "All") {
      setDateFilter(undefined);
      return;
    }
    const { from, to } = computeRange(key);
    setDateFilter({ startDate: from ?? null, endDate: to ?? null });
  };

  const handleCustomDateChange = (
    field: "customDateFrom" | "customDateTo",
    value: string
  ) => {
    if (field === "customDateFrom") setCustomDateFrom(value);
    if (field === "customDateTo") setCustomDateTo(value);
    if (dateRange === "Custom") {
      const start = field === "customDateFrom" ? value : customDateFrom;
      const end = field === "customDateTo" ? value : customDateTo;
      setDateFilter({
        startDate: start ? new Date(start) : null,
        endDate: end ? new Date(end) : null,
      });
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <p className="text-lg font-semibold">Error: {error.message}</p>
        <Button onClick={refetch} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <TransactionsFilters
        dateRange={dateRange}
        customDateFrom={customDateFrom}
        customDateTo={customDateTo}
        onDateRangeChange={handleDateRangeChange}
        onCustomDateChange={handleCustomDateChange}
        onAccountSelect={(acc) => setAccountTarget(acc)}
        clearFilters={handleClearFilters}
      />

      {loading ? (
        <GeneralLedgerTableSkeleton />
      ) : (
        <DataTable columns={columns} data={rows} />
      )}

      {rows.length > 0 && (
        <TransactionsPagination
          currentPage={page}
          totalPages={totalPages}
          filteredCount={rows.length}
          setPage={setPage}
          hasPreviousPage={page > 1}
          hasNextPage={page < totalPages}
        />
      )}
    </div>
  );
}
