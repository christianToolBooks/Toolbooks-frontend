import { FieldPath, UseFormSetValue } from "react-hook-form";
import { AddressDetails, useAddressAutocomplete } from "@/src/hooks/useAddressAutoComplete";
import { CreateGetStartedOnboardingInput } from "../schemas/schemas";

type FormData = CreateGetStartedOnboardingInput;

interface UseAddressFormLogicProps {
  setValue: UseFormSetValue<FormData>;
  onError: (error: string) => void;
  addressIndex: number; 
}

export const useAddressFormLogicToQuestionnaire = ({
  setValue,
  onError,
  addressIndex,
}: UseAddressFormLogicProps) => {
  const onAddressSelect = (addr: AddressDetails) => {
    const base = `businessAddress.${addressIndex}` as const;

    setValue(`${base}.line1` as FieldPath<FormData>, addr.address, { shouldValidate: true });
    setValue(`${base}.city` as FieldPath<FormData>, addr.city, { shouldValidate: true });
    setValue(`${base}.state` as FieldPath<FormData>, addr.stateAbbreviation, { shouldValidate: true });
    setValue(`${base}.zip_code` as FieldPath<FormData>, addr.zipCode, { shouldValidate: true });
    setValue(`${base}.country` as FieldPath<FormData>, addr.country ?? "US", { shouldValidate: true });
    setValue(`${base}.latitude` as FieldPath<FormData>, addr.latitude ?? undefined, { shouldValidate: true });
    setValue(`${base}.longitude` as FieldPath<FormData>, addr.longitude ?? undefined, { shouldValidate: true });
  };

  const { inputRef, isLoaded, loading, error } = useAddressAutocomplete({
    onAddressSelect,
    onError,
  });

  return { inputRef, isLoaded, loading, error };
};
