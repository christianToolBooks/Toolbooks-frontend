"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createCustomerContact } from "@/src/lib/services/customersServices"
import type { CreateCustomerContactInput } from "@/src/types/customer"

interface CreateContactParams {
  customerId: string
  contact: CreateCustomerContactInput
}

export function useCreateCustomerContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ customerId, contact }: CreateContactParams) => {
      const { id, createdAt, updatedAt, ...cleanContact } = contact
      
      const payload = {
        customer_id: customerId,
        ...cleanContact,
      }
      
      return await createCustomerContact(payload as CreateCustomerContactInput)
    },
    onSuccess: (data, variables) => {
      toast.success("Contact created successfully")
      
      queryClient.invalidateQueries({
        queryKey: ["customer-details", variables.customerId],
      })
      queryClient.invalidateQueries({
        queryKey: ["customer"],
      })
    },
    onError: (error: Error) => {
      console.error("Error creating contact:", error)
      toast.error(error.message || "Failed to create contact")
    },
  })
}
