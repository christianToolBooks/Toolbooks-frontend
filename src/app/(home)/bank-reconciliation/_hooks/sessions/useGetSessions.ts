import { getTransactionSession } from "@/src/lib/services/bankReconciliation";
import { PaginatedSessionResponse } from "@/src/types/bank-reconciliation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";


interface Params {
  sessionId: string | null;
  page?: number;
  limit?: number;
}

export function useReconciliationSession({
  sessionId,
  page = 1,
  limit = 10,
}: Params) {
  const query = useQuery<PaginatedSessionResponse>({
    queryKey: ["reconciliation-session", sessionId, page, limit],
    queryFn: async () => {
      if (!sessionId) {
        throw new Error("Session ID is required");
      }

      const response = await getTransactionSession(
        sessionId,
        page,
        limit
      );

      if (response.code === 200 && response.data) {
        return response.data;
      }

      throw new Error(response.message ?? "Failed to fetch session");
    },
    enabled: Boolean(sessionId),

    placeholderData: keepPreviousData,

    staleTime: 60_000,
  });

  return {
    items: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    page: query.data?.page ?? page,
    limit: query.data?.limit ?? limit,

    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
