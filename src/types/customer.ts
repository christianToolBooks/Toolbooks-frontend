import { PaymentTerms, VendorAddressType } from "./vendorsTypes";

export interface CreateCustomerAddressInput {
  id?: string;
  customer_id?: string;
  type: VendorAddressType;
  line1?: string;
  line2?: string | null;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerAddress {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  customer_id?: string;
  type: VendorAddressType;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface CreateCustomerContactInput {
  id?: string;
  customerId?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  jobTitle?: string;
  isPrimary?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PutCustomerAsInactiveOrActive {
  isActive: boolean;
}
export interface Customer {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  type: string;
  legalName?: string;
  paymentTerms: PaymentTerms;
  defaultCurrency: string;
  notes?: string;
  taxId?: string;
  isActive?: boolean;
  contacts?: CreateCustomerContactInput[];
  addresses?: CreateCustomerAddressInput[];
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  business_profile_id?: string;
}

export interface CreateCustomerData {
  name?: string | undefined;
  email: string;
  phoneNumber: string;
}

export interface CreateCustomerForm {
  name?: string | undefined;
  email: string;
  phone: string;
}

export interface UpdateCustomerForm {
  name: string;
  legalName: string;
  taxId: string;
  paymentTerms: PaymentTerms;
  defaultCurrency: string;
  email: string;
  phone: string;
  notes: string;
  isActive: boolean;
};

export type UpdateCustomerResponse = Customer;
