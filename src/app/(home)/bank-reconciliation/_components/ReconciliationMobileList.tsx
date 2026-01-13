"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Eye, Download, Loader2 } from "lucide-react";
import { BankReconciliationApiResponse } from "@/src/types/bank-reconciliation";

interface ReconciliationMobileListProps {
  data: BankReconciliationApiResponse[];
  downloading: boolean;
  loading?: boolean;
  onPreview: (rec: BankReconciliationApiResponse) => void;
  onDownload: (rec: BankReconciliationApiResponse) => void;
}

export function ReconciliationMobileList({
  data,
  downloading,
  loading,
  onPreview,
  onDownload,
}: ReconciliationMobileListProps) {
  if (loading && data.length === 0) {
    return (
      <div className="rounded-lg border bg-muted/40 p-8 text-center md:hidden">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading reconciliations...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border bg-muted/40 p-4 text-center text-sm text-muted-foreground md:hidden">
        No reconciliation reports found with the current filters.
      </div>
    );
  }

  return (
    <div className="space-y-3 md:hidden">
      {data.map((rec) => {
        const periodDate = new Date(rec.periodEnd);
        const period = periodDate.toLocaleString("default", { month: "long", year: "numeric" });

        return (
          <Card key={rec.statementId} className="border-border/60 bg-background shadow-sm">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{period}</p>
                  <p className="text-xs text-muted-foreground">{rec.accountName}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{new Date(rec.periodEnd).toLocaleDateString()}</span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => onPreview(rec)}>
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>

                {rec.reconciliation && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1"
                    onClick={() => onDownload(rec)}
                    disabled={downloading}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
