export interface Branding {
  id: string;
  branding_name: string;
  logo_url: string;
  email: string;
  phone: string;
  second_phone?: string | null;
  address: string;
  second_address?: string;
  city: string;
  state: string;
  zip_code: string;
  website: string;
  open_date: string; // ISO
  business_profileId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
