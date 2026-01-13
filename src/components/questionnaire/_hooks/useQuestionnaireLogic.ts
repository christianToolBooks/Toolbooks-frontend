/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState, useEffect } from "react";
import {
  BusinessProfile,
  Address,
  Contact,
  BookkeepingSettings,
  CompanyProfile,
  FinancialOverview,
  BookkeepingStatus,
} from "@/src/types/questionnaire";
import { calculateQuote } from "../_utils/questionnaire-logic";
import type { CreateGetStartedOnboardingInput as T } from "../schemas/schemas";
import type { FieldPath } from "react-hook-form";
import { useGetStartedForm } from "./useGetStaredForm";
import { toast } from "sonner";

export function useQuestionnaireLogic(onGetStartedSuccess?: () => Promise<void>) {
  const {
    watch,
    setValue,
    onSubmit,
    loading,
    submitError,
    validateStep,
    getStepErrors,
    getFieldError,
    addEmptyAddress,
    removeAddress,
    addEmptyContact,
    removeContact,
    register,
    errors,
    isSubmitted,
    fetchData,
    setFetchData,
  } = useGetStartedForm({
    onSuccess: async (payloadSent, result) => {
      
      if (onGetStartedSuccess) {
        await onGetStartedSuccess();
        setCurrentStep(4);
      }
    },
  });

  const TOTAL_STEPS_TO_REVIEW = 6;
  const hasExistingProfile = !!(fetchData?.business_name|| fetchData?.get_started_complete);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [subscriptionCreated, setSubscriptionCreated] = useState(false);

  useEffect(() => {
    interface FinancialOverviewData {
      avg_monthly_expenses?: string;
    }
    
    const financialOverview = (fetchData as { financialOverview?: FinancialOverviewData })?.financialOverview;
    const expenseValue = financialOverview?.avg_monthly_expenses;
    
    if (expenseValue !== undefined && expenseValue !== null) {
      setValue(
        "businessFinancialOverview.avg_monthly_expenses" as FieldPath<T>,
        expenseValue,
        { shouldDirty: true, shouldValidate: true }
      );
    } else {
      console.warn("No avg_monthly_expenses in fetchData or value is undefined/null");
    }
  }, [fetchData, setValue, watch]);

  useEffect(() => {
    if (hasExistingProfile && currentStep === 0) {
      setCurrentStep(2);
    }
  }, [hasExistingProfile, fetchData]);
  
  const next = async () => {
    if (isLastStepToReview) return;

    setValidationError(null);
    const isStepValid = await validateStep(currentStep);

    if (isStepValid) {
      setCurrentStep((prev) => Math.min(TOTAL_STEPS_TO_REVIEW - 1, prev + 1));
    } else {
      const stepErrors = getStepErrors(currentStep);
      const errorMessages = Object.values(stepErrors)
        .flat()
        .map((error: any) => error?.message)
        .filter(Boolean);

      if (errorMessages.length > 0) {
        setValidationError(`${errorMessages.join(", ")}`);
      } else {
        setValidationError(
          "Please complete all required fields before continuing."
        );
      }

      toast.error("Please complete all required fields before continuing.");
    }
  };

  const prev = () => {
    setValidationError(null);
    if (hasExistingProfile && currentStep === 2) return; 
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  const isLastStepToReview = currentStep === 4;
  const isServiceStep = currentStep === 5;
  const isFirstStep = hasExistingProfile ? currentStep === 2 : currentStep === 0;

  const [addOns, setAddOns] = useState({
    addBusinessTax: false,
    addIndividualTax: false,
    invoicing: false,
    billPay: false,
  });

  const businessProfile = (watch("businessProfile") ??
    {}) as Partial<BusinessProfile>;
  const businessAddressArr = (watch("businessAddress") ??
    []) as Partial<Address>[];
  const businessAddresses = (watch("businessAddress") ??
    []) as Partial<Address>[];
  const contacts = (watch("contact") ?? []) as Partial<Contact>[];
  const bookkeepingSettings = (watch("bookkeepingSettings") ??
    {}) as Partial<BookkeepingSettings>;
  const companyProfile = (watch("businessCompanyProfile") ??
    {}) as Partial<CompanyProfile>;
  const businessFinancialOverview = (watch("businessFinancialOverview") ??
    {}) as Partial<FinancialOverview>;

  const effectiveExpense = 
    businessFinancialOverview.avg_monthly_expenses ?? 
    ((fetchData as { financialOverview?: { avg_monthly_expenses?: string } })?.financialOverview?.avg_monthly_expenses) ?? 
    "0";

  const onBusinessInfoChange = (
    field: keyof BusinessProfile | keyof FinancialOverview,
    value: string | boolean | number,
    section: "businessProfile" | "businessFinancialOverview" | "bookkeepingSettings" | "companyProfile" 
  ) => {
    if (validationError) {
      setValidationError(null);
    }

    setValue(`businessProfile.${String(field)}` as FieldPath<T>, value);
    if (section === "businessFinancialOverview") {
      setValue(
        `businessFinancialOverview.${String(field)}` as FieldPath<T>,
        value
      );
    }
  };

  const onAddressChange = (
    index: number,
    field: keyof Address,
    value: string
  ) => {
    setValidationError(null);
    setValue(
      `businessAddress.${index}.${String(field)}` as FieldPath<T>,
      value
    );
  };
  const onAddAddress = () => addEmptyAddress();

  const onRemoveAddress = (index: number) => removeAddress(index);

const onContactChange = (index: number, path: string, value: string | boolean) => {
  const full = `contact.${index}.${path}` as FieldPath<T>;

  const normalized =
    (path === "isPrimary" || path === "isAuthorized")
      ? (typeof value === "boolean" ? value : value === "true")
      : value;

  setValue(full, normalized );
};

  const onAddContact = () => addEmptyContact();
  const onRemoveContact = (index: number) => removeContact(index);

  const onBookkeepingChange = (
    field:
      | keyof BookkeepingSettings
      | keyof CompanyProfile
      | keyof FinancialOverview,
    value: string | number | boolean,
    section:
      | "bookkeepingSettings"
      | "companyProfile"
      | "businessFinancialOverview"
  ) => {
    if (validationError) {
      setValidationError(null);
    }

    if (section === "bookkeepingSettings") {
      setValue(
        `bookkeepingSettings.${String(field)}` as FieldPath<T>,
        value as BookkeepingStatus
      );
    } else if (section === "companyProfile") {
      setValue(
        `businessCompanyProfile.${String(field)}` as FieldPath<T>,
        value
      );
    } else {
      setValue(
        `businessFinancialOverview.${String(field)}` as FieldPath<T>,
        value
      );
      
      if (field === "avg_monthly_expenses" && fetchData) {
        interface UpdatedFinancialOverview {
          avg_monthly_expenses: string;
        }
        
        setFetchData({
          ...fetchData,
          financialOverview: {
            ...((fetchData as { financialOverview?: UpdatedFinancialOverview }).financialOverview || {}),
            avg_monthly_expenses: value as string,
          },
        });
      }
    }
  };

  const qForQuote = useMemo(
    () => ({
      bookkeepingSettings: {
        status: bookkeepingSettings.status ?? BookkeepingStatus.UP_TO_DATE,
      },
      businessFinancialOverview: {
        avg_monthly_expenses:
          businessFinancialOverview.avg_monthly_expenses ?? "0",
      },
    }),
    [bookkeepingSettings.status, businessFinancialOverview.avg_monthly_expenses]
  );

  const quote = useMemo(
    () => calculateQuote(qForQuote, addOns),
    [qForQuote, addOns]
  );

  const catchUpRequired =
    bookkeepingSettings.status === BookkeepingStatus.CATCH_UP_REQUIRED;

  const handleSubmitAndGetQuote = async (): Promise<boolean> => {
    if (!hasExistingProfile) {
      const success = await onSubmit();
      return success;
    } else {
      return true;
    }
  };

  const handleSubscriptionSuccess = () => {
    setSubscriptionCreated(true);
    setCurrentStep(8);
  };

  return {
    currentStep,
    next,
    prev,
    isLastStepToReview,
    isServiceStep,
    isFirstStep,
    isSubmitted,
    onSubmit,
    handleSubmitAndGetQuote,
    handleSubscriptionSuccess,
    loading,
    submitError,
    validationError,
    businessProfile,
    businessAddresses,
    contacts,
    bookkeepingSettings,
    companyProfile,
    businessFinancialOverview: {
      ...businessFinancialOverview,
      avg_monthly_expenses: effectiveExpense,
    },
    onBusinessInfoChange,
    onAddressChange,
    onAddAddress,
    onRemoveAddress,
    onAddContact,
    onRemoveContact,
    onContactChange,
    onBookkeepingChange,
    addOns,
    setAddOns,
    quote,
    catchUpRequired,
    TOTAL_STEPS_TO_REVIEW,
    getFieldError, 
    register,
    errors,
    watch,
    setValue,
    hasExistingProfile,
    fetchData,
    subscriptionCreated,
  };
}