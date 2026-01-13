import { UseInvoiceContex } from '../context/invoiceProvider';

export function useInvoices() {
  const context = UseInvoiceContex();

  return {
    invoices: context.invoices,
    loading: context.isLoadingInvoices,
    isSearching: context.isSearching,
    searchInvoices: context.searchInvoicesAction,
    clearSearch: context.clearSearch,
    fetchInvoices: context.fetchAllInvoices,
  };
}

export function useInvoiceDetails(invoiceId: string | null) {
  const context = UseInvoiceContex();

  return {
    invoice: context.invoice,
    loading: context.isLoadingInvoices,
    error: null,
  };
}
