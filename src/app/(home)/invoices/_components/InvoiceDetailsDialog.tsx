'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Invoice } from '@/src/types/invoice';
import { formatCurrency } from '@/src/lib/utils/formatters';
import { Badge } from '@/src/components/ui/badge';
import { Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';

interface InvoiceDetailsDialogProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export function InvoiceDetailsDialog({
  invoice,
  isOpen,
  onClose,
  isLoading,
}: InvoiceDetailsDialogProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      draft: 'secondary',
      sent: 'default',
      paid: 'default',
      overdue: 'destructive',
      cancelled: 'destructive',
    };

    return (
      <Badge variant={variants[status] || 'default'} className="capitalize">
        {status}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl w-full overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !invoice ? (
          <div className="text-center p-12 text-muted-foreground">
            Invoice not found
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold">{invoice.invoiceNumber}</h3>
                <p className="text-muted-foreground">
                  Customer: {invoice.customer?.name || 'N/A'}
                </p>
                {invoice.customer?.email && (
                  <p className="text-sm text-muted-foreground">
                    {invoice.customer.email}
                  </p>
                )}
              </div>
              <div className="text-right">
                {getStatusBadge(invoice.status)}
                <p className="text-sm text-muted-foreground mt-2">
                  Date: {new Date(invoice.invoiceDate + 'T00:00:00').toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Due: {new Date(invoice.dueDate + 'T00:00:00').toLocaleDateString()}
                </p>
              </div>
            </div>

            {invoice.memo && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold mb-2 text-blue-900">Memo</h4>
                <p className="text-blue-800 text-sm whitespace-pre-wrap">{invoice.memo}</p>
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-3">Items</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Tax Code</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {item.department || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {item.taxCode || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {parseInt(item.quantity)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(parseFloat(item.unitPrice))}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(parseFloat(item.amount))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>{formatCurrency(parseFloat(invoice.subtotal))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax:</span>
                  <span>{formatCurrency(parseFloat(invoice.taxTotal))}</span>
                </div>
                {parseFloat(invoice.discountTotal) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount:</span>
                    <span className="text-red-600">
                      -{formatCurrency(parseFloat(invoice.discountTotal))}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span>{formatCurrency(parseFloat(invoice.total))}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
