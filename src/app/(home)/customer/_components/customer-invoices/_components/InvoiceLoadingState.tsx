import { Loader2 } from "lucide-react";

export default function InvoiceLoadingState() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">
          Loading customer invoices...
        </span>
      </div>
    </div>
  );
}