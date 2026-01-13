import { getCustomerByName } from "@/src/lib/services/customersServices";
import { useQuery } from "@tanstack/react-query";

export function useCustomerByName(query: string) {
  return useQuery({
    queryKey: ["customerByName", query],
    queryFn: () => getCustomerByName(query),
    enabled: !!query, 
  });
}