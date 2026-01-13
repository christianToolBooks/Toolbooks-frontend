"use client";

import { BusinessCard } from "./BusinessCard";
import { PrimaryContactCard } from "./PrimaryContactCard";
import { EmergencyContactCard } from "./EmergencyContactCard";

import type {
  Contact,
  OnboardingBusinessProfile,
  OnboardingEmergencyContact,
  ContactPhones,
  ContactEmails,
  OnboardingAddress,
} from "@/src/types/questionnaire";
import { AuthorizedContactsCard } from "./AdditionalContactCard";
import { BusinessAddressesCard } from "./BusinessAddressesCard";

type Props = {
  businessInfo: OnboardingBusinessProfile;
  primaryContact: Contact;
  businessContacts: Contact[]; 
  businessAddresses: OnboardingAddress[];
  emergencyContact?: OnboardingEmergencyContact;
  onBusinessInfoChange: (data: Partial<OnboardingBusinessProfile>) => void;
  onPrimaryContactChange: (data: Partial<Contact>) => void;
  onContactChange: (index: number, data: Partial<Contact>) => void; 
  onAddContact: () => void; 
  onAddressChange: (index: number, data: Partial<OnboardingAddress>) => void;
  onAddAddress: () => void; 
  onRemoveAddress: (index: number) => void;
  onRemoveContact: (index: number) => void; 
  onEmergencyContactChange: (data: Partial<OnboardingEmergencyContact>) => void;
  getFieldError: (field: string) => string | undefined;
  disabled?: boolean;
};

export function BusinessInfoStep({
  businessInfo,
  primaryContact,
  businessContacts = [],
  businessAddresses = [],
  emergencyContact,
  onBusinessInfoChange,
  onPrimaryContactChange,
  onContactChange,
  onAddContact,
  onAddressChange,
  onAddAddress,
  onRemoveAddress,
  onRemoveContact,
  onEmergencyContactChange,
  getFieldError,
  disabled = false,
}: Props) {
  const safePrimaryPhones: ContactPhones = {
    contact_id: primaryContact.phones?.contact_id,
    main: primaryContact.phones?.main ?? "",
    mobile: primaryContact.phones?.mobile ?? "",
    work: primaryContact.phones?.work ?? "",
    fax: primaryContact.phones?.fax ?? "",
  };

  const safePrimaryEmails: ContactEmails = {
    contact_id: primaryContact.emails?.contact_id,
    work: primaryContact.emails?.work ?? "",
    personal: primaryContact.emails?.personal ?? "",
    other: primaryContact.emails?.other ?? "",
  };

  return (
    <div className="space-y-8">
      <BusinessCard
        businessInfo={businessInfo}
        onBusinessInfoChange={onBusinessInfoChange}
        getFieldError={getFieldError}
        disabled={disabled}
      />

      <BusinessAddressesCard
        addresses={businessAddresses}
        onAddressChange={onAddressChange}
        onAddAddress={onAddAddress}
        onRemoveAddress={onRemoveAddress}
        getFieldError={getFieldError}
        disabled={disabled}
      />

      <PrimaryContactCard
        primaryContact={primaryContact}
        safePhones={safePrimaryPhones}
        safeEmails={safePrimaryEmails}
        onPrimaryContactChange={onPrimaryContactChange}
        getFieldError={getFieldError}
        disabled={disabled}
      />

      <AuthorizedContactsCard
        businessContacts={businessContacts}
        onContactChange={onContactChange}
        onAddContact={onAddContact}
        onRemoveContact={onRemoveContact}
        disabled={disabled}
      />

      <EmergencyContactCard
        emergencyContact={emergencyContact}
        onEmergencyContactChange={onEmergencyContactChange}
        disabled={disabled}
      />
    </div>
  );
}
