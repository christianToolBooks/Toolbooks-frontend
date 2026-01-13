"use client";
import { useState, useEffect } from "react";
import { BankReconciliationApiResponse } from "@/src/types/bank-reconciliation";
import { useReconciliationPDFs } from "./useReconciliationPDFs";
import { getAllReconciliations } from "@/src/lib/services/bankReconciliation";

export function useMonthDownloadDialog() {
  const {
    selectedYear,
    selectedMonth,
    setSelectedYear,
    setSelectedMonth,
    downloadMonthPDF,
  } = useReconciliationPDFs();

  const [open, setOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<BankReconciliationApiResponse[]>([]);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setResult([]);
  }, [selectedYear, selectedMonth]);

  function openDialog() {
    setOpen(true);
    setResult([]);
  }

  function closeDialog() {
    setOpen(false);
    setResult([]);
    setChecking(false);
    setDownloading(false);
  }

  async function checkAvailability() {
    setChecking(true);
    setResult([]);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const response = await getAllReconciliations(1, 1000); 
      if (!("code" in response && response.code === 200 && response.data)) {
        console.error("Error fetching all reconciliations");
        setResult([]);
        setChecking(false);
        return;
      }
      const allReconciliations = response.data.items || [];

      const filtered = allReconciliations.filter(rec => {
        if (!rec || !rec.reconciliation) return false;

        const [year, month] = rec.periodEnd.split('-').map(Number);
        return year === selectedYear && month === selectedMonth;
      });

      setResult(filtered);
    } catch (error) {
      console.error("Error checking availability:", error);
      setResult([]);
    } finally {
      setChecking(false);
    }
  }

  async function download() {
    if (result.length === 0) return;

    setDownloading(true);
    try {
      await downloadMonthPDF(selectedYear, selectedMonth);
    } catch (error) {
      console.error("Error downloading PDFs:", error);
    } finally {
      setDownloading(false);
      closeDialog();
    }
  }

  return {
    open,
    checking,
    result,
    downloading,
    selectedYear,
    selectedMonth,
    setSelectedYear,
    setSelectedMonth,

    openDialog,
    closeDialog,
    checkAvailability,
    download,
  };
}
