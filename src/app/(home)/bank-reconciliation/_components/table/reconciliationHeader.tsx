import { Button } from "@/src/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { RotateCcw, Download, Search, X } from "lucide-react";

interface Props {
  search: string;
  loading: boolean;
  hasData: boolean;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onDownloadMonth: () => void;
}

export function ReconciliationHeader({
  search,
  loading,
  hasData,
  onSearchChange,
  onRefresh,
  onDownloadMonth,
}: Props) {
  return (
    <CardHeader className="space-y-2">
      <div className="flex flex-col gap-2 md:flex-row md:justify-between">
        <div>
          <CardTitle>Reconciliation Reports</CardTitle>
          <CardDescription>
            Download PDF copies of your bank reconciliations.
          </CardDescription>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={onDownloadMonth}
            disabled={loading || !hasData}
          >
            <Download className="h-4 w-4 mr-1" />
            Download By Month
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search by period or account..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {search && (
          <Button variant="ghost" size="icon" onClick={() => onSearchChange("")}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </CardHeader>
  );
}
