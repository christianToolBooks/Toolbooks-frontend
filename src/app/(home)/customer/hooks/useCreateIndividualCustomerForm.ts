/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useCreateVendorForm.ts
import { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCustomerAddressInput as AddressSchemaType,
  CreateIndividualCustomerInputSchemaType,
  CreateIndividualCustomerSchema,
} from "../../customer/_schema/customerSchema";
import { createIndividualCustomer } from "@/src/lib/services/customersServices";

type T = CreateIndividualCustomerInputSchemaType;
interface UseCreateCustomerFormProps {
  initialValues?: Partial<T>;
  onSuccess?: (created: any) => void;
  onError?: (errorMsg: string) => void;
}

export const useCreateIndividualCustomerForm = (options?: UseCreateCustomerFormProps) => {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [phoneResetKey, setPhoneResetKey] = useState(0);

  const hardDefaults: T = {
    name: "",
    paymentTerms: "net_30",
    defaultCurrency: "USD",
    type: "individual",
    isActive: true,
    addresses: [],
    business_profile_id: undefined,
    email: undefined,
    phone: undefined,
    notes: undefined,
  };

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    setFocus,
    watch,
    trigger,
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(CreateIndividualCustomerSchema) as any,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      ...hardDefaults,
      ...options?.initialValues,
      isActive:
        options?.initialValues?.isActive ?? hardDefaults.isActive,
      addresses:
        options?.initialValues?.addresses ?? hardDefaults.addresses,
    },
  });

  const cleanScalar = <V,>(v: V | undefined) =>
    (typeof v === "string" && v.trim() === "") ? undefined : v;

  const cleanAddress = (a: AddressSchemaType): AddressSchemaType | null => {
    const out: AddressSchemaType = {
      Customer_id: cleanScalar(a.Customer_id),
      type: a.type, 
      line1: cleanScalar(a.line1),
      line2: cleanScalar(a.line2),
      city: cleanScalar(a.city),
      state: cleanScalar(a.state),
      postalCode: cleanScalar(a.postalCode),
      country: cleanScalar(a.country),
      latitude: typeof a.latitude === "number" ? a.latitude : undefined,
      longitude: typeof a.longitude === "number" ? a.longitude : undefined,
      isDefault: a.isDefault,
    };
    const hasAny =
      out.line1 || out.line2 || out.city || out.state || out.postalCode || out.country;
    return hasAny ? out : null;
  };

  const buildPayload = (raw: T): T => {
    const base: T = {
     business_profile_id: cleanScalar(raw.business_profile_id),
      name: raw.name, 
      paymentTerms: raw.paymentTerms,
      type: "individual",
      defaultCurrency: raw.defaultCurrency,
      email: cleanScalar(raw.email),
      phone: cleanScalar(raw.phone),
      notes: cleanScalar(raw.notes),
      isActive: raw.isActive ?? true,
      addresses: (raw.addresses ?? [])
        .map(cleanAddress)
        .filter((a): a is AddressSchemaType => !!a),
    };
    return base;
  };

  const onUpdateFormData = (updates: Partial<T>) => {
    Object.entries(updates).forEach(([k, v]) => {
      // @ts-expect-error secure index by Zod at runtime
      setValue(k, v as any, { shouldDirty: true, shouldValidate: true });
    });
  };

  const onAddAddress = () => {
    const curr = watch("addresses") ?? [];
    const next: AddressSchemaType = {
      type: "billed_from",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      isDefault: curr.length === 0 ? true : false,
    };
    setValue("addresses", [...curr, next], { shouldDirty: true });
  };

  const onRemoveAddress = (index: number) => {
    const curr = watch("addresses") ?? [];
    const copy = curr.filter((_, i) => i !== index);
    setValue("addresses", copy, { shouldDirty: true, shouldValidate: true });
  };

  const onUpdateAddress = (
    index: number,
    field: keyof AddressSchemaType,
    value: string | boolean | number
  ) => {
    const curr = watch("addresses") ?? [];
    const next = [...curr];
    next[index] = { ...next[index], [field]: value };
    setValue("addresses", next, { shouldDirty: true, shouldValidate: true });
  };

 const firstErrorPath = (errs: FieldErrors<T>): string | null => {
    const walk = (obj: any, prefix = ""): string | null => {
      for (const key of Object.keys(obj)) {
        const val = obj[key];
        const path = prefix ? `${prefix}.${key}` : key;
        if (val?.type || val?.message) return path; 
        if (val && typeof val === "object") {
          const nested = walk(val, path);
          if (nested) return nested;
        }
      }
      return null;
    };
    return walk(errs);
  };


 
  const onSubmitHandler = handleSubmit(
    async (data) => {
      try {
        setLoading(true);
        setSubmitError(null);
        const payload = buildPayload(data);
        const res = await createIndividualCustomer(payload);
        options?.onSuccess?.(res);
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || "Unexpected error creating vendor";
        setSubmitError(msg);
        options?.onError?.(msg);
      } finally {
        setLoading(false);
      }
    },
    (invalid) => {
      const path = firstErrorPath(invalid);
      if (path) setFocus(path as any);
      setSubmitError("Please fix the highlighted fields.");
    }
  );

  const resetForm = () => {
    reset(hardDefaults);
    setPhoneResetKey(prev => prev + 1);
  };

  return {
    register,
    setValue,
    getValues,
    watch,
    setFocus,
    trigger,
    errors,
    loading,
    submitError,
    phoneResetKey, 
    onUpdateFormData,
    onAddAddress,
    onRemoveAddress,
    onUpdateAddress,
    onSubmit: onSubmitHandler,
    resetForm,
  };
};