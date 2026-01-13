"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { useReconciliationPDFs } from "../_hooks/table/useReconciliationPDFs";
import { useReconciliationFilters } from "../_hooks/table/useReconciliationFilters";
import { ReconciliationStats } from "./ReconciliationStats";
import { ReconciliationMobileList } from "./ReconciliationMobileList";
import { ReconciliationFeatures } from "./ReconciliationFeatures";
import { MonthDownloadDialog } from "./MonthDownloadDialog";
import { ReconciliationPDFPreview } from "./ReconciliationPDFPreview";
import "@/src/lib/pdfConfig";
import { getAllReconciliations } from "@/src/lib/services/bankReconciliation";
import { useMonthDownloadDialog } from "../_hooks/table/useMonthDownloadDialog";
import { usePdfPreview } from "../_hooks/table/usePdfPreview";
import { ReconciliationTable } from "./table/reconciliationTable";
import { useRouter } from "next/navigation";

export function ReconciliationDashboard() {
  const router = useRouter();
  const {
    allReconciliations,
    paginationInfo,
    downloading,
    downloadSessionPDF,
    loading,
    refetch,
    fetchPage,
  } = useReconciliationPDFs();

  const reconciliations = Array.isArray(allReconciliations)
    ? allReconciliations
    : [];
  const { search, setSearch, filtered } =
    useReconciliationFilters(reconciliations);

  const monthDialog = useMonthDownloadDialog();

  const {
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
  } = usePdfPreview();
  const handleDownloadPdf = async (rec: (typeof reconciliations)[0]) => {
    if (rec.reconciliation) {
      await downloadSessionPDF(rec.reconciliation.sessionId, rec.periodEnd);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (paginationInfo) {
      fetchPage(newPage, paginationInfo.limit);
    }
  };

  const handleViewSession = (sessionId: string) => {
    router.push(`/bank-reconciliation/session/${sessionId}`);
  };

  const [allReconciliationsForStats, setAllReconciliationsForStats] = useState<
    typeof reconciliations
  >([]);

  useEffect(() => {
    async function fetchAllForStats() {
      const response = await getAllReconciliations(1, 1000);
      if ("code" in response && response.code === 200 && response.data) {
        setAllReconciliationsForStats(response.data.items || []);
      }
    }
    fetchAllForStats();
  }, []);

  const completedReconciliations = allReconciliationsForStats.filter(
    (rec) => rec.reconciliation !== null
  ).length;

  const matchRate = 98.4;

  return (
    <div className="space-y-6">
      <ReconciliationStats
        completedReconciliations={completedReconciliations}
        totalReconciliations={allReconciliationsForStats.length}
        matchRate={matchRate}
      />

      <Card>
        <CardContent className="space-y-4 pt-6">
          <ReconciliationTable
            data={filtered}
            paginationInfo={paginationInfo}
            search={search}
            loading={loading}
            downloading={downloading}
            onSearchChange={setSearch}
            onPageChange={handlePageChange}
            onRefresh={refetch}
            onPreview={handlePreview}
            onDownload={handleDownloadPdf}
            onViewSession={handleViewSession}
            onDownloadMonth={monthDialog.openDialog}
          />

          <ReconciliationMobileList
            data={filtered}
            downloading={downloading}
            loading={loading}
            onPreview={handlePreview}
            onDownload={handleDownloadPdf}
          />
        </CardContent>
      </Card>

      <ReconciliationFeatures />

      <MonthDownloadDialog
        open={monthDialog.open}
        onClose={monthDialog.closeDialog}
        checking={monthDialog.checking}
        result={monthDialog.result}
        downloading={monthDialog.downloading}
        selectedYear={monthDialog.selectedYear}
        selectedMonth={monthDialog.selectedMonth}
        onYearChange={monthDialog.setSelectedYear}
        onMonthChange={monthDialog.setSelectedMonth}
        onCheckAvailability={monthDialog.checkAvailability}
        onDownload={monthDialog.download}
      />

      <ReconciliationPDFPreview
        open={isPreviewOpen}
        selectedPdf={selectedPdf}
        previewUrl={previewUrl}
        isLoadingPreview={isLoadingPreview}
        pdfCurrentPage={pdfCurrentPage}
        numPages={numPages}
        zoom={zoom}
        onClose={handleClosePreview}
        onPageChange={setPdfCurrentPage}
        onZoomChange={setZoom}
        onLoadSuccess={handleDocumentLoadSuccess}
        onDownload={handleDownloadCurrent}
      />
    </div>
  );
}
