import { BankReconciliationApiResponse } from "@/src/types/bank-reconciliation";

interface Params {
  onPreview: (rec: BankReconciliationApiResponse) => void;
  onDownload: (rec: BankReconciliationApiResponse) => void;
  onViewSession: (sessionId: string) => void;
}

export function useReconciliationActions({
  onPreview,
  onDownload,
  onViewSession,
}: Params) {
  return (rec: BankReconciliationApiResponse) => [
    {
      key: "preview",
      label: "Preview",
      enabled: true,
      onClick: () => onPreview(rec),
    },
    {
      key: "download",
      label: "Download",
      enabled: Boolean(rec.reconciliation),
      onClick: () => onDownload(rec),
    },
    {
      key: "view-session",
      label: "View session",
      enabled: Boolean(rec.reconciliation?.sessionId && rec.reconciliation.hasSessionItems === true),
      onClick: () =>
        rec.reconciliation &&
        onViewSession(rec.reconciliation.sessionId),
    },
  ];
}
