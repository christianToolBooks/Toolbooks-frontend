import { ScrollArea } from "@/src/components/ui/scroll-area";
import { Badge } from "@/src/components/ui/badge";
import { Calendar } from "lucide-react";
import { formatCurrency } from "@/src/lib/utils/formatters";
import type { ReconciliationQueryApiResponse } from "@/src/types/bank-reconciliation";

export function FormalReconciliationAccounts({
  accounts,
}: {
  accounts: ReconciliationQueryApiResponse["accounts"];
}) {
  return (
    <ScrollArea className="h-[60vh]">
      <div className="divide-y divide-chart-1/20">
        {accounts.map((account) => (
          <div
            key={account.statementId}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm py-4">
              <h5 className="font-semibold">{account.accountName}</h5>

              <div>
                <p className="text-xs text-gray-500">Opening Balance</p>
                {formatCurrency(account.openingBalance)}
              </div>

              <div>
                <p className="text-xs text-gray-500">Closing Balance</p>
                {formatCurrency(account.closingBalance)}
              </div>

              <div>
                <p className="text-xs text-gray-500">Only in Bank</p>
                {account.reconciliation?.onlyInBank ?? 0}
              </div>

              <div>
                <p className="text-xs text-gray-500">Only in Books</p>
                {account.reconciliation?.onlyInBooks ?? 0}
              </div>

              <Badge variant="outline">
                {account.reconciliation?.matched ?? 0} matched
              </Badge>
            </div>

            <div className="flex gap-4 text-xs text-gray-500 border-t pt-2">
              <Calendar className="h-3 w-3" />
              {account.periodStart} → {account.periodEnd}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
