
export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  username: string;
  lastName: string;
  email: string;
  position: string | null;
  phone: string | null;
  workPhone: string | null;
  otherPhone: string | null;
  plaidAccessToken: string | null;
  preferredContactMethod: string | null;
  businessProfiles: BusinessProfile;
}

export interface BusinessProfile {
  id: string;
  createdAt: string;
  updatedAt: string;
  business_name: string;
  dba: string;
  logo_url: string;
  phone_number: string;
  email: string;
  website: string;
  userId: string;
  onboarding_complete: boolean;
  get_started_complete: boolean;
  hasInvoices: boolean;
  hasBills: boolean;
  hasPayroll: boolean;
  hasTaxReturnPreparation: boolean;
  payarc_connect_enabled: boolean;
  payarc_merchant_code: string | null;
  payarc_merchant_id: string | null;
  payarc_onboarding_status: string;
  payarc_agreement_sent_at: string | null;
  payarc_onboarded_at: string | null;
  payarc_last_webhook: string | null;
  default_statement_description: string | null;
}