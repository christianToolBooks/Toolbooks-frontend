"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import useCustomerInvoices from "./hooks/useInvoicesById";
import InvoiceLoadingState from "./_components/InvoiceLoadingState";
import InvoiceSummaryCards from "./_components/InvoiceSummaryCards";
import EmptyInvoiceState from "./_components/EmptyInvoiceState";
import InvoiceCardItem from "./_components/InvoiceCardItem";
import Link from "next/link";
import { InvoicesProvider } from "../../../invoices/context/invoiceProvider";

export interface InvoiceCustomerProps {
  customerId: string;
}

export default function CustomerInvoices({ customerId }: InvoiceCustomerProps) {
  const {
    customerInvoices,
    expandedInvoices,
    isLoading,
    toggleInvoice,
    getInvoiceStats,
    getCustomerName,
  } = useCustomerInvoices(customerId);

  const [previewInvoiceId, setPreviewInvoiceId] = useState<string | null>(null);

  const { totalInvoices, totalAmount } = getInvoiceStats();
  const customerName = getCustomerName();

  const handlePreview = (invoiceId: string) => {
    setPreviewInvoiceId(invoiceId);
  };

  const handleClosePreview = () => {
    setPreviewInvoiceId(null);
  };

  if (isLoading) {
    return <InvoiceLoadingState />;
  }

  return (
    <InvoicesProvider>
      <div className="space-y-6 p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Customer Invoices
              </h2>
              <p className="text-muted-foreground">
                {customerName
                  ? `Managing invoices for ${customerName}`
                  : "Manage and track all invoices for this customer"}
              </p>
            </div>
            <Link href="/invoices/new" passHref>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Create New Invoice
              </Button>
            </Link>
          </div>

          <InvoiceSummaryCards
            totalInvoices={totalInvoices}
            totalAmount={totalAmount}
          />
        </div>

        <div className="space-y-4">
          {customerInvoices.length === 0 ? (
            <EmptyInvoiceState />
          ) : (
            customerInvoices.map((invoice) => (
              <InvoiceCardItem
                key={invoice.id}
                invoice={invoice}
                isExpanded={expandedInvoices.has(invoice.id)}
                onToggle={() => toggleInvoice(invoice.id)}
                onPreview={() => handlePreview(invoice.id)}
                isPreviewOpen={previewInvoiceId === invoice.id}
                onClosePreview={handleClosePreview}
              />
            ))
          )}
        </div>
      </div>
    </InvoicesProvider>
  );
}
