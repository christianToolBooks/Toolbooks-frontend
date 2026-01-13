import { useEffect, useState, useCallback } from "react";
import { fetchCustomers } from "@/src/lib/services/customersServices";
import { formatPhoneDisplay } from "@/src/lib/utils/formatters";
import { Customer } from "@/src/types/customer";
import { ErrorResponse } from "@/src/api/errorResponse";
import { toast } from "sonner";

export default function useCustomers(
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const getCustomers = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      const res = await fetchCustomers();

      if ("message" in res) {
        toast.error(res.message || "Failed to fetch customers");
        setCustomers([]);
        return;
      }

      const formatted = res.map((customer) => ({
        ...customer,
        phone: formatPhoneDisplay(customer.phone || ""),
      }));

      setCustomers(formatted);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Unexpected error fetching customers");
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  useEffect(() => {
    getCustomers();
  }, [getCustomers]);

  return {
    customers,
    getCustomers,
  };
}
