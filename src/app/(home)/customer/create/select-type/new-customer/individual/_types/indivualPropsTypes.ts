import { CreateIndividualCustomerInputSchemaType } from "@/src/app/(home)/customer/_schema/customerSchema";
import { CreateCustomerAddressInput, Customer } from "@/src/types/customer";
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";

export type FormDataIndividualCustomer = CreateIndividualCustomerInputSchemaType;

export interface CustomerIndividualFormProps {
  formData: Customer;
  onUpdateFormData: (updates: Partial<CreateIndividualCustomerInputSchemaType>) => void;
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
  
  errors: FieldErrors<FormDataIndividualCustomer>;
  setValue: UseFormSetValue<FormDataIndividualCustomer>;
  register: UseFormRegister<FormDataIndividualCustomer>;
  watch: UseFormWatch<FormDataIndividualCustomer>;
}

export interface FormStepsIndividualProps {
  register: UseFormRegister<FormDataIndividualCustomer>;
  watch: UseFormWatch<FormDataIndividualCustomer>;
  setValue: UseFormSetValue<FormDataIndividualCustomer>;
  contactsIndex?: number;
  errors: FieldErrors<FormDataIndividualCustomer>;
}

export interface BasicInfoIndividualProps {
  formData: Customer;
  onUpdateFormData: (updates: Partial<CreateIndividualCustomerInputSchemaType>) => void;
  register: UseFormRegister<FormDataIndividualCustomer>;
  watch: UseFormWatch<FormDataIndividualCustomer>;
  setValue: UseFormSetValue<FormDataIndividualCustomer>;
  errors?: FieldErrors<FormDataIndividualCustomer>;
}

export interface AddressesIndividualCustomerProps {
  addresses?: CreateCustomerAddressInput[];
  onAddAddress: () => void;
  onRemoveAddress: (index: number) => void;
  onUpdateAddress: (
    index: number,
    field: keyof CreateCustomerAddressInput,
    value: string | boolean | number
  ) => void;
  setValue: UseFormSetValue<FormDataIndividualCustomer>;
  errors: FieldErrors<FormDataIndividualCustomer>;
}