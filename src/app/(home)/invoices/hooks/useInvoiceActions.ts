import { useState } from 'react';
import { toast } from 'sonner';
import { getInvoicePdf } from '@/src/lib/services/invoiceService';

const UseInvoiceActions = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getPdfPreview = async (invoiceId: string): Promise<void> => {
    setLoading(true);
    setPdfUrl(null);

    try {
      const response = await getInvoicePdf(invoiceId);

      if ('statusCode' in response) {
        toast.error(response.message || 'Failed to load PDF preview');
        console.error('Error loading PDF:', response);
        return;
      }

      if (!response.data?.url) {
        toast.error('Invalid PDF URL received');
        return;
      }

      setPdfUrl(response.data.url);
    } catch (error) {
      console.error('❌ Error loading PDF preview:', error);
      toast.error('Failed to load PDF preview');
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoicePdf = async (invoiceId: string): Promise<void> => {
    const toastId = toast.loading('Preparing download...');

    try {
      const response = await getInvoicePdf(invoiceId);

      if ('statusCode' in response) {
        toast.error(response.message || 'Failed to download PDF', { id: toastId });
        console.error('Error downloading PDF:', response);
        return;
      }

      if (!response.data?.url) {
        toast.error('Invalid PDF URL received', { id: toastId });
        return;
      }

      const { url, filename } = response.data;
      const downloadFilename = filename || `invoice-${invoiceId}.pdf`;

      toast.loading('Downloading PDF...', { id: toastId });

      const pdfResponse = await fetch(url);
      
      if (!pdfResponse.ok) {
        throw new Error(`HTTP error! status: ${pdfResponse.status}`);
      }

      const blob = await pdfResponse.blob();

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = downloadFilename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }, 100);

      toast.success('PDF downloaded successfully!', { id: toastId });
    } catch (error) {
      console.error('❌ Error downloading PDF:', error);
      toast.error('Failed to download PDF', { id: toastId });
    }
  };

  return {
    pdfUrl,
    setPdfUrl,
    isOpen,
    setIsOpen,
    loading,
    downloadInvoicePdf,
    getPdfPreview,
  };
};

export default UseInvoiceActions;
