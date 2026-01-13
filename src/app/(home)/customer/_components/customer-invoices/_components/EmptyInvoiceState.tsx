import { FileText } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import Link from "next/link";

export default function EmptyInvoiceState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-8">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
        <p className="text-muted-foreground mb-4">
          This customer doesn&apos;t have any invoices yet.
        </p>
        <Link href="/invoices/new" passHref>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Create First Invoice
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
