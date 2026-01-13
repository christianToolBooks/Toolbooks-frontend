import { TableCell, TableRow } from "@/src/components/ui/table";
import { BankReconciliationApiResponse } from "@/src/types/bank-reconciliation";
import { FileText } from "lucide-react";

import { useLastBankReconciliation } from "../../_hooks/table/useLastBankReconciliation";
import { useReconciliationActions } from "../../_hooks/table/useReconciliationActions";
import { LastBankReconciliationCell } from "./lastBankReconciliationCell";
import { ReconciliationActionsMenu } from "./reconciliationActionsMenu";

interface Props {
  rec: BankReconciliationApiResponse;
  onPreview: (rec: BankReconciliationApiResponse) => void;
  onDownload: (rec: BankReconciliationApiResponse) => void;
  onViewSession: (sessionId: string) => void;
}

export function ReconciliationRow({
  rec,
  onPreview,
  onDownload,
  onViewSession,
}: Props) {
  const lastReconciliation = useLastBankReconciliation(rec);

  const actions = useReconciliationActions({
    onPreview,
    onDownload,
    onViewSession,
  })(rec);

  const period = new Date(rec.periodEnd).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <TableRow
      className="hover:bg-muted/40 cursor-pointer"
      onClick={() => onPreview(rec)}
    >
      <TableCell>
        <div className="space-y-1">
          <div className="font-medium">{period}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <FileText className="h-3 w-3" />
            Reconciliation report
          </div>
        </div>
      </TableCell>

      <TableCell>{rec.accountName}</TableCell>

      <TableCell>
        <LastBankReconciliationCell {...lastReconciliation} />
      </TableCell>
       <TableCell>{rec.reconciliation?.sessionItemsCount || <span className="text-muted-foreground">No items yet</span>}</TableCell>
      <TableCell>{rec.periodStart}</TableCell>
      <TableCell
        className="text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <ReconciliationActionsMenu actions={actions} />
      </TableCell>
    </TableRow>
  );
}
