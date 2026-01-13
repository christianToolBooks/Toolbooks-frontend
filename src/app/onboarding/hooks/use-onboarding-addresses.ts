// app/onboarding/hooks/use-onboarding-addresses.ts
"use client";

import type { OnboardingAddress } from "@/src/types/questionnaire";

type Getter<T> = () => T;
type Setter<T> = (next: T) => void;

type UseOnboardingAddressesParams = {
  getAddresses: Getter<OnboardingAddress[]>;
  setAddresses: Setter<OnboardingAddress[]>;
};

type UseOnboardingAddressesReturn = {
  updateAddressAt: (index: number, patch: Partial<OnboardingAddress>) => void;
  addAddress: () => void;
  removeAddress: (index: number) => void;
};

export function useOnboardingAddresses(
  params: UseOnboardingAddressesParams
): UseOnboardingAddressesReturn {
  const updateAddressAt = (index: number, patch: Partial<OnboardingAddress>): void => {
    const current = params.getAddresses();
    const next = current.map((a, i) => (i === index ? { ...a, ...patch } : a));
    params.setAddresses(next);
  };

  const addAddress = (): void => {
    const current = params.getAddresses();
    const next = [
      ...current,
      { line1: "", line2: "", city: "", state: "", country: "US", zip_code: "" },
    ];
    params.setAddresses(next);
  };

  const removeAddress = (index: number): void => {
    if (index === 0) return; // no borrar principal
    const current = params.getAddresses();
    const next = current.slice(0, index).concat(current.slice(index + 1));
    params.setAddresses(next);
  };

  return { updateAddressAt, addAddress, removeAddress };
}
