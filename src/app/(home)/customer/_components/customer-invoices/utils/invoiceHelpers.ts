import { Invoice } from "@/src/types/invoice";

export const getStatusColor = (status: string) => {
  const statusLower = status?.toLowerCase();
  switch (statusLower) {
    case "paid":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "sent":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "draft":
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    case "overdue":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "cancelled":
    case "void":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

export const calculateInvoiceTotal = (invoice: Invoice): number => {
  if (invoice.total) {
    return parseFloat(invoice.total);
  }

  if (!invoice.items || invoice.items.length === 0) {
    return 0;
  }

  const itemsTotal = invoice.items.reduce((total, item) => {
    const quantity = parseInt(item.quantity) || 0;
    const unitPrice = parseFloat(item.unitPrice) || 0;
    const itemAmount = quantity * unitPrice;

    return total + itemAmount;
  }, 0);

  const taxTotal = parseFloat(invoice.taxTotal) || 0;

  const discountTotal = parseFloat(invoice.discountTotal) || 0;

  return itemsTotal + taxTotal - discountTotal;
};