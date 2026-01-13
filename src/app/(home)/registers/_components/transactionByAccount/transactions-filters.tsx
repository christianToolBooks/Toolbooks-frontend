"use client";

import { useRef } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Label } from "@/src/components/ui/label";
import { X } from "lucide-react";
import { TransactionAccountSearchInput, type AccountInputHandle } from "./transactionAccountSearchInput";
interface TransactionsFiltersProps {
  dateRange: string;
  customDateFrom: string;
  customDateTo: string;
  onDateRangeChange: (range: string) => void;
  onCustomDateChange: (field: "customDateFrom" | "customDateTo", value: string) => void;
  onAccountSelect: (acc: { type: "account" | "subaccount"; id: string } | null) => void;
  clearFilters: () => void;
}

export function TransactionsFilters({
  dateRange,
  customDateFrom,
  customDateTo,
  onDateRangeChange,
  onCustomDateChange,
  onAccountSelect,
  clearFilters,
}: TransactionsFiltersProps) {
  const accountRef = useRef<AccountInputHandle>(null);

  const handleClearAll = () => {
    clearFilters();
    onAccountSelect(null);
    accountRef.current?.clear();
  };

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 border rounded-lg bg-muted/20">
      <div className="grid gap-1.5">
        <Label htmlFor="dateRange">Date Range</Label>
        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Today">Today</SelectItem>
            <SelectItem value="This Week">This Week</SelectItem>
            <SelectItem value="Last Week">Last Week</SelectItem>
            <SelectItem value="This Month">This Month</SelectItem>
            <SelectItem value="Last Month">Last Month</SelectItem>
            <SelectItem value="Last 2 Months">Last 2 Months</SelectItem>
            <SelectItem value="Last 6 Months">Last 6 Months</SelectItem>
            <SelectItem value="Custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {dateRange === "Custom" && (
        <>
          <div className="grid gap-1.5">
            <Label htmlFor="customDateFrom">From Date</Label>
            <Input
              id="customDateFrom"
              type="date"
              value={customDateFrom}
              onChange={(e) => onCustomDateChange("customDateFrom", e.target.value)}
              className="w-[150px]"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="customDateTo">To Date</Label>
            <Input
              id="customDateTo"
              type="date"
              value={customDateTo}
              onChange={(e) => onCustomDateChange("customDateTo", e.target.value)}
              className="w-[150px]"
            />
          </div>
        </>
      )}

      <TransactionAccountSearchInput ref={accountRef} onAccountSelect={onAccountSelect} />

      <Button onClick={handleClearAll} variant="outline" className="mt-auto bg-transparent">
        <X className="mr-2 h-4 w-4" /> Clear All Filters
      </Button>
    </div>
  );
}
