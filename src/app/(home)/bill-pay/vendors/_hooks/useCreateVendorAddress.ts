"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createVendorAddress } from "@/src/lib/services/vendorServices"
import { CreateVendorAddressInput } from "../../_schemas/businessVendorSchema"

interface CreateAddressParams {
  vendorId: string
  address: CreateVendorAddressInput
}

export function useCreateVendorAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ vendorId, address }: CreateAddressParams) => {
      const { id,longitude, latitude, ...cleanAddress } = address
      
      const payload = {
        vendor_id: vendorId,
        ...cleanAddress,
      }
      
      return await createVendorAddress(payload as CreateVendorAddressInput)
    },
    onSuccess: (data, variables) => {
      toast.success("Address created successfully")
      
      queryClient.invalidateQueries({
        queryKey: ["vendor-details", variables.vendorId],
      })
    },
    onError: (error: Error) => {
      console.error("Error creating address:", error)
      toast.error(error.message || "Failed to create address")
    },
  })
}