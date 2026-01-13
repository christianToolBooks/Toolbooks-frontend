import { Button } from "@/src/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export function ReconciliationPagination({
  page,
  totalPages,
  loading,
  onPageChange,
}: Props) {
  return (
    <div className="flex justify-between px-4 py-3 border-t">
      <div className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1 || loading}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages || loading}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
