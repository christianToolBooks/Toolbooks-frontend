"use client";

import { useState } from "react";
import { BankReconciliationApiResponse } from "@/src/types/bank-reconciliation";
import { useReconciliationPDFs } from "./useReconciliationPDFs";

export function usePdfPreview() {
  const { getSessionPDFUrl, downloadSessionPDF } = useReconciliationPDFs();

  const [selectedPdf, setSelectedPdf] = useState<BankReconciliationApiResponse | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [pdfCurrentPage, setPdfCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [zoom, setZoom] = useState(110);

  async function handlePreview(rec: BankReconciliationApiResponse) {
    setSelectedPdf(rec);
    setPdfCurrentPage(1);
    setZoom(110);
    setIsLoadingPreview(true);
    setIsPreviewOpen(true);

    const url = rec.reconciliation
      ? await getSessionPDFUrl(rec.reconciliation.sessionId)
      : null;

    setPreviewUrl(url);
    setIsLoadingPreview(false);
  }

  function handleClosePreview() {
    setIsPreviewOpen(false);
    setSelectedPdf(null);
    setPreviewUrl(null);
    setNumPages(null);
  }

  function handleDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoadingPreview(false);
  }

  async function handleDownloadCurrent() {
    if (selectedPdf?.reconciliation) {
      await downloadSessionPDF(
        selectedPdf.reconciliation.sessionId,
        selectedPdf.periodEnd
      );
    }
  }

  return {
    selectedPdf,
    previewUrl,
    isPreviewOpen,
    isLoadingPreview,
    pdfCurrentPage,
    numPages,
    zoom,

    handlePreview,
    handleClosePreview,
    handleDocumentLoadSuccess,
    handleDownloadCurrent,

    setPdfCurrentPage,
    setZoom,
  };
}
