'use client';

import { useParams } from "next/navigation";
import { InvoicesProvider } from "../../invoices/context/invoiceProvider";
import CustomerInvoices from "../_components/customer-invoices/customer-invoices";

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params?.id as string;

  return (
    <div className="@container/main px-4 lg:px-6">
      <InvoicesProvider>
        <CustomerInvoices customerId={customerId} />
      </InvoicesProvider>
    </div>
  );
}