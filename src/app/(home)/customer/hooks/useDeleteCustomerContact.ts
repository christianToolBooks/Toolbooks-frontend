"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { deleteCustomerContact } from "@/src/lib/services/customersServices"
import type { CreateCustomerContactInput } from "@/src/types/customer"
import { ApiResponse } from "@/src/api/apiResponse"
import { ErrorResponse } from "@/src/api/errorResponse"

interface DeleteContactParams {
  customerId: string
  contactId: string
  contactIndex: number
  localContacts: CreateCustomerContactInput[]
  setLocalContacts: (contacts: CreateCustomerContactInput[]) => void
  reloadContacts: () => Promise<void>
}

interface DeleteContactContext {
  previousContacts: CreateCustomerContactInput[]
}

export function useDeleteCustomerContact() {
  const queryClient = useQueryClient()

  return useMutation<
    ApiResponse<void>,
    ErrorResponse,
    DeleteContactParams,
    DeleteContactContext
  >({
    mutationFn: async ({ customerId, contactId }) => {
      const response = await deleteCustomerContact(customerId, contactId)
      
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
      const { customerId, reloadContacts } = variables
      
      toast.success("Contact deleted successfully")
      
      await reloadContacts()
      
      queryClient.invalidateQueries({
        queryKey: ["customer-details", customerId],
      })
      
      queryClient.invalidateQueries({
        queryKey: ["customer"],
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
          queryKey: ["customer-details", variables.customerId],
        })
      }
    },
  })
}
