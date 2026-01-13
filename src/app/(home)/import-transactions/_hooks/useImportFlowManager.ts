import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { NewDocumentImportData } from '@/src/types/document-import';
import { toast } from 'sonner';

const UseImportFlowManager = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'review'>('upload');
  const [currentFilname, setCurrentFilname] = useState<string>('');

  const router = useRouter();

  const handleUploadSuccess = (data: NewDocumentImportData) => {
    setCurrentStep('review');
    toast('Initial Analysis Completed', {
      // description: data.message,
    });
  };

  const handleUploadCancel = () => {
    router.push('/dashboard'); //  redirect to dashboard
  };

  const handleImportError = (message: string) => {
    toast('Error en la Importación', {
      description: message,
      // variant: "destructive",
    });
  };

  return {
    setCurrentStep,
    currentStep,

    currentFilname,
    setCurrentFilname,
    handleUploadSuccess,
    handleUploadCancel,
    handleImportError,
  };
};

export default UseImportFlowManager;
