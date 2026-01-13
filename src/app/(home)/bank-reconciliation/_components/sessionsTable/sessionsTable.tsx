import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { SessionTableRow } from "./sessionTableRow"
import { ReconciliationSessionItem } from "@/src/types/bank-reconciliation"

interface SessionsTableProps {
  items: ReconciliationSessionItem[]
}

export function SessionsTable({ items }: SessionsTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Bank Description</TableHead>
            <TableHead >Bank Amount</TableHead>
            <TableHead>Ledger Description</TableHead>
            <TableHead>Ledger Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No transactions to display
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => <SessionTableRow key={item.id} item={item} />)
          )}
        </TableBody>
      </Table>
    </div>
  )
}
