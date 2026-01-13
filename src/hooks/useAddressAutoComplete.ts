/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, useCallback } from "react";
import { FieldValues, UseFormSetValue } from "react-hook-form";
import { useGoogleMaps } from "../components/loaderGoogle";
import { debounce } from "./useDebounce";

const isValidPlace = (place: google.maps.places.PlaceResult): boolean => {
  return !!(
    place &&
    place.formatted_address &&
    place.geometry?.location &&
    place.address_components
  );
};

export interface AddressDetails {
  address: string;
  latitude: number;
  longitude: number;
  zipCode: string;
  city: string;
  state: string;
  stateAbbreviation: string;
  country?: string;
}

interface UseAddressAutocompleteOptions<T extends FieldValues = any> {
  setValue?: UseFormSetValue<T>;
  fieldName?: keyof T | string;
  index?: number;
  onAddressSelect?: (address: AddressDetails) => void;
  countryRestriction?: string;
  types?: string[];
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    timeOut: NodeJS.Timeout | null;
  }
}

export const useAddressAutocomplete = <T extends FieldValues = any>({
  setValue,
  fieldName,
  index,
  onAddressSelect,
  countryRestriction = "us",
  types = ["address"],
  onError,
}: UseAddressAutocompleteOptions<T> = {}) => {
  const { isLoaded } = useGoogleMaps();
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<AddressDetails | null>(
    null
  );
  const [isAutocompleteInitialized, setIsAutocompleteInitialized] = useState(false);

  const extractAddressComponents = useCallback(
    (place: google.maps.places.PlaceResult): AddressDetails => {
      const addressComponents = place.address_components || [];

      const getComponent = (type: string) =>
        addressComponents.find((c) => c.types.includes(type))?.long_name || "";

      const getShortComponent = (type: string) =>
        addressComponents.find((c) => c.types.includes(type))?.short_name || "";

      // Extract street number and street name only
      const streetNumber = getComponent("street_number");
      const streetName = getComponent("route");
      const streetAddress = [streetNumber, streetName].filter(Boolean).join(" ");

      // Get zip code with extension if available
      const zipCode = getComponent("postal_code");
      const zipExtension = getComponent("postal_code_suffix");
      const fullZip = zipExtension ? `${zipCode}-${zipExtension}` : zipCode;

      return {
        address: streetAddress || (place.formatted_address as string),
        latitude: place.geometry!.location!.lat(),
        longitude: place.geometry!.location!.lng(),
        zipCode: fullZip,
        city:
          getComponent("locality") ||
          getComponent("sublocality") ||
          getComponent("administrative_area_level_2") ||
          getComponent("neighborhood"),
        state: getComponent("administrative_area_level_1"),
        stateAbbreviation: getShortComponent("administrative_area_level_1"),
      };
    },
    []
  );

  const toKeyString = (key: keyof T | string): string => {
    return typeof key === "symbol" ? key.toString() : String(key);
  };

  const handlePlaceSelect = useCallback(() => {
    if (!autocompleteRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const place = autocompleteRef.current.getPlace();

      if (!isValidPlace(place)) {
        const errorMsg = "Please select a valid address from suggestions";
        setError(errorMsg);
        onError?.(errorMsg);
        return;
      }

      const addressDetails = extractAddressComponents(place);
      setSelectedAddress(addressDetails);

      if (setValue && fieldName) {
        const key = toKeyString(fieldName);
        if (typeof index === "number") {
          setValue(`${key}.${index}` as any, addressDetails as any);
        } else {
          setValue(key as any, addressDetails as any);
        }
      }

      onAddressSelect?.(addressDetails);
    } catch (err) {
      const errorMsg = "Error processing selected address";
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [
    setValue,
    fieldName,
    index,
    onAddressSelect,
    onError,
    extractAddressComponents,
  ]);

  useEffect(() => {
   if (!isLoaded || isAutocompleteInitialized || !inputRef.current) {
      return;
    }
    
    if (autocompleteRef.current) return;

    try {
      if ("timeOut" in window && window.timeOut) {
        clearTimeout(window.timeOut);
      }

      window.timeOut = setTimeout(() => {
        if (autocompleteRef.current) return;

        autocompleteRef.current = new google.maps.places.Autocomplete(
          inputRef.current!,
          {
            types,
            componentRestrictions: { country: countryRestriction },
            fields: [
              "address_components",
              "formatted_address",
              "geometry",
              "place_id",
            ],
          }
        );

        const debouncedHandler = debounce(handlePlaceSelect, 200);
        const listener = autocompleteRef.current.addListener(
          "place_changed",
          debouncedHandler
        );

        return () => {
          if (listener && "remove" in listener && typeof listener.remove === "function") {
            listener.remove();
          }
        };
      }, 850);

      return () => {
        if ("timeOut" in window && window.timeOut) {
          clearTimeout(window.timeOut);
          window.timeOut = null;
        }
      };
    } catch (err) {
      setError("Error loading address autocomplete");
    }
  }, [isLoaded, types, countryRestriction]); 

  useEffect(() => {
    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
      if ("timeOut" in window && window.timeOut) {
        clearTimeout(window.timeOut);
        window.timeOut = null;
      }
    };
  }, []);

  const clearAddress = useCallback(() => {
    setSelectedAddress(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, []);

  const setAddress = useCallback((address: string) => {
    if (inputRef.current) {
      inputRef.current.value = address;
    }
  }, []);

  return {
    inputRef,
    isLoaded,
    loading,
    error,
    selectedAddress,
    clearAddress,
    setAddress,
    handlePlaceSelect,
  };
};