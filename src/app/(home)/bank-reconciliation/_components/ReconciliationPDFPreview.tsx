"use client"

import type React from "react"
import { Document, Page } from "react-pdf"
import { Button } from "@/src/components/ui/button"
import { Skeleton } from "@/src/components/ui/skeleton"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, FileText, Maximize, X, Loader2 } from "lucide-react"
import type { BankReconciliationApiResponse } from "@/src/types/bank-reconciliation"
import { useState, useRef, useEffect } from "react"

interface ReconciliationPDFPreviewProps {
  open: boolean
  selectedPdf: BankReconciliationApiResponse | null
  previewUrl: string | null
  isLoadingPreview: boolean
  pdfCurrentPage: number
  numPages: number | null
  zoom: number
  onClose: () => void
  onPageChange: (page: number) => void
  onZoomChange: (zoom: number) => void
  onLoadSuccess: (data: { numPages: number }) => void
  onDownload: () => void
}

export function ReconciliationPDFPreview({
  open,
  selectedPdf,
  previewUrl,
  isLoadingPreview,
  pdfCurrentPage,
  numPages,
  zoom,
  onClose,
  onPageChange,
  onZoomChange,
  onLoadSuccess,
  onDownload,
}: ReconciliationPDFPreviewProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const viewerRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 100) {
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !viewerRef.current) return

    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y

    viewerRef.current.scrollLeft -= deltaX
    viewerRef.current.scrollTop -= deltaY

    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const fitToWidth = () => {
    const containerWidth = viewerRef.current?.clientWidth || 600
    const pageWidth = 612
    const newZoom = Math.round((containerWidth / pageWidth) * 100) - 10
    onZoomChange(Math.max(60, Math.min(200, newZoom)))
  }

  const handleDownload = async () => {
    setIsDownloading(true);
    await onDownload();
    setIsDownloading(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mouseup", handleMouseUp)
      return () => window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background rounded-lg shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 rounded-t-lg flex-shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <h2 className="text-lg md:text-xl font-semibold">Reconciliation PDF Preview</h2>
            {selectedPdf && (
              <span className="truncate text-xs md:text-sm text-muted-foreground">
                — {selectedPdf.periodStart} — {selectedPdf.periodEnd} — {selectedPdf.accountName}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          {/* Controls */}
          <div className="flex-shrink-0 px-6 py-3 border-b bg-muted/30">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Page Navigation */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => onPageChange(Math.max(1, pdfCurrentPage - 1))}
                  disabled={pdfCurrentPage <= 1}
                  title="Página anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs md:text-sm font-medium min-w-[100px] text-center">
                  Page {pdfCurrentPage} of {numPages || "..."}{" "}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => onPageChange(numPages ? Math.min(numPages, pdfCurrentPage + 1) : pdfCurrentPage + 1)}
                  disabled={!numPages || pdfCurrentPage >= (numPages ?? 0)}
                  title="Página siguiente"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => onZoomChange(Math.max(60, zoom - 10))}
                  disabled={zoom <= 60}
                  title="Alejar"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="w-14 text-center text-xs md:text-sm font-medium cursor-default">{zoom}%</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => onZoomChange(Math.min(200, zoom + 10))}
                  disabled={zoom >= 200}
                  title="Acercar"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={fitToWidth}
                  title="Ajustar al ancho"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>

              {/* Download Button */}
              {selectedPdf?.reconciliation && (
                <Button 
                  size="sm" 
                  onClick={handleDownload} 
                  disabled={isDownloading}
                  className="gap-2"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Download</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* PDF Viewer */}
          <div
            ref={viewerRef}
            className={`flex-1 overflow-auto bg-muted/10 ${
              isDragging ? "cursor-grabbing" : zoom > 100 ? "cursor-grab" : "cursor-default"
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsDragging(false)}
          >
            {isLoadingPreview && (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading PDF preview...</p>
                </div>
              </div>
            )}

            {!isLoadingPreview && selectedPdf && previewUrl && (
              <div className="w-full p-6 flex justify-center">
                <Document
                  file={previewUrl}
                  onLoadSuccess={onLoadSuccess}
                  loading={
                    <div className="flex h-full items-center justify-center py-8">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Loading document...</p>
                      </div>
                    </div>
                  }
                  error={
                    <div className="flex h-full items-center justify-center p-8">
                      <div className="flex flex-col items-center gap-3 text-center max-w-md">
                        <FileText className="h-12 w-12 text-muted-foreground" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Unable to load PDF preview</p>
                          <p className="text-xs text-muted-foreground">Please try downloading the PDF instead</p>
                        </div>
                      </div>
                    </div>
                  }
                  className="flex justify-center"
                >
                  <Page
                    pageNumber={pdfCurrentPage}
                    scale={zoom / 100}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    className="shadow-lg mx-auto select-none"
                  />
                </Document>
              </div>
            )}

            {!isLoadingPreview && !previewUrl && selectedPdf && (
              <div className="flex h-full items-center justify-center p-8">
                <div className="flex flex-col items-center gap-3 text-center max-w-md">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">No preview available</p>
                    <p className="text-xs text-muted-foreground">
                      This PDF cannot be previewed. Please download it to view.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
