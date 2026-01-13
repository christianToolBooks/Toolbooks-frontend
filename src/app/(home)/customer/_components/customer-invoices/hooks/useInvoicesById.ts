// hooks/useCustomerInvoices.ts
import { fetchInvoicesByCustomer } from "@/src/lib/services/invoiceService";
import { Invoice } from "@/src/types/invoice";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { calculateInvoiceTotal } from "../utils/invoiceHelpers";

export default function useCustomerInvoices(customerId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [customerInvoices, setCustomerInvoices] = useState<Invoice[]>([]);
  const [expandedInvoices, setExpandedInvoices] = useState<Set<string>>(new Set());

  const getInvoicesByCustomer = async (
    id: string
  ): Promise<Invoice[] | undefined> => {
    setIsLoading(true);
    try {
      const response = await fetchInvoicesByCustomer(id);

      if ("statusCode" in response) {
        toast.error(response.message || "Cannot get invoices for this customer");
        setCustomerInvoices([]);
        return [];
      }

      const invoices = response.data || [];
      setCustomerInvoices(invoices);
      return invoices;
    } catch (error) {
      console.error("Error fetching invoices by customer:", error);
      toast.error("Error fetching invoices by customer");
      setCustomerInvoices([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const toggleInvoice = (invoiceId: string) => {
    const newExpanded = new Set(expandedInvoices);
    if (newExpanded.has(invoiceId)) {
      newExpanded.delete(invoiceId);
    } else {
      newExpanded.add(invoiceId);
    }
    setExpandedInvoices(newExpanded);
  };

  const getInvoiceStats = () => {
    const totalInvoices = customerInvoices.length;
    const totalAmount = customerInvoices.reduce(
      (sum, invoice) => sum + calculateInvoiceTotal(invoice),
      0
    );

    return {
      totalInvoices,
      totalAmount,
    };
  };

  const getCustomerName = () => {
    return customerInvoices.length > 0 && customerInvoices[0].customer
      ? customerInvoices[0].customer.name
      : null;
  };

  useEffect(() => {
    if (customerId) {
      getInvoicesByCustomer(customerId);
    }
  }, [customerId]);

  return {
    customerInvoices,
    expandedInvoices,
    isLoading,
    getInvoicesByCustomer,
    toggleInvoice,
    getInvoiceStats,
    getCustomerName,
  };
}