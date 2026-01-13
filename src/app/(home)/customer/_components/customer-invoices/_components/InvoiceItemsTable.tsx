import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Separator } from "@/src/components/ui/separator";
import { Invoice } from "@/src/types/invoice";
import { calculateInvoiceTotal } from "../utils/invoiceHelpers";
import { formatCurrency } from "@/src/lib/utils/formatters";

interface InvoiceItemsTableProps {
  invoice: Invoice;
}

export default function InvoiceItemsTable({ invoice }: InvoiceItemsTableProps) {
  const invoiceTotal = calculateInvoiceTotal(invoice);

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Invoice Items</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Tax Code</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoice.items.map((item) => {
            const quantity = parseInt(item.quantity);
            const unitPrice = parseFloat(item.unitPrice);
            const itemTotal = quantity * unitPrice;

            return (
              <TableRow key={item.id}>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {item.department || "N/A"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {item.taxCode || "N/A"}
                  </span>
                </TableCell>
                <TableCell className="text-right">{quantity}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(unitPrice)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(itemTotal)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(parseFloat(invoice.subtotal))}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>{formatCurrency(parseFloat(invoice.taxTotal))}</span>
          </div>
          {parseFloat(invoice.discountTotal) > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Discount:</span>
              <span>-{formatCurrency(parseFloat(invoice.discountTotal))}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span>{formatCurrency(invoiceTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}