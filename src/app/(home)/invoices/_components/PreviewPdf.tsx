'use client';

import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Download, Loader2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { UseInvoiceContex } from '../context/invoiceProvider';

interface PreviewPdfProps {
  invoiceId: string;
  isOpen: boolean;
  onClose: () => void;
}

const PreviewPdf = ({ invoiceId, isOpen, onClose }: PreviewPdfProps) => {
  const { getPdfPreview, pdfUrl, loadingPdf, downloadInvoicePdf } = UseInvoiceContex();

  useEffect(() => {
    if (isOpen && invoiceId) {
      getPdfPreview(invoiceId);
    }
  }, [invoiceId, isOpen, getPdfPreview]);

  const handleDownload = () => {
    downloadInvoicePdf(invoiceId);
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-4 shadow-xl transition-all">
                <Dialog.Title className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Invoice PDF Preview</h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                      disabled={loadingPdf || !pdfUrl}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </Dialog.Title>

                <Card className="h-[75vh] overflow-hidden">
                  {loadingPdf ? (
                    <div className="flex h-full flex-col items-center justify-center text-muted-foreground gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p>Loading PDF preview...</p>
                    </div>
                  ) : pdfUrl ? (
                    <iframe
                      src={`${pdfUrl}#toolbar=0`}
                      className="w-full h-full rounded"
                      title="Invoice PDF"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-muted-foreground gap-3">
                      <X className="w-12 h-12 text-red-500" />
                      <p>Failed to load PDF preview</p>
                      <Button
                        onClick={() => getPdfPreview(invoiceId)}
                        variant="outline"
                        size="sm"
                      >
                        Try Again
                      </Button>
                    </div>
                  )}
                </Card>

                <div className="mt-4 flex justify-end gap-2">
                  <Button onClick={onClose} variant="outline">
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PreviewPdf;
