/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCustomerSchema,
  CreateCustomerAddressInput as AddressSchemaType,
  CreateCustomerContactInput as ContactSchemaType,
  CreateCustomerInputSchemaType,
} from "../../customer/_schema/customerSchema";
import { createCustomer } from "@/src/lib/services/customersServices";

type T = CreateCustomerInputSchemaType;
interface UseCreateCustomerFormProps {
  initialValues?: Partial<T>;
  onSuccess?: (created: any) => void;
  onError?: (errorMsg: string) => void;
}

export const useCreateBusinessCustomerForm = (options?: UseCreateCustomerFormProps) => {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [phoneResetKey, setPhoneResetKey] = useState(0);

  const hardDefaults: T = {
    name: "",
    paymentTerms: "net_30",
    defaultCurrency: "USD",
    type: "business",
    isActive: true,
    contacts: [],
    addresses: [],
    business_profile_id: undefined,
    legalName: undefined,
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
    resolver: zodResolver(CreateCustomerSchema) as any,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      ...hardDefaults,
      ...options?.initialValues,
      isActive:
        options?.initialValues?.isActive ?? hardDefaults.isActive,
      contacts:
        options?.initialValues?.contacts ?? hardDefaults.contacts,
      addresses:
        options?.initialValues?.addresses ?? hardDefaults.addresses,
    },
  });

  const cleanScalar = <V,>(v: V | undefined) =>
    (typeof v === "string" && v.trim() === "") ? undefined : v;

  const cleanContact = (c: ContactSchemaType): ContactSchemaType | null => {
    const out: ContactSchemaType = {
      customerId: cleanScalar(c.customerId),
      name: cleanScalar(c.name),
      email: cleanScalar(c.email),
      phone: cleanScalar(c.phone),
      role: cleanScalar(c.role),
      jobTitle: cleanScalar(c.jobTitle),
      isPrimary: c.isPrimary,
    };
    const hasData =
      out.name || out.email || out.phone || out.role || out.jobTitle || out.isPrimary;
    return hasData ? out : null;
  };

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
      legalName: cleanScalar(raw.legalName),
      type: "business",
      paymentTerms: raw.paymentTerms,
      defaultCurrency: raw.defaultCurrency,
      email: cleanScalar(raw.email),
      phone: cleanScalar(raw.phone),
      notes: cleanScalar(raw.notes),

      isActive: raw.isActive ?? true,
      contacts: (raw.contacts ?? [])
        .map(cleanContact)
        .filter((c): c is ContactSchemaType => !!c),
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

  const onAddContact = () => {
    const curr = watch("contacts") ?? [];
    const next: ContactSchemaType = {
      name: "",
      email: "",
      phone: "",
      role: "",
      jobTitle: "",
      isPrimary: curr.length === 0, 
    };
    setValue("contacts", [...curr, next], { shouldDirty: true });
  };

  const onRemoveContact = (index: number) => {
    const curr = watch("contacts") ?? [];
    const copy = curr.filter((_, i) => i !== index);
    setValue("contacts", copy, { shouldDirty: true, shouldValidate: true });
  };

  const onUpdateContact = (
    index: number,
    field: keyof ContactSchemaType,
    value: string | boolean
  ) => {
    const curr = watch("contacts") ?? [];
    const next = [...curr];
    next[index] = { ...next[index], [field]: value };
    setValue("contacts", next, { shouldDirty: true, shouldValidate: true });
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
        const res = await createCustomer(payload);
        options?.onSuccess?.(res);
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || "Unexpected error creating customer";
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
    phoneResetKey, // Exponer el key para usar en componentes
    onUpdateFormData,
    onAddContact,
    onRemoveContact,
    onUpdateContact,
    onAddAddress,
    onRemoveAddress,
    onUpdateAddress,
    onSubmit: onSubmitHandler,
    resetForm,
  };
};