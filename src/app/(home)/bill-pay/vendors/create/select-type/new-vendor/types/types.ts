"use client";

import type { 
  CreateVendorContactInput, 
  CreateVendorInput 
} from "@/src/types/vendorsTypes";
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CreateIndividualVendorInputSchemaType, CreateVendorAddressInput, CreateVendorInputSchemaType } from "../../../../../_schemas/businessVendorSchema";

export type FormData = CreateVendorInputSchemaType;
export type FormDataIndividualVendor = CreateIndividualVendorInputSchemaType;

export interface VendorBusinessFormProps {
  formData: CreateVendorInput;
  onUpdateFormData: (updates: Partial<CreateVendorInputSchemaType>) => void;

  onAddContact: () => void;
  onRemoveContact: (index: number) => void;
  onUpdateContact: (
    index: number,
    field: keyof CreateVendorContactInput,
    value: string | boolean
  ) => void;

  onAddAddress: () => void;
  onRemoveAddress: (index: number) => void;
  onUpdateAddress: (
    index: number,
    field: keyof CreateVendorAddressInput,
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

export interface VendorIndividualFormProps {
  formData: CreateVendorInput;
  onUpdateFormData: (updates: Partial<CreateIndividualVendorInputSchemaType>) => void;
  onAddAddress: () => void;
  onRemoveAddress: (index: number) => void;
  onUpdateAddress: (
    index: number,
    field: keyof CreateVendorAddressInput,
    value: string | boolean | number
  ) => void;

  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitting?: boolean;
  submitError?: string | null;
  
  errors: FieldErrors<FormDataIndividualVendor>;
  setValue: UseFormSetValue<FormDataIndividualVendor>;
  register: UseFormRegister<FormDataIndividualVendor>;
  watch: UseFormWatch<FormDataIndividualVendor>;
}

export interface BasicInfoProps {
  formData: CreateVendorInput;
  onUpdateFormData: (updates: Partial<CreateVendorInputSchemaType>) => void;
  register: UseFormRegister<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  errors?: FieldErrors<FormData>;
}

export interface BasicInfoIndividualProps {
  formData: CreateVendorInput;
  onUpdateFormData: (updates: Partial<CreateIndividualVendorInputSchemaType>) => void;
  register: UseFormRegister<FormDataIndividualVendor>;
  watch: UseFormWatch<FormDataIndividualVendor>;
  setValue: UseFormSetValue<FormDataIndividualVendor>;
  errors?: FieldErrors<FormDataIndividualVendor>;
}

export interface ContactsProps {
  contacts?: CreateVendorContactInput[];
  onAddContact: () => void;
  onRemoveContact: (index: number) => void;
  onUpdateContact: (
    index: number,
    field: keyof CreateVendorContactInput,
    value: string | boolean
  ) => void;
  errors?: FieldErrors<FormData>;
}

export interface AddressesProps {
  addresses?: CreateVendorAddressInput[];
  onAddAddress: () => void;
  onRemoveAddress: (index: number) => void;
  onUpdateAddress: (
    index: number,
    field: keyof CreateVendorAddressInput,
    value: string | boolean | number
  ) => void;
  setValue: UseFormSetValue<CreateVendorInputSchemaType>;
  errors: FieldErrors<CreateVendorInputSchemaType>;
}

export interface AddressesIndividualVendorProps {
  addresses?: CreateVendorAddressInput[];
  onAddAddress: () => void;
  onRemoveAddress: (index: number) => void;
  onUpdateAddress: (
    index: number,
    field: keyof CreateVendorAddressInput,
    value: string | boolean | number
  ) => void;
  setValue: UseFormSetValue<FormDataIndividualVendor>;
  errors: FieldErrors<FormDataIndividualVendor>;
}

export interface NotesProps {
  notes?: string;
  onChange: (value: string) => void;
}

export interface SidebarProps {
  contactsCount: number;
  addressesCount: number;
  onCancel: () => void;
  submitting?: boolean;
  submitError?: string | null;
}

export interface FormStepsProps {
  register: UseFormRegister<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  contactsIndex?: number;
  errors: FieldErrors<FormData>;
}

export interface FormStepsIndividualProps {
  register: UseFormRegister<FormDataIndividualVendor>;
  watch: UseFormWatch<FormDataIndividualVendor>;
  setValue: UseFormSetValue<FormDataIndividualVendor>;
  contactsIndex?: number;
  errors: FieldErrors<FormDataIndividualVendor>;
}