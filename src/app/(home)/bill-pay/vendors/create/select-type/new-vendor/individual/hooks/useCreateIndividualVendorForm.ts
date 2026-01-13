import { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  CreateVendorAddressInput as AddressSchemaType,
  CreateIndividualVendorInputSchemaType,
  CreateIndividualVendorSchema,
  CreateVendorAddressInput,
} from "@/src/app/(home)/bill-pay/_schemas/businessVendorSchema";
import { createIndividualVendor} from "@/src/lib/services/vendorServices";

type T = CreateIndividualVendorInputSchemaType;
interface UseCreateVendorFormProps {
  initialValues?: Partial<T>;
  onSuccess?: (created: CreateIndividualVendorInputSchemaType) => void;
  onError?: (errorMsg: string) => void;
}

export const useCreateIndividualVendorForm = (options?: UseCreateVendorFormProps) => {
  const queryClient = useQueryClient();
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
    businessProfileId: undefined,
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
    resolver: zodResolver(CreateIndividualVendorSchema),
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
      vendorId: cleanScalar(a.vendorId),
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
      businessProfileId: cleanScalar(raw.businessProfileId),
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
      setValue(k as keyof T, v as T[keyof T], { shouldDirty: true, shouldValidate: true });
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
    field: keyof CreateVendorAddressInput,
    value: string | boolean | number
  ) => {
    const curr = watch("addresses") ?? [];
    const next = [...curr];
    next[index] = { ...next[index], [field]: value };
    setValue("addresses", next, { shouldDirty: true, shouldValidate: true });
  };

 const firstErrorPath = (errs: FieldErrors<T>): string | null => {
    const walk = (obj: Record<string, unknown>, prefix = ""): string | null => {
      for (const key of Object.keys(obj)) {
        const val = obj[key];
        const path = prefix ? `${prefix}.${key}` : key;
        if (val && typeof val === "object" && ("type" in val || "message" in val)) {
          return path;
        }
        if (val && typeof val === "object") {
          const nested = walk(val as Record<string, unknown>, path);
          if (nested) return nested;
        }
      }
      return null;
    };
    return walk(errs as unknown as Record<string, unknown>);
  };


 
  const onSubmitHandler = handleSubmit(
    async (data) => {
      try {
        setLoading(true);
        setSubmitError(null);
        const payload = buildPayload(data);
        const res = await createIndividualVendor(payload);
        
        if ("statusCode" in res) {
          const msg = res.message || "Unexpected error creating vendor";
          setSubmitError(msg);
          options?.onError?.(msg);
          return;
        }

        queryClient.invalidateQueries({ queryKey: ["vendors"] });

        if (res.data) {
          options?.onSuccess?.(res.data);
        }
      } catch (e) {
        const error = e as Error;
        const msg = error?.message || "Unexpected error creating vendor";
        setSubmitError(msg);
        options?.onError?.(msg);
      } finally {
        setLoading(false);
      }
    },
    (invalid) => {
      const path = firstErrorPath(invalid);
      if (path) setFocus(path as keyof T);
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