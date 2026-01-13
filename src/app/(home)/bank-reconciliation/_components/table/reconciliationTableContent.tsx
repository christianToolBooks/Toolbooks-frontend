import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/src/components/ui/table";
import { Loader2 } from "lucide-react";
import { BankReconciliationApiResponse } from "@/src/types/bank-reconciliation";
import { ReconciliationRow } from "./reconciliationRow";

interface Props {
  data: BankReconciliationApiResponse[];
  loading: boolean;
  onPreview: (rec: BankReconciliationApiResponse) => void;
  onDownload: (rec: BankReconciliationApiResponse) => void;
  onViewSession: (sessionId: string) => void;
}

export function ReconciliationTableContent({
  data,
  loading,
  onPreview,
  onDownload,
  onViewSession,
}: Props) {
  if (loading && data.length === 0) {
    return (
      <div className="py-10 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!loading && data.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        No reconciliation reports found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Period</TableHead>
          <TableHead>Account</TableHead>
          <TableHead>Last Bank Reconciliation</TableHead>
          <TableHead>Session Items</TableHead>
          <TableHead>Period Start</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((rec) => (
          <ReconciliationRow
            key={rec.statementId}
            rec={rec}
            onPreview={onPreview}
            onDownload={onDownload}
            onViewSession={onViewSession}
          />
        ))}
      </TableBody>
    </Table>
  );
}
