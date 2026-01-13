"use client"

import { ApiResponse } from "@/src/api/apiResponse";
import { ErrorResponse } from "@/src/api/errorResponse";
import { updateAddressById } from "@/src/lib/services/vendorServices";
import { CreateVendorAddressInput } from "@/src/types/vendorsTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useUpdateVendorAddress() {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse<CreateVendorAddressInput>,
    ErrorResponse,
    { vendorId: string; addressId: string; data: Partial<CreateVendorAddressInput> }
  >({
    mutationFn: async ({ vendorId, addressId, data }) => {
      const { id, createdAt, updatedAt, ...cleanData } = data
      const response = await updateAddressById(vendorId, addressId, cleanData)
      
      if ("statusCode" in response) {
        throw response
      }
      
      return response
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["vendor-details", variables.vendorId],
      })
      
      queryClient.invalidateQueries({
        queryKey: ["vendors"],
      })
      
      queryClient.invalidateQueries({
        queryKey: ["vendors-search"],
      })
    },
  })
}