import { MoreHorizontal } from 'lucide-react';

import { Invoice } from '@/src/types/invoice';
import { UseInvoiceContex } from '../context/invoiceProvider';
import { Button } from '@/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import PreviewPdf from './PreviewPdf';

const InvoiceActions = ({ invoice }: { invoice: Invoice }) => {
  const {
    downloadInvoicePdf,
    isPdfOpen,
    setPdfOpen,
    openInvoiceDetails,
  } = UseInvoiceContex();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => navigator.clipboard.writeText(invoice.id)}
          >
            Copy invoice ID
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              openInvoiceDetails(invoice.id);
            }}
          >
            View Details
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setPdfOpen(true);
            }}
          >
            View PDF
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              downloadInvoicePdf(invoice.id);
            }}
          >
            Download PDF
          </DropdownMenuItem>

          <DropdownMenuItem disabled>Send by Email</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PreviewPdf
        invoiceId={invoice.id}
        isOpen={isPdfOpen}
        onClose={() => setPdfOpen(false)}
      />
    </>
  );
};

export default InvoiceActions;
