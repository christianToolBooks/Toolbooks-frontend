// app/services/documentImportService.ts
import { NewDocumentImportData } from '@/src/types/document-import';
import apiClient from '../axios';
import { ResponseApiInterface } from '@/src/types/apiResponse';

interface UploadAndProcessDocumentInterface extends ResponseApiInterface {
  reviewData: NewDocumentImportData;
}

// --- Service Functions ---

// Service to upload a file
export const uploadAndProcessBankStatementDocument = async (
  data: NewDocumentImportData,
  onProgress?: (progress: number) => void
): Promise<UploadAndProcessDocumentInterface> => {
  try {
    const formData = new FormData();
    formData.append('file', data.file);

    await apiClient.post('bank-statement/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });

    return {
      success: true,
      message: 'Document processed.',
      reviewData: data,
    };
  } catch (error) {
    return {
      success: false,
      message: 'The file could not be uploaded',
      reviewData: data,
    };
  }
};
