"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { toast } from "sonner";
import type { Invoice, InvoiceSearchParams } from "@/src/types/invoice";
import type { Customer } from "@/src/types/customer";
import {
  getAllInvoices,
  getInvoiceById,
  searchInvoices,
  getInvoicePdf,
} from "@/src/lib/services/invoiceService";
import { fetchCustomers } from "@/src/lib/services/customersServices";
import { formatPhoneDisplay } from "@/src/lib/utils/formatters";

interface InvoiceContextProps {
  isLoadingInvoices: boolean;
  isLoadingCustomers: boolean;
  isLoadingBranding: boolean;
  isSearching: boolean;
  invoice: Invoice | null;
  invoices: Invoice[];
  customers: Customer[];
  pdfUrl: string | null;
  isPdfOpen: boolean;
  loadingPdf: boolean;
  selectedInvoiceForDetails: Invoice | null;
  isDetailsDialogOpen: boolean;
  isLoadingInvoiceDetails: boolean;
  getPdfPreview: (invoiceId: string) => Promise<void>;
  downloadInvoicePdf: (invoiceId: string) => Promise<void>;
  setPdfOpen: (isOpen: boolean) => void;
  fetchAllInvoices: () => Promise<void>;
  fetchInvoiceDetails: (id: string) => Promise<Invoice | null>;
  searchInvoicesAction: (params: InvoiceSearchParams) => Promise<void>;
  clearSearch: () => Promise<void>;
  fetchAllCustomers: () => Promise<void>;
  openInvoiceDetails: (invoiceId: string) => Promise<void>;
  closeInvoiceDetails: () => void;
  setInvoice: (invoice: Invoice | null) => void;
}

const InvoiceContext = createContext<InvoiceContextProps | undefined>(undefined);

