"use client";

import type React from "react";
import { Upload, FileText } from "lucide-react";

interface BillOptionSelectorProps {
  isScanning: boolean;
  onFileUpload: (file: File) => void;
  onManualEntry: () => void;
}

export function BillOptionSelector({ isScanning, onFileUpload, onManualEntry }: BillOptionSelectorProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFileUpload(file);
  };

  return (
    <div className="min-h-[70vh] flex justify-center items-center bg-chart-5 mt-10 p-6 rounded-2xl">
      <div className="w-full">
        {/* Quitamos la altura fija del grid y hacemos que cada item se estire */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {/* CARD: Scan PDF */}
          <div className="relative group">
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={isScanning}
            />
            <div
              className="
                h-full min-h-[280px] md:min-h-[320px]
                bg-white backdrop-blur-sm border border-[#EFECE6] rounded-2xl p-8
                hover:bg-white hover:shadow-xl hover:shadow-[#1E3A8A]/5
                transition-all duration-300 group-hover:scale-[1.02]
                flex items-center justify-center
              "
            >
              <div className="flex flex-col items-center text-center">
                {isScanning ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-[#F0F6FE] flex items-center justify-center mb-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#1E3A8A] border-t-transparent" />
                    </div>
                    <span className="text-[#1E3A8A] font-medium">Scanning PDF...</span>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-[#1E3A8A] flex items-center justify-center mb-4 group-hover:bg-[#1E3A8A]/90 transition-colors">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[#1E3A8A] font-medium text-lg">Scan PDF Document</span>
                    <span className="text-[#5C769D] text-sm mt-1">Auto-fill from your invoice</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* CARD: Manual Entry */}
          <button
            type="button"
            onClick={onManualEntry}
            className="
              h-full min-h-[280px] md:min-h-[320px]
              bg-white backdrop-blur-sm border border-[#EFECE6] rounded-2xl p-8
              hover:bg-white hover:shadow-xl hover:shadow-[#1E3A8A]/5
              transition-all duration-300 hover:scale-[1.02]
              flex items-center justify-center
            "
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#5C769D] flex items-center justify-center mb-4 hover:bg-[#5C769D]/90 transition-colors">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-[#1E3A8A] font-medium text-lg">Manual Entry</span>
              <span className="text-[#5C769D] text-sm mt-1">Fill out the form yourself</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
