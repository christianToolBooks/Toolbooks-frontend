// app/(home)/income-expenses/page.tsx
"use client";

import { JournalEntry } from "../journal-entry/_components/journalEntry";
import { format } from "date-fns";
import { JournalEntryProvider } from "./_components/journalEntryComponents/context/journalContext";

export default function JournalEntryPage() {
  return (
    <div className="@container/main px-4 lg:px-6">
      <div className="text-center flex-1 p-10">
        <h1 className="text-2xl font-bold">Journal Entry</h1>
        <p className="text-sm text-gray-600 mt-1">
          Here you can record, view, and manage journal entries by adding
          accounts, amounts, dates, and transaction descriptions.
        </p>
        <p className="text-sm text-gray-500">
          As of {format(new Date(), "MMMM dd, yyyy")}
        </p>
      </div>
      <JournalEntryProvider>
        <JournalEntry />
      </JournalEntryProvider>
    </div>
  );
}
