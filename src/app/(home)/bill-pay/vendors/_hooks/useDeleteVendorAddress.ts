// _hooks/useDeleteVendorContact.ts
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { deleteVendorAddress } from "@/src/lib/services/vendorServices"
import type { CreateVendorAddressInput } from "@/src/types/vendorsTypes"
import { ApiResponse } from "@/src/api/apiResponse"
import { ErrorResponse } from "@/src/api/errorResponse"

interface DeleteAddressParams {
  vendorId: string
  addressId: string
  addressIndex: number
  localAddresses: CreateVendorAddressInput[]
  setLocalAddresses: (addresses: CreateVendorAddressInput[]) => void
  reloadAddresses: () => Promise<void>
}
interface DeleteAddressContext {
  previousAddresses: CreateVendorAddressInput[]
}

export function useDeleteVendorAddress() {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse<void>,
    ErrorResponse,
    DeleteAddressParams,
    DeleteAddressContext
  >({
    mutationFn: async ({ vendorId, addressId }) => {
      const response = await deleteVendorAddress(vendorId, addressId)
      
      if ("statusCode" in response) {
        throw response
      }
      
      return response
    },

    onMutate: async (variables): Promise<DeleteAddressContext> => {
      const { addressId, addressIndex, localAddresses, setLocalAddresses } = variables
      const previousAddresses = [...localAddresses]

      if (addressId.toString().startsWith('temp-')) {
        const updatedAddresses = localAddresses.filter((_, index) => index !== addressIndex)
        setLocalAddresses(updatedAddresses)
      } else {
        const updatedAddresses = localAddresses.filter((_, index) => index !== addressIndex)
        setLocalAddresses(updatedAddresses)
      }
      
      return { previousAddresses }
    },

    onSuccess: async (_, variables) => {
      const { vendorId, reloadAddresses } = variables
      
      toast.success("Address deleted successfully")
      
      await reloadAddresses()
      
      queryClient.invalidateQueries({
        queryKey: ["vendor-details", vendorId],
      })
      
      queryClient.invalidateQueries({
        queryKey: ["vendors"],
      })
    },

    onError: (error: ErrorResponse, variables, context) => {
      console.error("Error deleting address:", error)
      
      if (context?.previousAddresses) {
        variables.setLocalAddresses(context.previousAddresses)
      }
      
      toast.error(error.message || "Failed to delete address")
    },

    onSettled: (_, error, variables) => {
      if (!error) {
        queryClient.invalidateQueries({
          queryKey: ["vendor-details", variables.vendorId],
        })
      }
    },
  })
}