export function InvoicesProvider({ children }: { children: React.ReactNode }) {
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [isLoadingBranding, setIsLoadingBranding] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isPdfOpen, setPdfOpen] = useState(false);
  const [selectedInvoiceForDetails, setSelectedInvoiceForDetails] = useState<Invoice | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isLoadingInvoiceDetails, setIsLoadingInvoiceDetails] = useState(false);

  const fetchAllInvoices = useCallback(async () => {
    setIsLoadingInvoices(true);
    try {
      const response = await getAllInvoices();

      if ("statusCode" in response) {
        toast.error(response.message || "Failed to fetch invoices");
        setInvoices([]);
        return;
      }

      setInvoices(response.data || []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to fetch invoices");
      setInvoices([]);
    } finally {
      setIsLoadingInvoices(false);
    }
  }, []);

  const fetchInvoiceDetails = useCallback(async (id: string): Promise<Invoice | null> => {
    try {
      const response = await getInvoiceById(id);

      if ("statusCode" in response) {
        toast.error(response.message || "Failed to fetch invoice details");
        return null;
      }

      const invoiceData = response.data || null;
      setInvoice(invoiceData);
      return invoiceData;
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      toast.error("Failed to fetch invoice details");
      return null;
    }
  }, []);

  const searchInvoicesAction = useCallback(async (params: InvoiceSearchParams) => {
    setIsSearching(true);
    try {
      const response = await searchInvoices(params);

      if ("statusCode" in response) {
        toast.error(response.message || "Search failed");
        return;
      }

      setInvoices(response.data || []);
    } catch (error) {
      console.error("Error searching invoices:", error);
      toast.error("Search failed");
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(async () => {
    await fetchAllInvoices();
  }, [fetchAllInvoices]);

  const getPdfPreview = useCallback(async (invoiceId: string) => {
    setLoadingPdf(true);
    setPdfUrl(null);

    try {
      const response = await getInvoicePdf(invoiceId);

      if ("statusCode" in response) {
        toast.error(response.message || "Failed to load PDF preview");
        console.error("Error loading PDF:", response);
        return;
      }

      if (!response.data?.url) {
        toast.error("Invalid PDF URL received");
        return;
      }

      setPdfUrl(response.data.url);
    } catch (error) {
      console.error("Error loading PDF preview:", error);
      toast.error("Failed to load PDF preview");
    } finally {
      setLoadingPdf(false);
    }
  }, []);

  const downloadInvoicePdf = useCallback(async (invoiceId: string) => {
    const toastId = toast.loading("Preparing download...");

    try {
      const response = await getInvoicePdf(invoiceId);

      if ("statusCode" in response) {
        toast.error(response.message || "Failed to download PDF", { id: toastId });
        return;
      }

      if (!response.data?.url) {
        toast.error("Invalid PDF URL received", { id: toastId });
        return;
      }

      const { url, filename } = response.data;
      const downloadFilename = filename || `invoice-${invoiceId}.pdf`;

      toast.loading("Downloading PDF...", { id: toastId });

      const pdfResponse = await fetch(url);
      if (!pdfResponse.ok) {
        throw new Error(`HTTP error! status: ${pdfResponse.status}`);
      }

      const blob = await pdfResponse.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = downloadFilename;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }, 100);

      toast.success("PDF downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF", { id: toastId });
    }
  }, []);

  const fetchAllCustomers = useCallback(async () => {
    setIsLoadingCustomers(true);
    try {
      const response = await fetchCustomers();

      if ("message" in response) {
        toast.error(response.message || "Failed to fetch customers");
        setCustomers([]);
        return;
      }

      const formatted = response.map((customer) => ({
        ...customer,
        phone: formatPhoneDisplay(customer.phone || ""),
      }));

      setCustomers(formatted);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to fetch customers");
      setCustomers([]);
    } finally {
      setIsLoadingCustomers(false);
    }
  }, []);

  

  const openInvoiceDetails = useCallback(async (invoiceId: string) => {
    setIsDetailsDialogOpen(true);
    setIsLoadingInvoiceDetails(true);
    setSelectedInvoiceForDetails(null);
    
    try {
      const invoiceData = await fetchInvoiceDetails(invoiceId);
      setSelectedInvoiceForDetails(invoiceData);
    } catch (error) {
      console.error("Error opening invoice details:", error);
      setSelectedInvoiceForDetails(null);
    } finally {
      setIsLoadingInvoiceDetails(false);
    }
  }, [fetchInvoiceDetails]);

  const closeInvoiceDetails = useCallback(() => {
    setIsDetailsDialogOpen(false);
    setSelectedInvoiceForDetails(null);
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchAllInvoices(),
        fetchAllCustomers(),
      ]);
    };

    initializeData();
  }, [fetchAllInvoices, fetchAllCustomers]);

  const contextValue = useMemo(
    () => ({
      isLoadingInvoices,
      isLoadingCustomers,
      isLoadingBranding,
      isSearching,
      invoice,
      invoices,
      customers,
      pdfUrl,
      isPdfOpen,
      loadingPdf,
      selectedInvoiceForDetails,
      isDetailsDialogOpen,
      isLoadingInvoiceDetails,
      getPdfPreview,
      downloadInvoicePdf,
      setPdfOpen,
      fetchAllInvoices,
      fetchInvoiceDetails,
      searchInvoicesAction,
      clearSearch,
      fetchAllCustomers,
      openInvoiceDetails,
      closeInvoiceDetails,
      setInvoice,
    }),
    [
      isLoadingInvoices,
      isLoadingCustomers,
      isLoadingBranding,
      isSearching,
      invoice,
      invoices,
      customers,
      pdfUrl,
      isPdfOpen,
      loadingPdf,
      selectedInvoiceForDetails,
      isDetailsDialogOpen,
      isLoadingInvoiceDetails,
      getPdfPreview,
      downloadInvoicePdf,
      fetchAllInvoices,
      fetchInvoiceDetails,
      searchInvoicesAction,
      clearSearch,
      fetchAllCustomers,
      openInvoiceDetails,
      closeInvoiceDetails,
    ]
  );

  return (
    <InvoiceContext.Provider value={contextValue}>
      {children}
    </InvoiceContext.Provider>
  );
}

export const UseInvoiceContex = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("UseInvoiceContex must be used within InvoicesProvider");
  }
  return context;
};
