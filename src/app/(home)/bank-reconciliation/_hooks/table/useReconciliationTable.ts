interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
}

export function useReconciliationTable(
  paginationInfo: PaginationInfo | null
) {
  const page = paginationInfo?.page ?? 1;
  const totalPages = paginationInfo
    ? Math.ceil(paginationInfo.total / paginationInfo.limit)
    : 0;

  return {
    page,
    totalPages,
    hasPagination: Boolean(paginationInfo && totalPages > 1),
  };
}
