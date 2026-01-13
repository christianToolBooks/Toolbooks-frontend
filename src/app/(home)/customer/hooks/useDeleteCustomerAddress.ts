import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCustomerAddress } from "@/src/lib/services/customersServices";
import { toast } from "sonner";
import type { CreateCustomerAddressInput, CustomerAddress } from "@/src/types/customer";

export function useDeleteCustomerAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      customerId,
      addressId,
      addressIndex,
      localAddresses,
      setLocalAddresses,
      reloadAddresses,
    }: {
      customerId: string;
      addressId: string;
      addressIndex: number;
      localAddresses: CreateCustomerAddressInput[];
      setLocalAddresses: (addresses: CreateCustomerAddressInput[]) => void;
      reloadAddresses: () => Promise<void>;
    }) => {
      return await deleteCustomerAddress(customerId, addressId);
    },
    onMutate: async ({ localAddresses, addressIndex, setLocalAddresses }) => {
      await queryClient.cancelQueries({ queryKey: ["customer"] });
      const previousAddresses = [...localAddresses];
      const updated = localAddresses.filter((_, i) => i !== addressIndex);
      setLocalAddresses(updated);
      return { previousAddresses };
    },
    onSuccess: async (_, { reloadAddresses }) => {
      await reloadAddresses();
      toast.success("Address deleted successfully");
    },
    onError: (error: Error, { setLocalAddresses }, context) => {
      if (context?.previousAddresses) {
        setLocalAddresses(context.previousAddresses);
      }
      toast.error(error.message || "Failed to delete address");
    },
  });
}
