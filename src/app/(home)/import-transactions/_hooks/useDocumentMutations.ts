// app/(home)/import-transactions/_hooks/useDocumentMutations.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  uploadAndProcessBankStatementDocument,
  // confirmAndImportTransactions,
  // fetchDocumentForReview,
} from '@/src/lib/services/bankSatementService';
import {
  NewDocumentImportData,
} from '@/src/types/document-import';

export const useUploadDocument = () => {
  return useMutation({
    mutationFn: (data: NewDocumentImportData) =>
      uploadAndProcessBankStatementDocument(data),
  });
};

// export const useConfirmImport = () => {
//   return useMutation({
//     mutationFn: (data: ConfirmImportData) => confirmAndImportTransactions(data),
//   });
// };

// export const useFetchDocumentForReview = (
//   documentId: string,
//   enabled: boolean = true,
// ) => {
//   return useQuery({
//     queryKey: ["documentForReview", documentId],
//     queryFn: () => fetchDocumentForReview(documentId),
//     enabled: !!documentId && enabled,
//   });
// };
