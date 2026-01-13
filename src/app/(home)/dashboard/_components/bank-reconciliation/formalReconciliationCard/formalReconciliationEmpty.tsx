import { FolderOpen } from "lucide-react";

export function FormalReconciliationEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-white shadow-sm p-8 mb-4">
        <FolderOpen className="w-16 h-16 text-chart-1" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        No Reconciliations Available
      </h3>
      <p className="text-sm text-gray-600 text-center max-w-sm">
        There are no reconciliations for this period. Select a different
        month or year to view available data.
      </p>
    </div>
  );
}
