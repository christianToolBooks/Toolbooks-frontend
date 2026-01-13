import {
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";
import { Separator } from "@/src/components/ui/separator";
import { Badge } from "@/src/components/ui/badge";
import { Invoice } from "@/src/types/invoice";
import InvoiceItemsTable from "./InvoiceItemsTable";
import InvoiceActionsFooter from "./InvoiceActionsFooter";
import {
  calculateInvoiceTotal,
  getStatusColor,
} from "../utils/invoiceHelpers";
import PreviewPdf from "@/src/app/(home)/invoices/_components/PreviewPdf";
import { InvoicesProvider } from "@/src/app/(home)/invoices/context/invoiceProvider";
import { formatCurrency, formatDate } from "@/src/lib/utils/formatters";

interface InvoiceCardItemProps {
  invoice: Invoice;
  isExpanded: boolean;
  onToggle: () => void;
  onPreview: () => void;
  // onDownload: (invoiceId: string) => void;
  isPreviewOpen: boolean;
  onClosePreview: () => void;
}

export default function InvoiceCardItem({
  invoice,
  isExpanded,
  onToggle,
  onPreview,
  // onDownload,
  isPreviewOpen,
  onClosePreview,
}: InvoiceCardItemProps) {
  const invoiceTotal = calculateInvoiceTotal(invoice);
  const statusColor = getStatusColor(invoice.status);

  return (
    <>
      <Card className="overflow-hidden">
        <Collapsible open={isExpanded} onOpenChange={onToggle}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {invoice.invoiceNumber || "Draft Invoice"}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(invoice.invoiceDate)}
                      </span>
                      <span>
                        Due: {formatDate(invoice.dueDate)}
                      </span>
                      <span>
                        {invoice.items.length} item
                        {invoice.items.length !== 1 ? "s" : ""}
                      </span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {formatCurrency(invoiceTotal)}
                    </div>
                    <Badge className={statusColor}>
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="pt-0">
              <Separator className="mb-4" />
              {invoice.memo && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-1">Memo:</p>
                  <p className="text-sm text-blue-800">{invoice.memo}</p>
                </div>
              )}
              <InvoiceItemsTable invoice={invoice} />
              <InvoiceActionsFooter
                invoice={invoice}
                onPreview={onPreview}
                // onDownload={onDownload}
              />
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <InvoicesProvider>
        <PreviewPdf
          invoiceId={invoice.id}
          isOpen={isPreviewOpen}
          onClose={onClosePreview}
        />
      </InvoicesProvider>
    </>
  );
}