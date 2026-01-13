import {
  CreateCustomerToPay,
  CustomerResponse,
} from "@/src/types/paymentMethods";
import {
  customerFormToPaymentSchema,
  CustomerFormToPaymentInput as T,
} from "../schemas/schemas";
import {
  createCustomerToPay,
  CreateCustomerToPayResponse,
  getCustomerToPay,
  updateCustomerToPay,
  deleteCustomerToPay,
} from "@/src/lib/services/methodsToPayService";
import { ErrorResponse } from "@/src/api/errorResponse";
import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

type SubmitFn = (
  payload: CreateCustomerToPay
) => Promise<CreateCustomerToPayResponse | ErrorResponse>;

export const useCreateMethodPayForm = (options?: {
  initialValues?: Partial<T>;
  onSuccess?: (payloadSent: T, result?: CreateCustomerToPay) => void;
  submitFn?: SubmitFn;
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingCustomer, setLoadingCustomer] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerToPay, setCustomerToPay] =
    useState<CreateCustomerToPay | null>(null);
  const [hasCustomer, setHasCustomer] = useState(false);
  const [customerData, setCustomerData] =
    useState<CustomerResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const hardDefaults: T = {
    name: "",
    email: "",
    send_email_address: "",
    country: "US",
    address_line_1: "",
    city: "",
    state: "",
    zip_code: "",
    latitude: undefined,
    longitude: undefined,
    phone_number: "",
  };

  const defaultValues: T = {
    ...hardDefaults,
    ...options?.initialValues,
  };

  const form = useForm<T>({
    resolver: zodResolver(customerFormToPaymentSchema) as Resolver<T>,
    defaultValues,
    mode: "onBlur",
  });

  const submitFn: SubmitFn = options?.submitFn ?? createCustomerToPay;

  const onSubmit = async (data: T) => {
    setLoading(true);
    setError(null);

    const cleanedData = { ...data };
    delete (cleanedData as T).latitude;
    delete (cleanedData as T).longitude;

    try {
      const result = await submitFn(cleanedData as T);

      if (result && !("error" in result)) {
        options?.onSuccess?.(data, result as unknown as CreateCustomerToPay);
        setCustomerToPay(result as unknown as CreateCustomerToPay);
        await checkExistingCustomer();
      } else {
        const errorMsg =
          (result as ErrorResponse)?.message || "Failed to create customer";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      const errorMsg =
        error instanceof Error ? error.message : "Failed to create customer";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async (data: T) => {
    if (!customerData?.id) {
      toast.error("No customer ID found");
      return;
    }

    setLoading(true);
    setError(null);

    const cleanedData = { ...data };
    delete (cleanedData as T).latitude;
    delete (cleanedData as T).longitude;

    try {
      const result = await updateCustomerToPay(
        cleanedData as CreateCustomerToPay,
        customerData.id
      );

      if (result && "data" in result && result.data) {
        toast.success("Customer updated successfully!");
        await checkExistingCustomer();
        setIsEditing(false);
      } else {
        const errorMsg =
          (result as ErrorResponse)?.message || "Failed to update customer";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      const errorMsg =
        error instanceof Error ? error.message : "Failed to update customer";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!customerData?.id) {
      toast.error("No customer ID found");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await deleteCustomerToPay(customerData.id);

      if (result && "code" in result && result.code === 200) {
        toast.success("Customer deleted successfully!");
        setCustomerToPay(null);
        setHasCustomer(false);
        setCustomerData(null);
        setIsEditing(false);
        form.reset(hardDefaults);
        await checkExistingCustomer();
      } else if (result && ("error" in result || "message" in result)) {
        const errorMsg =
          (result as ErrorResponse)?.message || "Failed to delete customer";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      const errorMsg =
        error instanceof Error ? error.message : "Failed to delete customer";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const onError = () => {
    toast.error("Please fix the form errors before submitting");
  };

  const checkExistingCustomer = async () => {
    setLoadingCustomer(true);
    try {
      const result = await getCustomerToPay();
      if ("data" in result && result.data) {
        setCustomerToPay(result.data);
        setHasCustomer(true);
        setCustomerData(result.data as CustomerResponse);

        form.reset({
          name: result.data.name || "",
          email: result.data.email || "",
          send_email_address: result.data.send_email_address || "",
          country: result.data.country || "US",
          address_line_1: result.data.address_line_1 || "",
          city: result.data.city || "",
          state: result.data.state || "",
          zip_code: result.data.zip_code || "",
          phone_number: result.data.phone_number || "",
        });
      } else {
        setHasCustomer(false);
        setCustomerData(null);
      }
    } catch (error) {
      console.error("Error fetching existing customer:", error);
      setHasCustomer(false);
      setCustomerData(null);
    } finally {
      setLoadingCustomer(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    if (customerData) {
      form.reset({
        name: customerData.name || "",
        email: customerData.email || "",
        send_email_address: customerData.send_email_address || "",
        country: customerData.country || "US",
        address_line_1: customerData.address_line_1 || "",
        city: customerData.city || "",
        state: customerData.state || "",
        zip_code: customerData.zip_code || "",
        phone_number: customerData.phone_number || "",
      });
    }
  };

  return {
    ...form,
    submit: form.handleSubmit(hasCustomer && isEditing ? onUpdate : onSubmit, onError),
    loadingCustomer,
    loading,
    error,
    customerToPay,
    hasCustomer,
    checkExistingCustomer,
    customerData,
    isEditing,
    toggleEdit,
    cancelEdit,
    onDelete,
  };
};
