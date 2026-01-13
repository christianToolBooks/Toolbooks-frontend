"use client";
import { useParams } from "next/navigation";
import CustomerInvoices from "../../_components/customer-invoices/customer-invoices";
import UseInvoicesById from "../../_components/customer-invoices/hooks/useInvoicesById";

export default function Page() {
    const params = useParams()
    const customerId = params?.id as string;

    if (!customerId) {
        return <div className="text-center text-red-500">Customer ID is required</div>;
    }

  return <CustomerInvoices customerId={customerId} />
}
