import { CardHeader, CardTitle } from "@/src/components/ui/card";
import { Calendar, CheckCircle2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { MONTHS } from "@/src/types/bank-reconciliation";

interface Props {
  selectedYear: number;
  selectedMonth: number;
  years: number[];
  loading: boolean;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
}

export function FormalReconciliationHeader({
  selectedYear,
  selectedMonth,
  years,
  loading,
  onYearChange,
  onMonthChange,
}: Readonly<Props>) {
  return (
    <CardHeader className="pb-3 space-y-4">
      <CardTitle className="flex items-center gap-2 text-chart-1">
        <CheckCircle2 className="h-5 w-5" />
        Monthly Formal Reconciliation
      </CardTitle>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-md font-medium text-chart-1">
          <Calendar className="h-4 w-4" />
          Select Period
        </div>

        <div className="flex gap-3 flex-wrap">
          <Select
            disabled={loading}
            value={selectedMonth.toString()}
            onValueChange={(v) => onMonthChange(Number(v))}
          >
            <SelectTrigger className="w-[160px] bg-white">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m.value} value={m.value.toString()}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            disabled={loading}
            value={selectedYear.toString()}
            onValueChange={(v) => onYearChange(Number(v))}
          >
            <SelectTrigger className="w-[120px] bg-white">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardHeader>
  );
}
