// app/onboarding/hooks/use-wizard-form-logic.ts
"use client";

import { useState, useCallback, useMemo, use } from "react";
import { useOnboardingForm } from "./use-onboarding-form";
import { useOnboardingValidate } from "./use-onboarding-validate";
import type {
  OnboardingStep,
  Contact,
  ContactPhones,
  ContactEmails,
} from "@/src/types/questionnaire";
import { ContactMethod } from "@/src/types/questionnaire";
import { getStepIndex, ONBOARDING_STEPS } from "../_utils/onboarding-config";

export function useWizardFormLogic() {
  const [completedSteps, setCompletedSteps] = useState<OnboardingStep[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const formHook = useOnboardingForm({ autoLoad: true });
  const { getFieldError: getFieldErrorBase } = useOnboardingValidate();

  const {
    currentStep,
    data,
    errors,
    isLoading,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    submitForm,
    loadAndFill,
  } = formHook;

  const contactHelpers = useMemo(
    () => ({
      emptyPhones: (): ContactPhones => ({
        main: "",
        mobile: "",
        work: "",
        fax: "",
      }),
      emptyEmails: (): ContactEmails => ({ work: "", personal: "", other: "" }),
      emptyContact: (): Contact => ({
        first_name: "",
        last_name: "",
        title: "",
        isPrimary: false,
        isAuthorized: false,
        preferred_contact_method: ContactMethod.EMAIL,
        phones: { main: "", mobile: "", work: "", fax: "" },
        emails: { work: "", personal: "", other: "" },
      }),
    }),
    []
  );

  const primaryContact: Contact = useMemo(() => {
    const c = data.businessContacts?.find((bc) => bc.isPrimary);
    if (!c)
      return {
        ...contactHelpers.emptyContact(),
        isPrimary: true,
        isAuthorized: true,
      };
    return {
      ...contactHelpers.emptyContact(),
      ...c,
      phones: { ...contactHelpers.emptyPhones(), ...(c.phones ?? {}) },
      emails: { ...contactHelpers.emptyEmails(), ...(c.emails ?? {}) },
    };
  }, [data.businessContacts, contactHelpers]);

  const getFieldError = useCallback(
    (fieldPath: string): string | undefined => {
      return getFieldErrorBase(fieldPath, errors);
    },
    [getFieldErrorBase, errors]
  );

  const stepInfo = useMemo(
    () => ({
      currentStepIndex: getStepIndex(currentStep),
      isFirstStep: getStepIndex(currentStep) === 0,
      isLastStep: getStepIndex(currentStep) === ONBOARDING_STEPS.length - 1,
      totalSteps: ONBOARDING_STEPS.length,
    }),
    [currentStep]
  );

  const handlers = useMemo(
    () => ({
      handleNext: (): void => {
        if (isLoading) return;
        const stepBefore = currentStep;
        const success = goToNextStep();
        if (success && !completedSteps.includes(stepBefore)) {
          setCompletedSteps((prev) => [...prev, stepBefore]);
        }
      },

      handlePrevious: (): void => {
        if (isLoading) return;
        goToPreviousStep();
      },

      handleStepClick: (step: OnboardingStep): void => {
        if (isLoading) return;
        goToStep(step);
      },

      handleSubmit: async (): Promise<void> => {
        if (isLoading) return;
        const result = await submitForm();
        if (result.success) {
          setIsCompleted(true);
          setCompletedSteps(ONBOARDING_STEPS.map((s) => s.id));
        }
      },

      handleRetryLoad: (): void => {
        loadAndFill();
      },
    }),
    [
      isLoading,
      currentStep,
      completedSteps,
      goToNextStep,
      goToPreviousStep,
      goToStep,
      submitForm,
      loadAndFill,
    ]
  );

  return {
    ...formHook,

    completedSteps,
    isCompleted,
    primaryContact,

    ...stepInfo,

    getFieldError,
    contactHelpers,

    ...handlers,
  };
}
