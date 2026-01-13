import { ErrorResponse } from "@/src/api/errorResponse";
import { accountFormSchema, AccountFormValues } from "@/src/lib/schemas/coa";
import { createAccountOfCoa } from "@/src/lib/services/chartOfAccount/AccountServices";
import { Account } from "@/src/types/chart-of-accounts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  accountTypeOptions,
  determineNormalBalance,
  getCodePlaceholder,
  validateAccountCode,
} from "../../../journal-entry/helpers/functions";

interface UseCreateCoAFormOptions {
  initialValues?: Partial<AccountFormValues>;
  onSuccess?: (serviceId: string) => void;
}
export const useCreateCoAForm = (options?: UseCreateCoAFormOptions) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      account_code: "",
      account_name: "",
      account_type: undefined,
      normal_balance: undefined,
      ...options?.initialValues,
    },
  });

  const onSubmit: SubmitHandler<AccountFormValues> = async (data) => {
    try {
      const accountData: AccountFormValues = {
        ...data,
        normal_balance: determineNormalBalance(data.account_type),
        status: true,
      };
      const response: Account | ErrorResponse =
        await createAccountOfCoa(accountData);
      if ("data" in response) {
        await queryClient.invalidateQueries({ queryKey: ["chartOfAccounts"] });
        reset();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "The account could not be added.";
      console.error(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onErrors = (errors: FieldErrors<AccountFormValues>) => {
    if (Object.keys(errors).length > 0) {
      toast.error("Please fill all camps.");
    }
  };

  return {
    register,
    onSubmit,
    errors,
    isLoading,
    watch,
    setValue,
    reset,
    handleSubmit: handleSubmit(onSubmit, onErrors),
    isFormOpen,
    openForm: () => setIsFormOpen(true),
    closeForm: () => setIsFormOpen(false),
    validateAccountCode,
    determineNormalBalance,
    getCodePlaceholder,
    accountTypeOptions,
  };
};
