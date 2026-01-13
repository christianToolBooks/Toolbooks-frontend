"use client"

import { ApiResponse } from "@/src/api/apiResponse";
import { ErrorResponse } from "@/src/api/errorResponse";
import { updateContactById } from "@/src/lib/services/customersServices";
import { CreateCustomerContactInput } from "@/src/types/customer";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useUpdateCustomerContact() {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse<CreateCustomerContactInput>,
    ErrorResponse,
    { customerId: string; contactId: string; data: Partial<CreateCustomerContactInput> }
  >({
    mutationFn: async ({ customerId, contactId, data }) => {
      const { id, createdAt, updatedAt, ...cleanData } = data
      const response = await updateContactById(customerId, contactId, cleanData)
      
      if ("statusCode" in response) {
        throw response
      }
      
      return response
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["customer-details", variables.customerId],
      })
      
      queryClient.invalidateQueries({
        queryKey: ["customer"],
      })
    },
  })
}
