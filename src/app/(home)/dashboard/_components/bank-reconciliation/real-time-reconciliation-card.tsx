"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/src/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Badge } from "@/src/components/ui/badge";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { Progress } from "@/src/components/ui/progress";
import {
  RadioTower,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Wallet,
  AlertCircle,
} from "lucide-react";
import type { liveReconciliationResponse } from "@/src/types/bank-reconciliation";

interface LiveReconciliationCardProps {
  data: liveReconciliationResponse | null;
  handleRefreshRealTimeReconciliation: () => Promise<void>;
}

export function LiveReconciliationCard({
  data,
  handleRefreshRealTimeReconciliation,
}: LiveReconciliationCardProps) {
  if (!data) {
    return (
      <Card className="w-full overflow-hidden border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-900">
                <RadioTower className="h-5 w-5 text-indigo-600" />
                Live Reconciliation
              </CardTitle>
              <CardDescription className="text-slate-500">
                Monitor of your real-time reconciliation activity
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm text-slate-500">
            No live reconciliation session detected. Start a new reconciliation
            to see live activity here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const {
    period,
    totalBankTx,
    totalLedgerTx,
    matched,
    onlyInBank,
    onlyInBooks,
    pendingOutstanding,
    resolvedOutstanding,
    progress,
    accounts,
    completedAt,
  } = data;

  const totalOutstanding = pendingOutstanding + resolvedOutstanding;
  const isCompleted = progress >= 100 || !!completedAt;
  const statusLabel = isCompleted
    ? "Completed"
    : pendingOutstanding > 0
      ? "In progress"
      : "Reviewing";

  const statusVariant = isCompleted
    ? "outline"
    : pendingOutstanding > 0
      ? "destructive"
      : "secondary";

  return (
    <Card className="w-full overflow-hidden border-slate-200 bg-white gap-2 shadow-sm transition-all hover:shadow-md">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-slate-900">
              <RadioTower className="h-5 w-5 text-indigo-600" />
              Live Reconciliation
            </CardTitle>
            <CardDescription className="text-slate-500">
              Real-time view of your current reconciliation session ({period})
            </CardDescription>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="grid grid-cols-2 gap-10">
              <Badge
                variant={statusVariant}
                className={`flex items-center gap-1 px-3 py-1 text-xs ${
                  isCompleted
                    ? "border-emerald-200 text-emerald-700"
                    : pendingOutstanding > 0
                      ? "border-amber-200 text-amber-800"
                      : "border-slate-200 text-slate-700"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : pendingOutstanding > 0 ? (
                  <AlertTriangle className="h-3.5 w-3.5" />
                ) : (
                  <Activity className="h-3.5 w-3.5" />
                )}
                {statusLabel}
              </Badge>

              <button
                onClick={handleRefreshRealTimeReconciliation}
                className="rounded-md bg-chart-1 px-2 py-1 text-xs font-medium text-white hover:bg-chart-1/90 cursor-pointer"
              >
                Refresh
              </button>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm ring-1 ring-slate-200">
              <Clock className="h-3.5 w-3.5" />
              <span>
                {completedAt
                  ? `Completed at ${new Date(completedAt).toLocaleString()}`
                  : "Streaming latest activity"}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-6">
        <Alert
          variant="default"
          className="mb-6 border-amber-200 bg-amber-50 text-amber-900"
        >
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="mb-1 font-medium text-amber-800">
            Preliminary Data
          </AlertTitle>
          <AlertDescription className="text-amber-700/90">
            This view reflects the latest available transactions. Balances may
            change as pending items are settled, or there may be discrepancies
            in reconciliations.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/60 p-4 shadow-sm">
            <div className="flex items-center justify-between text-sm text-slate-600 h-10">
              <span>Overall Progress</span>
              <span className="font-semibold text-slate-900">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-slate-500">{matched} matched</p>
            <p className="text-sm text-slate-500">
              {onlyInBank + onlyInBooks} unmatched
            </p>
          </div>

          <div className="space-y-2 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600 h-10">
              <Wallet className="h-4 w-4" />
              Transactions Overview
            </div>
            <p className="text-sm text-slate-500">
              Bank:{" "}
              <span className="font-semibold text-slate-900">
                {totalBankTx.toLocaleString()}
              </span>{" "}
            </p>
            <p className="text-sm text-slate-500">
              Ledger:{" "}
              <span className="font-semibold text-slate-900">
                {totalLedgerTx.toLocaleString()}
              </span>
            </p>
            <p className="text-sm text-slate-500">
              Only in bank:{" "}
              <span className="font-semibold text-amber-700">
                {onlyInBank.toLocaleString()}
              </span>{" "}
            </p>
            <p className="text-sm text-slate-500">
              Only in books:{" "}
              <span className="font-semibold text-amber-700">
                {onlyInBooks.toLocaleString()}
              </span>
            </p>
          </div>

          <div className="space-y-2 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-600 h-6">
              <Activity className="h-4 w-4" />
              Outstanding Items
            </div>
            <p className="text-sm text-slate-500">
              Pending:{" "}
              <span className="font-semibold text-amber-700">
                {pendingOutstanding.toLocaleString()}
              </span>{" "}
            </p>
            <p className="text-sm text-slate-500">
              Resolved:{" "}
              <span className="font-semibold text-emerald-700">
                {resolvedOutstanding.toLocaleString()}
              </span>
            </p>
            <p className="text-sm text-slate-500">
              Total outstanding:{" "}
              <span className="font-semibold text-slate-900">
                {totalOutstanding.toLocaleString()}
              </span>
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-4 py-3 rounded-t-xl">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-slate-900">
                Accounts in this session
              </h3>
              <p className="text-xs text-slate-500">
                Live reconciliation across {accounts.length} account
                {accounts.length === 1 ? "" : "s"}
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-white text-xs font-normal text-slate-500"
            >
              {period}
            </Badge>
          </div>

          <ScrollArea className="h-[40vh]">
            <div className="divide-y divide-slate-100">
              {accounts.map((account) => {
                const accountPending =
                  (account?.onlyInBank ?? 0) + (account?.onlyInBooks ?? 0);
                const accountMatched = account?.matched ?? 0;
                const accountTotal =
                  (account?.totalBankTx ?? 0) + (account?.totalLedgerTx ?? 0) ||
                  1;
                const accountProgress = Math.round(
                  (accountMatched / accountTotal) * 100
                );

                return (
                  <div
                    key={account?.statementId ?? Math.random()}
                    className="flex flex-col gap-3 p-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${
                          accountPending > 0
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {accountPending > 0 ? (
                          <AlertTriangle className="h-4 w-4" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {account?.accountName ?? "N/A"}
                        </p>
                        <p className="text-xs text-slate-500">
                          Statement ID:{" "}
                          {(account?.statementId ?? "").slice(0, 8)}...
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Matched:{" "}
                          <span className="font-semibold text-slate-900">
                            {accountMatched.toLocaleString()}
                          </span>{" "}
                          • Pending:{" "}
                          <span
                            className={`font-semibold ${
                              accountPending > 0
                                ? "text-amber-700"
                                : "text-emerald-700"
                            }`}
                          >
                            {accountPending.toLocaleString()}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-2 sm:max-w-xs">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Progress</span>
                        <span className="font-semibold text-slate-900">
                          {Number.isFinite(accountProgress)
                            ? accountProgress
                            : 0}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          Number.isFinite(accountProgress) ? accountProgress : 0
                        }
                        className="h-1.5"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
