import { useReconciliationTable } from "../../_hooks/table/useReconciliationTable";
import { BankReconciliationApiResponse } from "@/src/types/bank-reconciliation";
import { ReconciliationTableContent } from "./reconciliationTableContent";
import { ReconciliationPagination } from "./reconciliationPagination";
import { ReconciliationHeader } from "./reconciliationHeader";

interface Props {
  data: BankReconciliationApiResponse[];
  paginationInfo: { total: number; page: number; limit: number } | null;
  search: string;
  loading: boolean;
  downloading: boolean;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  onPreview: (rec: BankReconciliationApiResponse) => void;
  onDownload: (rec: BankReconciliationApiResponse) => void;
  onViewSession: (sessionId: string) => void;
  onDownloadMonth: () => void;
}

export function ReconciliationTable(props: Props) {
  const { page, totalPages, hasPagination } =
    useReconciliationTable(props.paginationInfo);

  return (
    <div className="space-y-4">
      <ReconciliationHeader
        search={props.search}
        loading={props.downloading}
        hasData={props.data.length > 0}
        onSearchChange={props.onSearchChange}
        onRefresh={props.onRefresh}
        onDownloadMonth={props.onDownloadMonth}
      />

      <div className="rounded-lg border hidden md:block">
        <ReconciliationTableContent
          data={props.data}
          loading={props.loading}
          onPreview={props.onPreview}
          onDownload={props.onDownload}
          onViewSession={props.onViewSession}
        />

        {hasPagination && (
          <ReconciliationPagination
            page={page}
            totalPages={totalPages}
            loading={props.loading}
            onPageChange={props.onPageChange}
          />
        )}
      </div>
    </div>
  );
}
