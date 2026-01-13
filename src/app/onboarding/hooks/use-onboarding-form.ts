"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type {
  OnboardingPayload,
  OnboardingStep,
  Contact,
  OnboardingAddress,
} from "@/src/types/questionnaire";
import { getByPath, getNextStep, getPreviousStep } from "../_utils/onboarding-config";
import { useOnboardingData } from "./use-onboarding-data";
import { useOnboardingContacts } from "./use-onboarding-contacts";
import { useOnboardingAddresses } from "./use-onboarding-addresses";
import {
  useOnboardingValidate,
  type ValidationIssue as ValidationError,
} from "./use-onboarding-validate";
import { serializeForApi } from "../_utils/onboarding-serialize";
import { normalizeFromServer } from "../_utils/onboarding-normalize";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createOnboarding } from "@/src/lib/services/questionnarieService";

/* ----------------------- Helper functions ----------------------- */

function mergeSection<TSection>(
  prev: TSection | undefined,
  patch: Partial<TSection> | TSection
): TSection {
  if (Array.isArray(prev) || Array.isArray(patch)) return patch as TSection;
  return { ...(prev as object), ...(patch as object) } as TSection;
}

function prepareStepData(step: OnboardingStep, data: Partial<OnboardingPayload>) {
  const stepData = { ...data };

  if (!stepData.businessProfile && data.businessProfile) {
    stepData.businessProfile = data.businessProfile;
  }

  if (step === "toolbooks-modules") {
    const flags = {
      hasPayroll: data.businessProfile?.hasPayroll === true,
      hasInvoices: data.businessProfile?.hasInvoices === true,
      hasBills: data.businessProfile?.hasBills === true,
      hasTaxReturnPreparation: data.businessProfile?.hasTaxReturnPreparation === true,
    };

    if (!flags.hasPayroll) delete stepData.payrrollSettings;
    if (!flags.hasInvoices) delete stepData.invoicingSettings;
    if (!flags.hasBills) delete stepData.billPaySettings;
  }

  if (step === "bookkeeping-services") {
    const hasTaxReturnPreparation = data.businessProfile?.hasTaxReturnPreparation === true;
    
    if (!hasTaxReturnPreparation) {
      delete stepData.taxReturnPreparation;
    } else {
      if (!stepData.taxReturnPreparation) {
        stepData.taxReturnPreparation = {
          business: {
            biz_last_filed_year: undefined,
            biz_num_states_filed: undefined,
            business_form_filed: undefined,
            biz_tax_states: [],
          },
          individual: {
            ind_last_filed_year: undefined,
            ind_num_states_filed: undefined,
            ind_tax_states: [],
          },
        };
      } else {
        // Asegurar que business e individual existan
        if (!stepData.taxReturnPreparation.business) {
          stepData.taxReturnPreparation.business = {
            biz_last_filed_year: undefined,
            biz_num_states_filed: undefined,
            business_form_filed: undefined,
            biz_tax_states: [],
          };
        }
        if (!stepData.taxReturnPreparation.individual) {
          stepData.taxReturnPreparation.individual = {
            ind_last_filed_year: undefined,
            ind_num_states_filed: undefined,
            ind_tax_states: [],
          };
        }
      }
    }
  }

  return stepData;
}

type UseOnboardingFormOptions = {
  autoLoad?: boolean;
  initialData?: Partial<OnboardingPayload>;
};

type SubmitOk = { success: true; data: OnboardingPayload };
type SubmitFail =
  | { success: false; errors: ValidationError[] }
  | { success: false; error: string };

type UseOnboardingFormReturn = {
  currentStep: OnboardingStep;
  data: Partial<OnboardingPayload>;
  errors: ValidationError[];
  isSubmitting: boolean;
  isLoading: boolean;
  loadError: string | null;
  isLoaded: boolean;
  updateSection: <K extends keyof OnboardingPayload>(
    key: K,
    patch: Partial<OnboardingPayload[K]> | OnboardingPayload[K]
  ) => void;
  updateBusinessContactAt: (index: number, patch: Partial<Contact>) => void;
  addAuthorizedContact: () => void;
  removeBusinessContact: (index: number) => void;
  updateAddressAt: (index: number, patch: Partial<OnboardingAddress>) => void;
  addAddress: () => void;
  removeAddress: (index: number) => void;
  goToNextStep: () => boolean;
  goToPreviousStep: () => boolean;
  goToStep: (s: OnboardingStep) => void;
  submitForm: () => Promise<SubmitOk | SubmitFail>;
  clearErrors: () => void;
  loadAndFill: () => Promise<void>;
  isAutofilled: (path: string) => boolean;
  getFieldError: (fieldPath: string) => string | undefined;
};

