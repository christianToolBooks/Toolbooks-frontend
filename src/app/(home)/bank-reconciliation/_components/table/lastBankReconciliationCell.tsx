import { Clock } from "lucide-react";

interface Props {
  label: string;
  hasReconciliation: boolean;
}

export function LastBankReconciliationCell({
  label,
  hasReconciliation,
}: Props) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {hasReconciliation && (
        <Clock className="h-4 w-4 text-muted-foreground" />
      )}
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
