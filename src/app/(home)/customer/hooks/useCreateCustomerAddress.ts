"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomerAddress } from "@/src/lib/services/customersServices";
import type { CreateCustomerAddressInput } from "@/src/types/customer";

interface CreateAddressParams {
  customerId: string;
  address: CreateCustomerAddressInput;
}

export function useCreateCustomerAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerId, address }: CreateAddressParams) => {
      const { id, longitude, latitude, customer_id, ...cleanAddress } = address;
      
      const payload = {
        customer_id: customerId,
        type: cleanAddress.type || "billed_from",
        line1: cleanAddress.line1 || "",
        line2: cleanAddress.line2 || null,
        city: cleanAddress.city || "",
        state: cleanAddress.state || "",
        postalCode: cleanAddress.postalCode || "",
        country: cleanAddress.country || "US",
        isDefault:  false,
      };
      
      const response = await createCustomerAddress(payload as CreateCustomerAddressInput);
      
      if ("statusCode" in response && response.statusCode !== 201 && response.statusCode !== 200) {
        throw new Error(response.message || "Failed to create address");
      }
      
      return response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["customer-details", variables.customerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["customer"],
      });
    },
    onError: (error: Error) => {
      console.error("=== Error creating address ===");
      console.error("Error:", error);
      throw error;
    },
  });
}
