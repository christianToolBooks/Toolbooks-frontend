import {
  ACHToPayResponse,
  CreateACHToPay,
  PayarcAccountType,
  PayarcSecCodeToACHForm,
  typePayMethod,
} from "@/src/types/paymentMethods";
import { useState } from "react";
import { useSubscription } from "./useSubscription";
import {
  createACHToPaySchema,
  CreateACHToPayFormInput as T,
} from "../schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { getAllBankAccountsToPay } from "@/src/lib/services/methodsToPayService";
import { ApiResponse } from "@/src/api/apiResponse";

export const useCreateAchForm = (
  customerId: string,
  onSuccess?: (data: CreateACHToPay) => void,
  onSelectACH?: (id: string) => void
) => {
  const [loading, setLoading] = useState(false);
  const [loadingAllACH, setLoadingAllACH] = useState(true);
  const [getAllACH, setGetAllACH] = useState<ApiResponse<
    ACHToPayResponse[]
  > | null>(null);
  const [selectedACHId, setSelectedACHId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { handleRegisterPaymentMethod } = useSubscription();

  const defaultValues: T = {
    routing_number: "",
    account_number: "",
    first_name: "",
    last_name: "",
    account_type: PayarcAccountType.BUSINESS_CHECKING,
    company_name: "",
    customer_id: customerId ?? "",
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(createACHToPaySchema) as Resolver<T>,
    defaultValues,
    mode: "onBlur",
  });

  const handleSelectACH = (id: string) => {
    setSelectedACHId(id);
    onSelectACH?.(id);
    toast.success("Bank account selected for payment");
  };

  const onSubmit = handleSubmit(async (data) => {
    const isBusiness =
      data.account_type === PayarcAccountType.BUSINESS_CHECKING ||
      data.account_type === PayarcAccountType.BUSINESS_SAVINGS;
    setLoading(true);
    setError(null);

    try {
      const payload: CreateACHToPay = {
        ...data,
        customer_id: customerId ?? "",
        sec_code: PayarcSecCodeToACHForm.WEB,
      };

      if (!isBusiness) {
        delete payload.company_name;
      }

      const res = await handleRegisterPaymentMethod(typePayMethod.ACH, payload);

      if (res && "data" in res) {
        await getAllACHToPay();
        reset(defaultValues);
        onSuccess?.(res.data as CreateACHToPay);
        toast.success("Bank account added successfully!");
      }
    } catch (err) {
      const error = err as Error;
      toast.error("Failed to create ACH form. Try again.");
      setError(error.message || "Failed to create ACH form");
    } finally {
      setLoading(false);
    }
  });

  const getAllACHToPay = async () => {
    setLoadingAllACH(true);
    setError(null);
    try {
      const res = await getAllBankAccountsToPay();
      setGetAllACH(res as unknown as ApiResponse<ACHToPayResponse[]>);
    } catch {
      setError("Failed to fetch ACH");
    } finally {
      setLoadingAllACH(false);
    }
  };

  return {
    register,
    handleSubmit: onSubmit,
    getAllACHToPay,
    getAllACH,
    selectedACHId,
    handleSelectACH,
    setValue,
    watch,
    loading,
    loadingAllACH,
    error,
    errors,
  };
};
