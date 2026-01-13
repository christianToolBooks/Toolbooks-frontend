// app/onboarding/hooks/use-onboarding-contacts.ts
"use client";

import type { Contact } from "@/src/types/questionnaire";

type Getter<T> = () => T;
type Setter<T> = (next: T) => void;

type UseOnboardingContactsParams = {
  getContacts: Getter<Contact[]>;
  setContacts: Setter<Contact[]>;
};

type UseOnboardingContactsReturn = {
  updateBusinessContactAt: (index: number, patch: Partial<Contact>) => void;
  addAuthorizedContact: () => void;
  removeBusinessContact: (index: number) => void;
};

export function useOnboardingContacts(
  params: UseOnboardingContactsParams
): UseOnboardingContactsReturn {
  const updateBusinessContactAt = (index: number, patch: Partial<Contact>): void => {
    const current = params.getContacts();
    const base: Contact =
      current[index] ??
      ({
        first_name: "",
        last_name: "",
        title: "",
        isPrimary: index === 0,
        isAuthorized: true,
        phones: { main: "", mobile: "", work: "", fax: "" },
        emails: { work: "", personal: "", other: "" },
        preferred_contact_method:  "" as Contact["preferred_contact_method"],
        preferred_email_kind: undefined,
        preferred_phone_kind: undefined,
      } as Contact);

    const merged: Contact = {
      ...base,
      ...patch,
      phones: { ...(base.phones ?? {}), ...(patch.phones ?? {}) },
      emails: { ...(base.emails ?? {}), ...(patch.emails ?? {}) },
    };

    const next = [...current];
    next[index] = merged;

    if (patch.isPrimary === true) {
      for (let i = 0; i < next.length; i += 1) {
        if (i !== index) next[i].isPrimary = false;
      }
    }
    params.setContacts(next);
  };

  const addAuthorizedContact = (): void => {
    const current = params.getContacts();
    const next = [
      ...current,
      {
        first_name: "",
        last_name: "",
        title: "",
        isPrimary: false,
        isAuthorized: true,
        phones: { main: "", mobile: "", work: "", fax: "" },
        emails: { work: "", personal: "", other: "" },
      } as Contact,
    ];
    params.setContacts(next);
  };

  const removeBusinessContact = (index: number): void => {
    if (index === 0) return; 
    const current = params.getContacts();
    const next = current.slice(0, index).concat(current.slice(index + 1));
    params.setContacts(next);
  };

  return { updateBusinessContactAt, addAuthorizedContact, removeBusinessContact };
}
