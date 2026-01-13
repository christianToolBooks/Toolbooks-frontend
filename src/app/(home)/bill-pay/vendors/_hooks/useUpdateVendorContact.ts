"use client"

import { ApiResponse } from "@/src/api/apiResponse";
import { ErrorResponse } from "@/src/api/errorResponse";
import { updateContactById } from "@/src/lib/services/vendorServices";
import { CreateVendorContactInput } from "@/src/types/vendorsTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useUpdateVendorContact() {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse<CreateVendorContactInput>,
    ErrorResponse,
    { vendorId: string; contactId: string; data: Partial<CreateVendorContactInput> }
  >({
    mutationFn: async ({ vendorId, contactId, data }) => {
      const { id, createdAt, updatedAt, ...cleanData } = data
      const response = await updateContactById(vendorId, contactId, cleanData)
      
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