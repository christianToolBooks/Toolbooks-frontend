// src/app/(home)/vendors/_hooks/useGetVendors.ts
import { useQuery } from '@tanstack/react-query';
import { getVendors } from '@/src/lib/services/vendorServices';
import { VendorRecord } from '@/src/types/vendorsTypes';

export function useGetVendors() {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<VendorRecord[]>({
    queryKey: ['vendors'],
    queryFn: async () => {
      const response = await getVendors();

      if ("statusCode" in response) {
        throw new Error(response.message || "Failed to fetch vendors");
      }

      return response.data || [];
    },
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
  });

  return {
    vendors: data ?? [],
    loading: isLoading,
    error: error?.message ?? null,
    refetch,
  };
}
