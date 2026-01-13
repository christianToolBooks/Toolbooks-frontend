import Link from "next/link";
import { Eye, Download, Edit, Send } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Invoice } from "@/src/types/invoice";
import { formatDate } from "@/src/lib/utils/formatters";

interface InvoiceActionsFooterProps {
  invoice: Invoice;
  onPreview: () => void;
  // onDownload: (invoiceId: string) => void;
}

export default function InvoiceActionsFooter({
  invoice,
  onPreview,
  // onDownload
}: InvoiceActionsFooterProps) {
  return (
    <div className="flex justify-between items-center pt-4 border-t">
      <div className="text-sm text-muted-foreground">
        Created: {formatDate(invoice.createdAt)} • Updated:{" "}
        {formatDate(invoice.updatedAt)}
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={onPreview}>
          <Eye className="mr-2 h-4 w-4" />
          Preview PDF
        </Button>
        {/* <Button
          variant="outline"
          size="sm"
          onClick={() => onDownload(invoice.id)}
        >
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button> */}
        <Link href={`/invoices/${invoice.id}/edit`} passHref>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </Link>
        <Button size="sm">
          <Send className="mr-2 h-4 w-4" />
          Send
        </Button>
      </div>
    </div>
  );
}