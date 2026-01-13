"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { BankReconciliationApiResponse, MONTHS } from "@/src/types/bank-reconciliation";
import { Loader2 } from "lucide-react";

interface MonthDownloadDialogProps {
  open: boolean;
  onClose: () => void;
  checking: boolean;
  result: BankReconciliationApiResponse[];
  downloading: boolean;
  selectedYear: number;
  selectedMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onCheckAvailability: () => void;
  onDownload: () => void;
}

export function MonthDownloadDialog({
  open,
  onClose,
  checking,
  result,
  downloading,
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
  onCheckAvailability,
  onDownload,
}: MonthDownloadDialogProps) {
  const hasChecked = checking === false && result !== null;

  const selectedMonthName =
    MONTHS.find((m) => m.value === selectedMonth)?.label || "";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader className="mb-4">
          <DialogTitle>Select month and year</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 ">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Year</Label>
              <Select
                value={String(selectedYear)}
                onValueChange={(val) => onYearChange(Number(val))}
                disabled={checking || downloading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }).map((_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Month</Label>
              <Select
                value={String(selectedMonth)}
                onValueChange={(val) => onMonthChange(Number(val))}
                disabled={checking || downloading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem key={month.value} value={String(month.value)}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {checking ? (
            <div className="flex items-center justify-center py-6">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  Checking for available reconciliation PDFs...
                </span>
              </div>
            </div>
          ) : downloading ? (
            <div className="flex items-center justify-center py-6">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  Downloading PDFs...
                </span>
              </div>
            </div>
          ) : !hasChecked ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Before downloading, we will check if there are reconciliation
                PDFs available for the selected period.
              </p>
              <Button
                onClick={onCheckAvailability}
                disabled={checking}
                className="w-full"
              >
                Check availability
              </Button>
            </div>
          ) : result.length > 0 ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-chart-1/50 bg-chart-1/10 p-3">
                <p className="text-sm font-medium text-chart-1">
                  ✓ {result.length} reconciliation PDF
                  {result.length > 1 ? "s" : ""} available
                </p>
                <p className="text-xs text-chart-1 mt-1">
                  Ready to download for {selectedMonthName} {selectedYear}
                </p>
              </div>
              <Button
                onClick={onDownload}
                disabled={downloading}
                className="w-full gap-2"
              >
                {downloading && <Loader2 className="h-4 w-4 animate-spin" />}
                Download {result.length} PDF{result.length > 1 ? "s" : ""}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm font-medium text-amber-900">
                  No reconciliation PDFs available
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  There are no completed reconciliations for {selectedMonthName}{" "}
                  {selectedYear}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Close
                </Button>
                <Button
                  variant="outline"
                  onClick={onCheckAvailability}
                  className="flex-1"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
