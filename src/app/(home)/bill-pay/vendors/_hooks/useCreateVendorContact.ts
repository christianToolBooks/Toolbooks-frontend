"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createVendorContact } from "@/src/lib/services/vendorServices"
import type { CreateVendorContactInput } from "@/src/types/vendorsTypes"

interface CreateContactParams {
  vendorId: string
  contact: CreateVendorContactInput
}

export function useCreateVendorContact() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ vendorId, contact }: CreateContactParams) => {
      const { id, createdAt, updatedAt, ...cleanContact } = contact
      
      const payload = {
        vendor_id: vendorId,
        ...cleanContact,
      }
      
      return await createVendorContact(payload as CreateVendorContactInput)
    },
    onSuccess: (data, variables) => {
      toast.success("Contact created successfully")
      
      queryClient.invalidateQueries({
        queryKey: ["vendor-details", variables.vendorId],
      })
    },
    onError: (error: Error) => {
      console.error("Error creating contact:", error)
      toast.error(error.message || "Failed to create contact")
    },
  })
}