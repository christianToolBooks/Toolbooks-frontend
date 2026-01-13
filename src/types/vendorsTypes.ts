// Tipos alineados con el back
export type PaymentTerms = "net_0" | "net_15" | "net_30" | "custom";
export type VendorAddressType = "billed_from" | "shipped_from" | "remit_to";

/* --------------------- payload interfaces (front) --------------------- */

export interface CreateVendorContactInput {
  id?: string;
  vendorId?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  jobTitle?: string;
  isPrimary?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVendorAddressInput {
  id?: string;
  vendorId?: string;
  type: VendorAddressType;
  line1?: string;
  line2?: string;
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

export interface CreateVendorInput {
  id?: string;
  businessProfileId?: string;
  name: string;
  type: string;
  legalName?: string;
  paymentTerms: PaymentTerms;
  defaultCurrency: string;
  email?: string;
  phone?: string;
  notes?: string;
  isActive?: boolean;
  contacts?: CreateVendorContactInput[];
  addresses?: CreateVendorAddressInput[];
  createdAt?: string;
  updatedAt?: string;
}


/* ---------------------  UI states by Form --------------------- */

export interface VendorFormState extends Omit<CreateVendorInput, "contacts" | "addresses"> {
  contacts: CreateVendorContactInput[];
  addresses: CreateVendorAddressInput[];
}

export type VendorRecord = CreateVendorInput & { id: string } & CreateVendorAddressInput & { id: string };