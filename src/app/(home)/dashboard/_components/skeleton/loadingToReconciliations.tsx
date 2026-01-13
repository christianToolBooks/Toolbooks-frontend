import { Loader2 } from "lucide-react";

export function ReconciliationLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-chart-1" />
      <p className="text-sm text-muted-foreground">
        Loading reconciliation data…
      </p>
    </div>
  );
}
