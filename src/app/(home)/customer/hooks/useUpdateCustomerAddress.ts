import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAddressById } from "@/src/lib/services/customersServices";
import type { CreateCustomerAddressInput } from "@/src/types/customer";

export function useUpdateCustomerAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      customerId, 
      addressId, 
      data 
    }: { 
      customerId: string; 
      addressId: string; 
      data: Partial<CreateCustomerAddressInput> 
    }) => {
      const { id, customer_id, createdAt, updatedAt, latitude, longitude, ...cleanData } = data;
      const response = await updateAddressById(customerId, addressId, cleanData);
      
      if ("statusCode" in response && response.statusCode !== 200) {
        throw new Error(response.message || "Failed to update address");
      }
      
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
    onError: (error: Error) => {
      console.error("Error:", error);
      throw error;
    },
  });
}
