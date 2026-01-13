"use client"

import { useQuery } from "@tanstack/react-query"
import { getVendorById } from "@/src/lib/services/vendorServices"
import { VendorRecord } from "@/src/types/vendorsTypes"
import { ErrorResponse } from "@/src/api/errorResponse"

export function useGetVendorById(vendorId: string | undefined) {
  return useQuery<VendorRecord, Error>({
    queryKey: ["vendor-details", vendorId],
    queryFn: async () => {
      if (!vendorId) {
        throw new Error("Vendor ID is required")
      }

      const response = await getVendorById(vendorId)

      if ("statusCode" in response) {
        throw new Error((response as ErrorResponse).message)
      }

      if (!response.data) {
        throw new Error("No vendor data found")
      }

      return response.data
    },
    enabled: !!vendorId,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  })
}