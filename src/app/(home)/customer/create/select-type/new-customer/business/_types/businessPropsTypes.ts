import { CreateCustomerInputSchemaType, CreateIndividualCustomerInputSchemaType } from "@/src/app/(home)/customer/_schema/customerSchema";
import { CreateCustomerAddressInput, CreateCustomerContactInput, Customer } from "@/src/types/customer";
import { CreateVendorAddressInput, CreateVendorContactInput } from "@/src/types/vendorsTypes";
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";

export type FormData = CreateCustomerInputSchemaType;
export type FormDataIndividualVendor = CreateIndividualCustomerInputSchemaType;

export interface AddressesProps {
  addresses?: CreateCustomerAddressInput[];
  onAddAddress: () => void;
  onRemoveAddress: (index: number) => void;
  onUpdateAddress: (
    index: number,
    field: keyof CreateCustomerAddressInput,
    value: string | boolean | number
  ) => void;
  setValue: UseFormSetValue<CreateCustomerInputSchemaType>;
  errors: FieldErrors<CreateCustomerInputSchemaType>;
}

export interface BasicInfoProps {
  formData: Customer;
  onUpdateFormData: (updates: Partial<CreateCustomerInputSchemaType>) => void;
  register: UseFormRegister<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  errors?: FieldErrors<FormData>;
}

export interface FormStepsProps {
  register: UseFormRegister<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  contactsIndex?: number;
  errors: FieldErrors<FormData>;
}

export interface ContactsProps {
  contacts?: CreateCustomerContactInput[];
  onAddContact: () => void;
  onRemoveContact: (index: number) => void;
  onUpdateContact: (
    index: number,
    field: keyof CreateCustomerContactInput,
    value: string | boolean
  ) => void;
  errors?: FieldErrors<FormData>;
}

export interface VendorBusinessFormProps {
  formData: Customer;
  onUpdateFormData: (updates: Partial<CreateCustomerInputSchemaType>) => void;

  onAddContact: () => void;
  onRemoveContact: (index: number) => void;
  onUpdateContact: (
    index: number,
    field: keyof CreateCustomerContactInput,
    value: string | boolean
  ) => void;

  onAddAddress: () => void;
  onRemoveAddress: (index: number) => void;
  onUpdateAddress: (
    index: number,
    field: keyof CreateCustomerAddressInput,
    value: string | boolean | number
  ) => void;

  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitting?: boolean;
  submitError?: string | null;
  
  errors: FieldErrors<FormData>;
  setValue: UseFormSetValue<FormData>;
  register: UseFormRegister<FormData>;
  watch: UseFormWatch<FormData>;
}

export interface CustomerBusinessFormProps {
  formData: Customer;
  onUpdateFormData: (updates: Partial<CreateCustomerInputSchemaType>) => void;

  onAddContact: () => void;
  onRemoveContact: (index: number) => void;
  onUpdateContact: (
    index: number,
    field: keyof CreateCustomerContactInput,
    value: string | boolean
  ) => void;

  onAddAddress: () => void;
  onRemoveAddress: (index: number) => void;
  onUpdateAddress: (
    index: number,
    field: keyof CreateCustomerAddressInput,
    value: string | boolean | number
  ) => void;

  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitting?: boolean;
  submitError?: string | null;
  
  errors: FieldErrors<FormData>;
  setValue: UseFormSetValue<FormData>;
  register: UseFormRegister<FormData>;
  watch: UseFormWatch<FormData>;
}