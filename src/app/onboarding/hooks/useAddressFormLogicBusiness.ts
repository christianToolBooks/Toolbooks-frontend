/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { AddressDetails, useAddressAutocomplete } from "@/src/hooks/useAddressAutoComplete";
import z from "zod";
import { FieldPath } from "react-hook-form";
import { OnboardingSchema } from "../schemas/onboarding-schema";

type FormData = z.infer<typeof OnboardingSchema>;

interface UseAddressFormLogicProps {
  setValue: <TFieldName extends FieldPath<FormData>>(field: TFieldName, value: any, options?: any) => void;
  onError: (error: string) => void;
}

export const useAddressFormLogicBusiness = ({ setValue, onError }: UseAddressFormLogicProps) => {
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zip_code: "",
  });

  const handleAddressDataReceived = useCallback((address: AddressDetails) => {
    setValue("business.businessProfile.business_address", address.address, { shouldValidate: true });
    setValue("business.businessProfile.city", address.city, { shouldValidate: true });
    setValue("business.businessProfile.state", address.state, { shouldValidate: true });
    setValue("business.businessProfile.zip_code", address.zipCode, { shouldValidate: true });
    setValue("business.businessProfile.latitude", address.latitude, { shouldValidate: true });
    setValue("business.businessProfile.longitude", address.longitude, { shouldValidate: true });

    setFormData({
      street: address.address,
      city: address.city,
      state: address.state,
      zip_code: address.zipCode,
    });
  }, [setValue]);

  const {
    inputRef,
    isLoaded,
    loading,
    error,
    selectedAddress, 
    clearAddress, 
    setAddress, 
  } = useAddressAutocomplete({
    onAddressSelect: handleAddressDataReceived, 
    onError: onError,
  });

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      if (field === "street" || field === "businessProfile.business_address") {
        setFormData((prev) => ({
          ...prev,
          street: value,
        }));
        // Para el campo de dirección, también actualiza el formulario
        if (field === "businessProfile.business_address") {
          setValue("business.businessProfile.business_address", value, { shouldValidate: true });
        }
      } else {
        const fieldMap: Record<string, string> = {
          city: "business.businessProfile.city",
          state: "business.businessProfile.state",
          zip_code: "business.businessProfile.zip_code",
          latitude: "business.businessProfile.latitude",
          longitude: "business.businessProfile.longitude",
        };

        const formField = fieldMap[field];
        if (formField) {
          setValue(formField as any, value, { shouldValidate: true });
        }

        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }));
      }
    },
    [setValue] 
  );

  return {
    formData,
    inputRef, 
    isLoaded,
    loading,
    error,
    selectedAddress, 
    handleInputChange, 
    clearAddress, 
    setAddress, 
  };
};