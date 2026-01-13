"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import type { ReconciliationQueryApiResponse } from "@/src/types/bank-reconciliation";
import { Separator } from "@/src/components/ui/separator";

import { FormalReconciliationEmpty } from "./formalReconciliationEmpty";
import { useFormalReconciliationStats } from "../../../hooks/useFormalReconciliationStats";
import { FormalReconciliationHeader } from "./formalReconciliationHeader";
import { ReconciliationLoading } from "../../skeleton/loadingToReconciliations";
import { FormalReconciliationAccounts } from "./formalReconciliationAccounts";
import { StatCard } from "./statCard";
import { Building2, CheckCircle2, FileText, TrendingUp } from "lucide-react";

interface Props {
  data: ReconciliationQueryApiResponse | null;
  loading: boolean;
  selectedYear: number;
  selectedMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
}

export function FormalReconciliationCard({
  data,
  loading,
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
}: Readonly<Props>) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const stats = useFormalReconciliationStats(data);

  return (
    <Card className="border-chart-1/20">
      <FormalReconciliationHeader
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        years={years}
        loading={loading}
        onYearChange={onYearChange}
        onMonthChange={onMonthChange}
      />

      <CardContent className="space-y-6">
        {loading && <ReconciliationLoading />}

        {!loading && data?.accounts.length === 0 && (
          <FormalReconciliationEmpty />
        )}


        {!loading && data && data.accounts.length > 0 && (
  <>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<TrendingUp className="h-4 w-4 text-chart-1" />}
        label="Match Rate"
        value={`${stats.matchRate}%`}
      />
      <StatCard
        icon={<CheckCircle2 className="h-4 w-4 text-chart-1" />}
        label="Matched"
        value={stats.totalMatched}
      />
      <StatCard
        icon={<FileText className="h-4 w-4 text-chart-1" />}
        label="Total Transactions"
        value={stats.totalTransactions}
      />
      <StatCard
        icon={<Building2 className="h-4 w-4 text-chart-1" />}
        label="Accounts"
        value={stats.accountsCount}
      />
    </div>

    <Separator />
    <FormalReconciliationAccounts accounts={data.accounts} />
  </>
        )}
      </CardContent>
    </Card>
  );
}
