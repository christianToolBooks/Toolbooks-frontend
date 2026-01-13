// _hooks/useDeleteVendorContact.ts
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { deleteVendorContact } from "@/src/lib/services/vendorServices"
import type { CreateVendorContactInput } from "@/src/types/vendorsTypes"
import { ApiResponse } from "@/src/api/apiResponse"
import { ErrorResponse } from "@/src/api/errorResponse"

interface DeleteContactParams {
  vendorId: string
  contactId: string
  contactIndex: number
  localContacts: CreateVendorContactInput[]
  setLocalContacts: (contacts: CreateVendorContactInput[]) => void
  reloadContacts: () => Promise<void>
}

interface DeleteContactContext {
  previousContacts: CreateVendorContactInput[]
}

export function useDeleteVendorContact() {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse<void>,
    ErrorResponse,
    DeleteContactParams,
    DeleteContactContext
  >({
    mutationFn: async ({ vendorId, contactId }) => {
      const response = await deleteVendorContact(vendorId, contactId)
      
      if ("statusCode" in response) {
        throw response
      }
      
      return response
    },

    onMutate: async (variables): Promise<DeleteContactContext> => {
      const { contactId, contactIndex, localContacts, setLocalContacts } = variables
      
      const previousContacts = [...localContacts]
      
      if (contactId.toString().startsWith('temp-')) {
        const updatedContacts = localContacts.filter((_, index) => index !== contactIndex)
        setLocalContacts(updatedContacts)
      } else {
        const updatedContacts = localContacts.filter((_, index) => index !== contactIndex)
        setLocalContacts(updatedContacts)
      }
      
      return { previousContacts }
    },

    onSuccess: async (_, variables) => {
      const { vendorId, reloadContacts } = variables
      
      toast.success("Contact deleted successfully")
      
      await reloadContacts()
      
      queryClient.invalidateQueries({
        queryKey: ["vendor-details", vendorId],
      })
      
      queryClient.invalidateQueries({
        queryKey: ["vendors"],
      })
    },

    onError: (error: ErrorResponse, variables, context) => {
      console.error("Error deleting contact:", error)
      
      if (context?.previousContacts) {
        variables.setLocalContacts(context.previousContacts)
      }
      
      toast.error(error.message || "Failed to delete contact")
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