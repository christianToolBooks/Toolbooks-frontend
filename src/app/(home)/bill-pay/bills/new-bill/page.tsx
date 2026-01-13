import { JournalEntryProvider } from "../../../journal-entry/_components/journalEntryComponents/context/journalContext";
import { BillForm } from "./_components/bill-form";

export default function NewBillPage() {
  return (
    <JournalEntryProvider>
      <div className="py-4 px-6 lg:px-10">
        <h1 className="text-2xl font-bold text-[#1E3A8A] mb-2">
          Add a New Bill
        </h1>
        <p className="text-[#5C769D] text-md">
          Upload a document to auto-fill the form, or enter the details
          manually.
        </p>
        <BillForm />
      </div>
    </JournalEntryProvider>
  );
}
