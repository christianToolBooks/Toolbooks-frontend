import { useAddressAutocomplete, AddressDetails } from "@/src/hooks/useAddressAutoComplete";

interface UseAddressFormLogicToVendorEditProps {
  onAddressSelect: (addressDetails: AddressDetails) => void;
  addressIndex: number;
}

export const useAddressFormLogicToVendorEdit = ({
  onAddressSelect,
  addressIndex,
}: UseAddressFormLogicToVendorEditProps) => {
  const { inputRef, isLoaded, loading, error } = useAddressAutocomplete({
    onAddressSelect,
    onError: (error) => {
      console.error(`Address autocomplete error for index ${addressIndex}:`, error);
    },
  });

  return { inputRef, isLoaded, loading, error };
};
