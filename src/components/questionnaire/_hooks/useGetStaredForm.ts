/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useForm,
  useFieldArray,
  FieldPath,
  FieldPathValue,
  Resolver,
  FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateGetStartedOnboardingInput as T,
  CreateGetStartedOnboardingSchema,
} from "../schemas/schemas";
import { ZodError } from "zod";
import {
  BookkeepingStatus,
  BusinessType,
  ContactMethod,
} from "@/src/types/questionnaire";
import type { ErrorResponse } from "@/src/api/errorResponse";
import type { OnboardingPayload, Questionnaire } from "@/src/types/questionnaire";
import { deepMerge } from "../_utils/questionnaire-logic";
import { normalizePhonesForApi } from "../_utils/phone-normalize";
import { toast } from "sonner";
import { createQuestionnaire, getQuestionnaire } from "@/src/lib/services/questionnarieService";
import { ApiResponse } from "@/src/api/apiResponse";

type SubmitFn = (payload: Questionnaire) => Promise<ApiResponse<Questionnaire> | ErrorResponse>;

export const useGetStartedForm = (options?: {
  initialValues?: Partial<T>;
  onSuccess?: (payloadSent: T, result?: Questionnaire) => void;
  onError?: (error: Error) => void;
  submitFn?: SubmitFn;
}) => {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [phoneResetKey] = useState(0);
  const [getStartedData, setGetStartedData] = useState<T | null>(null);
  const [fetchData, setFetchData] = useState<OnboardingPayload | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  /* ---------------------- Default Values ---------------------- */
  const hardDefaults: T = {
    businessProfile: {
      business_name: "",
      dba: "",
      website: undefined,
      hasInvoices: false,
      hasBills: false,
      hasPayroll: false,
      hasTaxReturnPreparation: false,
      userId: undefined,
    },
    businessCompanyProfile: {
      business_type: undefined as unknown as BusinessType,
    },
    bookkeepingSettings: {
      status: undefined as unknown as BookkeepingStatus,
    },
    businessFinancialOverview: {
      avg_monthly_expenses: undefined,
    },
    businessAddress: [
      {
        line1: "",
        line2: "",
        city: "",
        state: "",
        zip_code: "",
        country: "US",
        latitude: undefined,
        longitude: undefined,
        business_profile_id: undefined,
      },
    ],
    contact: [
      {
        business_profile_id: undefined,
        first_name: "",
        last_name: "",
        title: "",
        isPrimary: false,
        isAuthorized: false,
        preferred_contact_method: ContactMethod.EMAIL,
        preferred_email_kind: undefined,
        preferred_phone_kind: undefined,
        phones: {
          contact_id: undefined,
          main: "",
          mobile: "",
          work: "",
          fax: "",
        },
        emails: {
          contact_id: undefined,
          work: "",
          personal: "",
          other: "",
        },
      },
    ],
  };

  const defaultValues: T = useMemo(
    () => deepMerge(hardDefaults, options?.initialValues ?? {}),
    []
  );

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    trigger,
    formState: { errors, isDirty, isValid },
  } = useForm<T>({
    resolver: zodResolver(CreateGetStartedOnboardingSchema) as Resolver<T>,
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues,
  });

  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
    update: updateAddress,
    insert: insertAddress,
  } = useFieldArray({ control, name: "businessAddress" });

  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact,
    update: updateContact,
    insert: insertContact,
  } = useFieldArray({ control, name: "contact" });

  const addEmptyAddress = () =>
    appendAddress({
      line1: "",
      line2: "",
      city: "",
      state: "",
      zip_code: "",
      country: "US",
      latitude: undefined,
      longitude: undefined,
      business_profile_id: undefined,
    });

  const addEmptyContact = () =>
    appendContact({
      business_profile_id: undefined,
      first_name: "",
      last_name: "",
      title: "",
      isPrimary: false,
      isAuthorized: false,
      preferred_contact_method: ContactMethod.EMAIL,
      preferred_email_kind: undefined,
      preferred_phone_kind: undefined,
      phones: {
        contact_id: undefined,
        main: "",
        mobile: "",
        work: "",
        fax: "",
      },
      emails: {
        contact_id: undefined,
        work: "",
        personal: "",
        other: "",
      },
    });

  function setContactPhone(index: number, key: "main" | "mobile" | "work" | "fax", value: string) {
    setValue(`contact.${index}.phones.${key}`, value, { shouldDirty: true });
  }

  function setContactEmail(index: number, key: "work" | "personal" | "other", value: string) {
    setValue(`contact.${index}.emails.${key}`, value, { shouldDirty: true });
  }

  const getFieldError = (fieldPath: string) => {
    const pathArray = fieldPath.split(".");
    let errorValue: FieldErrors<T> | Record<string, unknown> | string | undefined = errors;
    
    for (const path of pathArray) {
      if (errorValue && typeof errorValue === "object" && path in errorValue) {
        errorValue = (errorValue as Record<string, unknown>)[path] as FieldErrors<T> | Record<string, unknown> | string | undefined;
      } else {
        errorValue = undefined;
        break;
      }
    }
    
    if (errorValue && typeof errorValue === "object" && "message" in errorValue) {
      return (errorValue as { message: string }).message;
    }
    return null;
  };

  const makePaths = (len: number, base: string, fields: string[]) =>
    Array.from({ length: len }, (_, i) => fields.map((f) => `${base}.${i}.${f}`)).flat();

  const getStepFieldNames = (stepIndex: number): string[] => {
    switch (stepIndex) {
      case 0:
        return [
          "businessProfile.business_name",
          ...makePaths(addressFields.length, "businessAddress", [
            "line1",
            "city",
            "state",
            "zip_code",
          ]),
          "contact.0",
          ...makePaths(contactFields.length, "contact", [
            "first_name",
            "last_name",
            "title",
            "emails.work",
            "emails.personal",
            "emails.other",
            "phones.mobile",
            "preferred_contact_method",
            "preferred_email_kind",
            "preferred_phone_kind",
          ]),
        ];
      case 1:
        return [
          "bookkeepingSettings.status",
          "businessCompanyProfile.business_type",
          "businessFinancialOverview.avg_monthly_expenses",
        ];
      default:
        return [];
    }
  };

  const validateStep = async (stepIndex: number): Promise<boolean> => {
    const fieldsToValidate = getStepFieldNames(stepIndex);
    if (!fieldsToValidate.length) return true;
    return trigger(fieldsToValidate as FieldPath<T>[]);
  };

  const getStepErrors = (stepIndex: number) => {
    const fieldsToCheck = getStepFieldNames(stepIndex);
    const stepErrors: Record<string, unknown> = {};
    
    for (const field of fieldsToCheck) {
      const parts = field.split(".");
      let node: FieldErrors<T> | Record<string, unknown> | undefined = errors;
      
      for (const p of parts) {
        if (node && typeof node === "object" && p in node) {
          node = (node as Record<string, unknown>)[p] as FieldErrors<T> | Record<string, unknown> | undefined;
        } else {
          node = undefined;
          break;
        }
      }
      
      if (node) stepErrors[field] = node;
    }
    return stepErrors;
  };

  const submitFn: SubmitFn =
    options?.submitFn ?? (async (payload: Questionnaire) => createQuestionnaire(payload));

  const onSubmit = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      handleSubmit(
        async (values) => {
          setLoading(true);
          setSubmitError(null);
          setIsSubmitted(false);

          try {
            const parsed = CreateGetStartedOnboardingSchema.parse(values);
            const apiPayload = normalizePhonesForApi(parsed);
            const resp = await submitFn(apiPayload);

            if ("statusCode" in resp) {
              console.error("API returned error:", resp.message);
              toast.error(resp.message || "Failed to submit questionnaire.");
              setSubmitError(resp.message ?? "Submission failed.");
              setIsSubmitted(false);
              resolve(false);
              return;
            }

            if (resp?.data && typeof resp.data === "object" && "error" in resp.data) {
              const errorMsg = (resp.data as { error?: string; message?: string }).error || 
                             (resp.data as { error?: string; message?: string }).message || 
                             "Get started process failed";
              console.error("API returned error in data:", errorMsg);
              toast.error(errorMsg);
              setSubmitError(errorMsg);
              setIsSubmitted(false);
              resolve(false);
              return;
            }

            if (!resp?.data) {
              console.error("API returned no data");
              toast.error("Failed to submit questionnaire.");
              setSubmitError("Submission failed.");
              setIsSubmitted(false);
              resolve(false);
              return;
            }
            
            setGetStartedData(parsed);
            setIsSubmitted(true);
            reset(defaultValues);

            toast.success("Get started completed successfully!");

            if (options?.onSuccess) {
              await options.onSuccess(parsed, resp.data);
            }
            
            resolve(true);
          } catch (err) {
            console.error("Error during submission:", err);
            toast.error(
              err instanceof ZodError
                ? err.issues.map((i) => i.message).join(" • ")
                : "Unexpected error occurred."
            );
            setIsSubmitted(false);
            options?.onError?.(err as Error);
            resolve(false);
          } finally {
            setLoading(false);
          }
        },
        (errors) => {
          console.error("Validation failed. Errors:", errors);
          toast.error("Please check the highlighted fields and try again.");
          setIsSubmitted(false);
          resolve(false);
        }
      )();
    });
  };

  function set<TFieldName extends FieldPath<T>>(
    name: TFieldName,
    value: FieldPathValue<T, TFieldName>
  ) {
    setValue(name, value, { shouldDirty: true });
  }

  const fetchGetStartedData = async () => {
    setLoading(true);
    setSubmitError(null);
    try {
      const resp = await getQuestionnaire();

      if ("statusCode" in resp) {
        console.warn("Error fetching questionnaire:", resp.message);
        setSubmitError(resp.message);
        setFetchData(null);
        setLoading(false);
        return;
      }

      if (!resp?.data) {
        console.warn("getQuestionnaire returned undefined");
        setFetchData(null);
        setLoading(false);
        return;
      }

      setFetchData(resp.data ?? null);
    } catch (error) {
      console.error("Failed to fetch onboarding data:", error);
      setSubmitError("Failed to fetch onboarding data");
      setFetchData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGetStartedData();
  }, []);

  return {
    control,
    register,
    watch,
    setValue,
    set,
    trigger,
    errors,
    isDirty,
    isValid,
    setIsSubmitted,
    isSubmitted,
    addressFields,
    contactFields,
    appendAddress,
    removeAddress,
    updateAddress,
    insertAddress,
    appendContact,
    removeContact,
    updateContact,
    insertContact,
    addEmptyAddress,
    addEmptyContact,
    setContactPhone,
    setContactEmail,
    validateStep,
    getStepErrors,
    getFieldError,
    onSubmit,
    loading,
    submitError,
    getStartedData,
    reset,
    phoneResetKey,
    fetchData,
    setFetchData,
  };
};
