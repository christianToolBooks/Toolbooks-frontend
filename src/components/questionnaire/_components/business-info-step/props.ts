import { Address, BusinessProfile, Contact } from "@/src/types/questionnaire";
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { CreateGetStartedOnboardingInput as T } from "@/src/components/questionnaire/schemas/schemas";
import { ContactChangeHandler } from "../../_hooks/usePreferredContact";

export interface BusinessInfoStepProps {
  data: {
    businessProfile: Partial<BusinessProfile>;
    businessAddress: Partial<Address>[];
    contacts: Partial<Contact>[];
  };
  onBusinessProfileChange: (
    field: keyof BusinessProfile,
    value: string,
    section: "businessProfile" | "businessFinancialOverview"
  ) => void;
  onAddressChange: (index: number, field: keyof Address, value: string) => void;
  onContactChange: (
    index: number,
    path: string,
    value: string | boolean
  ) => void;
  onAddAddress: () => void;
  onRemoveAddress: (index: number) => void;
  getFieldError: (fieldPath: string) => string | null;
  setValue: UseFormSetValue<T>;
  register: UseFormRegister<T>;
  watch: UseFormWatch<T>;
  errors?: FieldErrors<T>;
  index: number;
}
export interface GeneralInformationPageProps {
  data: {
    businessProfile: Partial<BusinessProfile>;
    businessAddress: Partial<Address>[];
    contacts: Partial<Contact>[];
  };
  onBusinessProfileChange: (
    field: keyof BusinessProfile,
    value: string,
    section: "businessProfile" | "businessFinancialOverview"
  ) => void;
  getFieldError: (fieldPath: string) => string | null;
}

export interface ContactBaseProps {
  contact: Partial<Contact>;
  index: number;
  getFieldError: (path: string) => string | null;
  onContactChange: ContactChangeHandler;
}

export interface PhoneFormProps {
  register: UseFormRegister<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
}

export interface PrimaryContactProps {
  data: {
    businessProfile: Partial<BusinessProfile>;
    businessAddress: Partial<Address>[];
    contacts: Partial<Contact>[];
  };
  getFieldError: (fieldPath: string) => string | null;
  onContactChange: ContactChangeHandler;
  register: UseFormRegister<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
}