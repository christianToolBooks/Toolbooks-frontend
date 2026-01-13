import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { NewDocumentImportData } from '@/src/types/document-import';
import {
  UploadFormValues,
  uploadTransactionFormSchema,
} from '@/src/lib/schemas/import-transactions';
import { uploadAndProcessBankStatementDocument } from '@/src/lib/services/bankSatementService';
import { DocumentUploadStepProps } from '../_components/DocumentUploadStep';
import { toast } from 'sonner';

interface UseDocumentUploadInterface
  extends Pick<DocumentUploadStepProps, 'onUploadSuccessAction'> {}

const UseDocumentUpload = ({
  onUploadSuccessAction,
}: UseDocumentUploadInterface) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadTransactionFormSchema),
    defaultValues: {
      file: undefined,
    },
  });

  //Procces to Upload PDF, PNG or JPG
  const uploadMutation = useMutation({
    mutationFn: async (data: NewDocumentImportData) => {
      const result = await uploadAndProcessBankStatementDocument(
        data,
        progress => {
          setUploadProgress(progress);
        }
      );

      if (!result.success) {
        throw new Error(result.message || 'Unknown error during processing.');
      }

      return result;
    },
    onSuccess: data => {
      if (onUploadSuccessAction && data.success && data.reviewData) {
        const uploadedFileName = form.getValues('file')?.name ?? '';
        onUploadSuccessAction(data.reviewData, uploadedFileName);
      } else {
        // This case should ideally be covered by the error in mutationFn
        toast('Error', {
          description: data.message || 'No data received for review.',
          // variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast('Load Error', {
        description: error.message,
        // variant: "destructive",
      });
      setUploadProgress(0);
    },
  });

  // Upload PDF
  const onSubmit = (data: UploadFormValues) => {
    if (!data.file) {
      toast('Error', {
        description: "File isn't selected.",
        // variant: "destructive",
      });
      return;
    }

    setUploadProgress(10); // Initial progress
    uploadMutation.mutate({ file: data.file });
  };

  return {
    form,
    uploadMutation,
    uploadProgress,
    onSubmit,
  };
};

export default UseDocumentUpload;
