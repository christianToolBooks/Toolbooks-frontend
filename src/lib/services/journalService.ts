// src/lib/services/journal/createJournal.ts
import { ApiResponse } from "@/src/api/apiResponse";
import { ErrorResponse } from "@/src/api/errorResponse";
import { JournalEntryPayload, JournalLineResponse } from "@/src/types/generaldLedgerTypes";
import apiClient from "../axios";
import { handleApiError } from "@/src/api/errorHandler";

export type CreateJournalEntryResponse = ApiResponse<JournalLineResponse>;

export async function createJournalEntry(
  data: JournalEntryPayload
): Promise<CreateJournalEntryResponse | ErrorResponse> {
  try {
    const res = await apiClient.post<CreateJournalEntryResponse>("journal", data);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
}
