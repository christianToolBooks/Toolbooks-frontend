import { TableCell, TableRow } from "@/src/components/ui/table"
import { Badge } from "@/src/components/ui/badge"
import { ReconciliationSessionItem } from "@/src/types/bank-reconciliation"
import { formatCurrency, formatDate, getExceptionBadgeVariant, getExceptionLabel } from "@/src/lib/utils/formatters"

interface SessionTableRowProps {
  item: ReconciliationSessionItem
}

export function SessionTableRow({ item }: SessionTableRowProps) {
  const { bankTransaction, ledgerTransaction, type, exceptionType, note } = item

  return (
    <TableRow>
      <TableCell>
        <Badge variant={type === "match" ? "default" : "destructive"}>{type === "match" ? "Match" : "Exception"}</Badge>
      </TableCell>

      <TableCell>
        {formatDate(bankTransaction?.date || ledgerTransaction?.date)}
      </TableCell>

      <TableCell>{bankTransaction?.description || <span className="text-muted-foreground">—</span>}</TableCell>

      <TableCell>
        {bankTransaction ? formatCurrency(bankTransaction.amount) : <span className="text-muted-foreground">—</span>}
      </TableCell>

      <TableCell>{ledgerTransaction?.description || <span className="text-muted-foreground">—</span>}</TableCell>

      <TableCell>
        {ledgerTransaction ? (
          formatCurrency(ledgerTransaction.amount)
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>

      <TableCell>
        <div className="flex flex-col gap-1">
          {exceptionType && (
            <Badge variant={getExceptionBadgeVariant(exceptionType)}>{getExceptionLabel(exceptionType)}</Badge>
          )}
          {note && <span className="text-xs text-muted-foreground">{note}</span>}
        </div>
      </TableCell>
    </TableRow>
  )
}
