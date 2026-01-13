import { useBankReconciliation } from "@/src/app/(home)/dashboard/hooks/useBankReconciliation";
import { getAllSummarySessionsPDF, getSessionPDF } from "@/src/lib/services/bankReconciliation";
import { useState } from "react";

export function useReconciliationPDFs() {
  const {
    allReconciliations,
    paginationInfo,
    selectedYear,
    selectedMonth,
    setSelectedYear,
    setSelectedMonth,
    loading,
    error,
    refetch,
    fetchPage,
  } = useBankReconciliation();

  const [downloading, setDownloading] = useState(false);

  async function downloadMonthPDF(year: number, month: number) {
    setDownloading(true);
    try {
      const zipBlob = await getAllSummarySessionsPDF(year, month);
      if (zipBlob instanceof Blob) {
        const url = window.URL.createObjectURL(zipBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `reconciliations-${year}-${String(month).padStart(2, '0')}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return zipBlob;
      }
    } catch (err) {
      console.error("Error downloading month PDF:", err);
    } finally {
      setDownloading(false);
    }
  }

  async function downloadSessionPDF(sessionId: string, period?: string) {
    setDownloading(true);
    try {
      const pdfBlob = await getSessionPDF(sessionId);
      if (pdfBlob instanceof Blob) {
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = period ? `reconciliation-${period}.pdf` : `reconciliation-${sessionId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Error downloading session PDF:", err);
    } finally {
      setDownloading(false);
    }
  }

  async function getSessionPDFUrl(sessionId: string): Promise<string | null> {
    try {
      const pdfBlob = await getSessionPDF(sessionId);
      if (pdfBlob instanceof Blob) {
        return window.URL.createObjectURL(pdfBlob);
      }
      return null;
    } catch (err) {
      console.error("Error getting session PDF URL:", err);
      return null;
    }
  }

  return {
    allReconciliations,
    paginationInfo,
    selectedYear,
    selectedMonth,
    setSelectedYear,
    setSelectedMonth,
    loading,
    error,
    refetch,
    fetchPage,
    downloading,
    downloadMonthPDF,
    downloadSessionPDF,
    getSessionPDFUrl,
  };
}
