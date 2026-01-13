// app/types/document-import.ts

import { AuditInfo } from "./globals";
// import { AccountType } from "./account";
import { UserIntentTransactionType } from "./generaldLedgerTypes";

// Status of the overall document import process
export type DocumentImportStatus =
  | "pending_upload"
  | "uploading"
  | "processing"
  | "pending_review"
  | "importing"
  | "completed"
  | "failed";

// Status for each individual transaction extracted from the document
export type ExtractedTransactionStatus =
  | "new"
  | "reviewed"
  | "edited"
  | "ignored"
  | "imported"
  | "error";

// Represents a document uploaded by the user for processing
export interface ImportedDocument {
  fileName: string;
}

// Represents a single transaction extracted from the document, before it becomes a formal 'Transaction'
// This is what the user reviews and edits.
export interface ExtractedTransaction {
  id: string; // Temporary ID for UI tracking during review
  importedDocumentId: string;
  originalLineNumber?: number; // Line number in the document, if identifiable
  rawDateString?: string; // Date as it appeared in the document
  rawDescription: string; // Description as it appeared in the document
  rawAmountString?: string; // Amount as it appeared
  detectedAmount: number; // Numeric amount parsed (always positive)
  detectedType: "debit" | "credit" | "unknown"; // Based on document columns or keywords

  // Fields to be filled/corrected by the user
  transactionDate?: Date; // User confirmed/corrected date (Date object for form input)
  description: string; // User confirmed/corrected description
  amount: number; // User confirmed/corrected amount (always positive)
  userIntentTransactionType?: UserIntentTransactionType; // User selected (income, expense, cc_purchase etc.)
  categoryId?: string; // User selected category
  payeeOrPayer?: string; // User entered or suggested
  memo?: string; // User entered

  reviewStatus: ExtractedTransactionStatus; // Status of this specific item in the review process
  importError?: string; // If this specific transaction failed to import after approval
  isSelectedForImport: boolean; // Checkbox in the UI
}

// Data needed when initiating a document import session
export interface NewDocumentImportData {
  file: File; // The actual file object from the browser
  fileName?: string
}

// Data structure for the review step, containing the document and its extracted transactions
export interface DocumentReviewData {
  document: ImportedDocument;
  extractedItems: ExtractedTransaction[];
}

// Data sent to the backend when user confirms transactions for import from review screen
export interface ConfirmImportData {
  importedDocumentId: string;
  transactionsToImport: Array<
    Partial<ExtractedTransaction> & {
      // Sending only necessary, user-confirmed fields
      id: string; // The temporary ID of the extracted transaction
      transactionDate: Date;
      description: string;
      amount: number;
      userIntentTransactionType: UserIntentTransactionType;
      categoryId: string;
      payeeOrPayer?: string;
      memo?: string;
    }
  >;
}
