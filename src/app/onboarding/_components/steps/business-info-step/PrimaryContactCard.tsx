"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { FormInput } from "../../form-input";
import { FormSelect } from "../../form-select";
import {
  Contact,
  ContactMethod,
  ContactEmails,
  ContactPhones,
  EmailKind,
  PhoneKind,
} from "@/src/types/questionnaire";
import {
  CONTACT_METHODS,
  EMAIL_KINDS,
  PHONE_KINDS,
} from "../../../_utils/onboarding-config";
import { Phone } from "lucide-react";
import { PhoneUSField } from "../../inputPhoneToOnboarding";

type Props = {
  primaryContact: Contact;
  safePhones: ContactPhones;
  safeEmails: ContactEmails;
  onPrimaryContactChange: (data: Partial<Contact>) => void;
  getFieldError: (field: string) => string | undefined;
  /** Deshabilita inputs mientras se hidrata (opcional) */
  disabled?: boolean;
};

export function PrimaryContactCard({
  primaryContact,
  safePhones,
  safeEmails,
  onPrimaryContactChange,
  getFieldError,
  disabled = false,
}: Props) {
  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          Primary User & Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput
              label="First Name"
              name="businessContacts.0.first_name"
              value={primaryContact.first_name ?? ""}
              onChange={(value) =>
                onPrimaryContactChange({ first_name: value })
              }
              required
              error={getFieldError("businessContacts.0.first_name")}
              disabled={disabled}
              autofilled={!!primaryContact.first_name}
            />
            <FormInput
              label="Last Name"
              name="businessContacts.0.last_name"
              value={primaryContact.last_name ?? ""}
              onChange={(value) => onPrimaryContactChange({ last_name: value })}
              required
              error={getFieldError("businessContacts.0.last_name")}
              disabled={disabled}
              autofilled={!!primaryContact.last_name}
            />
            <FormInput
              label="Position/Title"
              name="businessContacts.0.title"
              value={primaryContact.title ?? ""}
              onChange={(value) => onPrimaryContactChange({ title: value })}
              disabled={disabled}
              autofilled={!!primaryContact.title}
            />
          </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Work Email"
                    name="businessContacts.0.emails.work"
                    type="email"
                    value={safeEmails.work ?? ""}
                    onChange={(value) =>
                      onPrimaryContactChange({
                        emails: { ...safeEmails, work: value },
                      })
                    }
                    required
                    error={getFieldError("businessContacts.0.emails.work")}
                    disabled={disabled}
                    autofilled={!!safeEmails.work}
                  />
                  <FormInput
                    label="Other Email"
                    name="businessContacts.0.emails.other"
                    type="email"
                    value={safeEmails.other ?? ""}
                    onChange={(value) =>
                      onPrimaryContactChange({
                        emails: { ...safeEmails, other: value },
                      })
                    }
                    error={getFieldError("businessContacts.0.emails.other")}
                    disabled={disabled}
                    autofilled={!!safeEmails.other}
                  />
                </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PhoneUSField
              label="Main Phone"
              valueE164={safePhones.main ?? ""}
              onChangeE164={(e164) =>
                onPrimaryContactChange({
                  phones: { ...safePhones, main: e164 },
                })
              }
              errorMsg={getFieldError("businessContacts.0.phones.main")}
              disabled={disabled}
              autoFilled={!!safePhones.main}
            />
            <PhoneUSField
              label="Mobile Phone"
              valueE164={safePhones.mobile ?? ""}
              onChangeE164={(e164) =>
                onPrimaryContactChange({
                  phones: { ...safePhones, mobile: e164 },
                })
              }
              required
              disabled={disabled}
              errorMsg={getFieldError("businessContacts.0.phones.mobile")}
              autoFilled={!!safePhones.mobile}
            />
            <PhoneUSField
              label="Work Phone"
              valueE164={safePhones.work ?? ""}
              onChangeE164={(e164) =>
                onPrimaryContactChange({
                  phones: { ...safePhones, work: e164 },
                })
              }
              errorMsg={getFieldError("businessContacts.0.phones.work")}
              disabled={disabled}
              autoFilled={!!safePhones.work}
            />
            <PhoneUSField
              label="Fax Number"
              valueE164={safePhones.fax ?? ""}
              onChangeE164={(e164) =>
                onPrimaryContactChange({ phones: { ...safePhones, fax: e164 } })
              }
              errorMsg={getFieldError("businessContacts.0.phones.fax")}
              disabled={disabled}
              autoFilled={!!safePhones.fax}
            />
          </div>

          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect
              label="Preferred Contact Method"
              placeholder="Select contact method"
              name="businessContacts.0.preferred_contact_method"
              value={primaryContact.preferred_contact_method ?? ""}
              onChange={(value) =>
                onPrimaryContactChange({
                  preferred_contact_method: value as ContactMethod,
                })
              }
              options={CONTACT_METHODS}
              disabled={disabled}
              autoFilled={!!primaryContact.preferred_contact_method}
            />

            {primaryContact.preferred_contact_method ===
              ContactMethod.EMAIL && (
              <div>
                <FormSelect
                  label="Preferred Email"
                  placeholder="Select email type"
                  name="businessContacts.0.preferred_email_kind"
                  value={primaryContact.preferred_email_kind ?? ""}
                  onChange={(value) =>
                    onPrimaryContactChange({
                      preferred_email_kind: value as EmailKind,
                    })
                  }
                  options={EMAIL_KINDS}
                  disabled={disabled}
                  autoFilled={!!primaryContact.preferred_email_kind}
                />
              </div>
            )}

            {(primaryContact.preferred_contact_method === ContactMethod.PHONE ||
              primaryContact.preferred_contact_method ===
                ContactMethod.MOBILE && (
                <div className="space-y-2">
                  <FormSelect
                    label="Preferred Phone"
                    placeholder="Select phone type"
                    name="businessContacts.0.preferred_phone_kind"
                    value={primaryContact.preferred_phone_kind ?? ""}
                    onChange={(value) =>
                      onPrimaryContactChange({
                        preferred_phone_kind: value as PhoneKind,
                      })
                    }
                    options={PHONE_KINDS}
                    disabled={disabled}
                    autoFilled={!!primaryContact.preferred_phone_kind}
                  />
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
