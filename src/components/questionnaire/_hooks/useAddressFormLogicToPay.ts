import { FieldPath, UseFormSetValue } from "react-hook-form";
import { AddressDetails, useAddressAutocomplete } from "@/src/hooks/useAddressAutoComplete";
import { CustomerFormToPaymentInput } from "../schemas/schemas";

type FormData = CustomerFormToPaymentInput;

interface UseAddressFormLogicProps {
  setValue: UseFormSetValue<FormData>;
  onError: (error: string) => void;
}

export const useAddressFormLogicToPay = ({
  setValue,
  onError,
}: UseAddressFormLogicProps) => {
  const onAddressSelect = (addr: AddressDetails) => {

    setValue(`address_line_1` as FieldPath<FormData>, addr.address, { shouldValidate: true });
    setValue(`city` as FieldPath<FormData>, addr.city, { shouldValidate: true });
    setValue(`state` as FieldPath<FormData>, addr.stateAbbreviation, { shouldValidate: true });
    setValue(`zip_code` as FieldPath<FormData>, addr.zipCode, { shouldValidate: true });
    setValue(`country` as FieldPath<FormData>, addr.country ?? "US", { shouldValidate: true });
    setValue(`latitude` as FieldPath<FormData>, addr.latitude ?? undefined, { shouldValidate: true });
    setValue(`longitude` as FieldPath<FormData>, addr.longitude ?? undefined, { shouldValidate: true });
  };

  const { inputRef, isLoaded, loading, error } = useAddressAutocomplete({
    onAddressSelect,
    onError,
  });

  return { inputRef, isLoaded, loading, error };
};