export function useOnboardingForm(opts?: UseOnboardingFormOptions): UseOnboardingFormReturn {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("business-info");
  const [data, setData] = useState<Partial<OnboardingPayload>>(opts?.initialData ?? {});
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setSubmitting] = useState(false);
  const loadedSnapshotRef = useRef<Partial<OnboardingPayload> | null>(null);
  const router = useRouter();

  const isAutofilled = useCallback(
    (path: string): boolean => {
      const snap = loadedSnapshotRef.current;
      if (!snap) return false;
      const initial = getByPath(snap, path);
      const current = getByPath(data, path);
      const nonEmpty = (v: unknown) =>
        v !== "" && v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0);
      return nonEmpty(initial) && initial === current;
    },
    [data]
  );

  const { isLoading, loadError, isLoaded, loadAndFill } = useOnboardingData({
    autoLoad: opts?.autoLoad !== false,
    onLoaded: (incoming) => {
      loadedSnapshotRef.current = incoming;
      setData((prev) => ({ ...prev, ...incoming }));
    },
    normalize: normalizeFromServer,
  });

  const { validateStep, validateAll, isFieldRequired } = useOnboardingValidate();

  const { updateBusinessContactAt, addAuthorizedContact, removeBusinessContact } =
    useOnboardingContacts({
      getContacts: () => data.businessContacts ?? [],
      setContacts: (next) =>
        setData((prev) => ({ ...prev, businessContacts: next })),
    });

  const { updateAddressAt, addAddress, removeAddress } = useOnboardingAddresses({
    getAddresses: () => data.businessAddresses ?? [],
    setAddresses: (next) =>
      setData((prev) => ({ ...prev, businessAddresses: next })),
  });

  const updateSection = useCallback(
    <K extends keyof OnboardingPayload>(
      key: K,
      patch: Partial<OnboardingPayload[K]> | OnboardingPayload[K]
    ): void => {
      setData((prev) => {
        const next = mergeSection(prev[key], patch);
        return { ...prev, [key]: next };
      });
    },
    []
  );

  const goToNextStep = useCallback((): boolean => {
    const stepData = prepareStepData(currentStep, data);
    
    // ✅ Ejecutar validación ANTES de avanzar
    const result = validateStep(currentStep, stepData);
    
    if (!result.ok) {
      console.error("❌ Validation failed:", result.errors);
      setErrors(result.errors);
      
      // ✅ Hacer scroll al primer campo con error
      setTimeout(() => {
        const firstErrorField = document.querySelector('[aria-invalid="true"]');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        } else {
          // Si no hay campo con aria-invalid, buscar el primer error en general
          const firstError = document.querySelector('.text-destructive');
          firstError?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
      
      // ✅ NO permitir avanzar si hay errores
      return false;
    }
    
    // ✅ Limpiar errores y avanzar
    setErrors([]);
    const next = getNextStep(currentStep);
    if (next) setCurrentStep(next);
    return next != null;
  }, [currentStep, data, validateStep]);

  const goToPreviousStep = useCallback((): boolean => {
    const prev = getPreviousStep(currentStep);
    if (prev) setCurrentStep(prev);
    return prev != null;
  }, [currentStep]);

  const goToStep = useCallback((s: OnboardingStep): void => {
    setErrors([]);
    setCurrentStep(s);
  }, []);

  const submitForm = useCallback(async (): Promise<SubmitOk | SubmitFail> => {
    const preparedData = prepareStepData("toolbooks-modules", data);
    const validation = validateAll(preparedData);

    if (!validation.ok) {
      setErrors(validation.errors);
      return { success: false, errors: validation.errors };
    }

    setSubmitting(true);
    try {
      const apiPayload = serializeForApi(preparedData);
      const resp = await createOnboarding(apiPayload);

      if ("statusCode" in resp) {
        toast.error(resp.message || "Failed to submit onboarding.");
        setSubmitting(false);
        return { success: false, error: resp.message ?? "Submission failed" };
      }

      if (!resp?.data) {
        toast.error("Invalid API response: missing data.");
        setSubmitting(false);
        return { success: false, error: "Missing data in response" };
      }

      toast.success(resp.message || "Onboarding completed successfully!");
      try {
        await fetch("/api/set", { method: "POST" });
      } catch (err) {
        console.error("Error setting onboarding cookie:", err);
      }

      setSubmitting(false);
      setTimeout(() => router.push("/dashboard"), 150);
      return { success: true, data: resp.data };
    } catch (err) {
      console.error("Unexpected error submitting onboarding:", err);
      setSubmitting(false);
      toast.error("Unexpected error during submission");
      return { success: false, error: "Unexpected error" };
    }
  }, [data, validateAll, router]);

  /* ----------------------- Field error mapping ----------------------- */
  const getFieldError = useCallback(
    (fieldPath: string): string | undefined => {
      if (!isFieldRequired(fieldPath, data)) return undefined;
      const exact = errors.find((e) => e.field === fieldPath);
      if (exact) return exact.message;

      const nested = errors.find(
        (e) => e.field.startsWith(fieldPath + ".") || fieldPath.startsWith(e.field + ".")
      );
      if (nested) return nested.message;

      const fp = fieldPath.split(".");
      const shaped = errors.find((e) => {
        const ep = e.field.split(".");
        if (ep.length !== fp.length) return false;
        return ep.every((seg, i) => {
          const aNum = !isNaN(Number(seg));
          const bNum = !isNaN(Number(fp[i]));
          return (aNum && bNum) || seg === fp[i];
        });
      });
      return shaped?.message;
    },
    [errors, data, isFieldRequired]
  );

  /* ----------------------- Return API ----------------------- */
  return useMemo(
    () => ({
      currentStep,
      data,
      errors,
      isSubmitting,
      isLoading,
      loadError,
      isLoaded,
      updateSection,
      updateBusinessContactAt,
      addAuthorizedContact,
      removeBusinessContact,
      updateAddressAt,
      addAddress,
      removeAddress,
      goToNextStep,
      goToPreviousStep,
      goToStep,
      submitForm,
      clearErrors: () => setErrors([]),
      loadAndFill,
      isAutofilled,
      getFieldError,
    }),
    [
      currentStep,
      data,
      errors,
      isSubmitting,
      isLoading,
      loadError,
      isLoaded,
      updateSection,
      updateBusinessContactAt,
      addAuthorizedContact,
      removeBusinessContact,
      updateAddressAt,
      addAddress,
      removeAddress,
      goToNextStep,
      goToPreviousStep,
      goToStep,
      submitForm,
      loadAndFill,
      isAutofilled,
      getFieldError,
    ]
  );
}
