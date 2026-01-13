// app/(home)/import-transactions/_components/ImportFlowManager.tsx
'use client';

//UI Implements
import DocumentUploadStep from './DocumentUploadStep';
import { Card, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import UseImportFlowManager from '../_hooks/useImportFlowManager';

export default function ImportFlowManager() {
  const {
    //States
    currentStep,
    currentFilname,

    //Action tu change the view save the filname of import
    setCurrentFilname,
    setCurrentStep,

    //Logic for each situation on the process
    handleUploadSuccess,
    handleUploadCancel,
  } = UseImportFlowManager();

  //If the user has not yet sent an import, display this view
  if (currentStep === 'upload') {
    return (
      <DocumentUploadStep
        status={() => false}
        onUploadSuccessAction={handleUploadSuccess}
        onCancelAction={handleUploadCancel}
        setCurrentFilname={setCurrentFilname}
      />
    );
  }

  if (currentStep === 'review') {
    return (
      <Card>
        <CardHeader className="gap-4">
          <CardTitle>Your transaction was succesfully Upload!</CardTitle>
          <p className="text-sm text-gray-500">File: {currentFilname}</p>

          <div>
            <Button onClick={() => setCurrentStep('upload')}>
              Upload another File
            </Button>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return <div>Loading import flow...</div>; // Should be brief or handled by outer suspense
}
