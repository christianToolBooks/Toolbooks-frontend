"use client";

import { Check } from "lucide-react";

interface PdfScannerProps {
  confidence?: number;
  warnings?: string[];
  discrepancies?: string[];
}

export function PdfScannerResult({
  confidence,
  warnings,
  discrepancies,
}: PdfScannerProps) {
  if (!confidence) return null;

  return (
    <div className="relative bg-white/80 backdrop-blur-sm border border-chart-5/50 rounded-2xl p-6 shadow-sm mt-6">
      {/* Check en la esquina */}
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-chart-5 flex items-center justify-center shadow-md">
        <Check className="w-4 h-4 text-chart-1" />
      </div>

      {/* Textos */}
      <div className="mt-2">
        <span className="block text-chart-1 font-medium text-base md:text-lg">
          Scan Confidence: {(confidence * 100).toFixed(0)}%
        </span>

        {warnings && warnings.length > 0 && (
          <p className="text-chart-1/80 text-sm md:text-base mt-2">
            Not all bill information could be captured during the scan.
            Double-check the data and fill in any missing fields before
            continuing.
          </p>
        )}

        {discrepancies && discrepancies.length > 0 && (
          <p className="text-chart-3 text-sm md:text-base mt-2">
            We found some inconsistencies in the scanned data. Double-check
            the highlighted fields and update them to ensure accuracy.
          </p>
        )}
      </div>
    </div>
  );
}

// Placeholder para futura lógica de escaneo
export function PdfScanner() {
  return null;
}
