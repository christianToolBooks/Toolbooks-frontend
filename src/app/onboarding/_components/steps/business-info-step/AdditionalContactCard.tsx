"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { X, Plus } from "lucide-react";
import type {
  Contact,
  ContactEmails,
  ContactPhones,
} from "@/src/types/questionnaire";
import { FormInput } from "../../form-input";
import { ContactMethod } from "@/src/types/questionnaire";
import { PhoneUSField } from "../../inputPhoneToOnboarding";
import { FormSelect } from "../../form-select";
import {
  CONTACT_METHODS,
  EMAIL_KINDS,
  PHONE_KINDS,
} from "../../../_utils/onboarding-config";

type Props = {
  businessContacts: Contact[];
  onContactChange: (index: number, data: Partial<Contact>) => void;
  onAddContact: () => void;
  onRemoveContact: (index: number) => void;
  disabled?: boolean;
};

export function AuthorizedContactsCard({
  businessContacts,
  onContactChange,
  onAddContact,
  onRemoveContact,
  disabled = false,
}: Props) {
  const authorizedContacts = businessContacts
    .filter((contact) => contact.isAuthorized && !contact.isPrimary);

  const getSafePhones = (contact: Contact): ContactPhones => ({
    contact_id: contact.phones?.contact_id,
    main: contact.phones?.main ?? "",
    mobile: contact.phones?.mobile ?? "",
    work: contact.phones?.work ?? "",
    fax: contact.phones?.fax ?? "",
  });

  const getSafeEmails = (contact: Contact): ContactEmails => ({
    contact_id: contact.emails?.contact_id,
    work: contact.emails?.work ?? "",
    personal: contact.emails?.personal ?? "",
    other: contact.emails?.other ?? "",
  });

  const getRealIndex = (displayIndex: number): number => displayIndex + 1;

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-foreground">
          Additional Authorized Users
          <span className="text-sm text-muted-foreground ml-2">(Optional)</span>
        </CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddContact}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Contact
        </Button>
      </CardHeader>

      <CardContent>
        {authorizedContacts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No additional authorized users added yet.</p>
            <p className="text-sm">
              Click &quot;Add Contact&quot; to add an authorized user.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {authorizedContacts.map((contact, displayIndex) => {
              const realIndex = getRealIndex(displayIndex);
              const safePhones = getSafePhones(contact);
              const safeEmails = getSafeEmails(contact);

              return (
                <div key={realIndex} className="relative border rounded-lg p-6">
                  {/* Botón para eliminar */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveContact(realIndex)}
                    disabled={disabled}
                    className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <h3 className="text-lg font-medium text-foreground mb-6">
                    Authorized User #{displayIndex + 1}
                  </h3>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormInput
                        label="First Name"
                        name={`businessContacts.${realIndex}.first_name`}
                        value={contact.first_name ?? ""}
                        onChange={(value) =>
                          onContactChange(realIndex, { first_name: value })
                        }
                        disabled={disabled}
                        autofilled={!!contact.first_name}
                        required
                      />
                      <FormInput
                        label="Last Name"
                        name={`businessContacts.${realIndex}.last_name`}
                        value={contact.last_name ?? ""}
                        onChange={(value) =>
                          onContactChange(realIndex, { last_name: value })
                        }
                        disabled={disabled}
                        autofilled={!!contact.last_name}
                        required
                      />
                      <FormInput
                        label="Position/Title"
                        name={`businessContacts.${realIndex}.title`}
                        value={contact.title ?? ""}
                        onChange={(value) =>
                          onContactChange(realIndex, { title: value })
                        }
                        disabled={disabled}
                        autofilled={!!contact.title}
                      />
                    </div>

                    {/* Emails */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        label="Work Email"
                        type="email"
                        name={`businessContacts.${realIndex}.emails.work`}
                        value={safeEmails.work}
                        onChange={(value) =>
                          onContactChange(realIndex, {
                            emails: { ...safeEmails, work: value },
                          })
                        }
                        disabled={disabled}
                        autofilled={!!safeEmails.work}
                        required
                      />
                      <FormInput
                        label="Other Email"
                        type="email"
                        name={`businessContacts.${realIndex}.emails.other`}
                        value={safeEmails.other ?? ""}
                        onChange={(value) =>
                          onContactChange(realIndex, {
                            emails: { ...safeEmails, other: value },
                          })
                        }
                        disabled={disabled}
                        autofilled={!!safeEmails.other}
                      />
                    </div>

                    {/* Teléfonos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <PhoneUSField
                        label="Mobile Phone"
                        valueE164={safePhones.mobile}
                        onChangeE164={(value) =>
                          onContactChange(realIndex, {
                            phones: { ...safePhones, mobile: value },
                          })
                        }
                        disabled={disabled}
                        autoFilled={!!safePhones.mobile}
                        required
                      />
                      <PhoneUSField
                        label="Main Phone"
                        valueE164={safePhones.main}
                        onChangeE164={(value) =>
                          onContactChange(realIndex, {
                            phones: { ...safePhones, main: value },
                          })
                        }
                        disabled={disabled}
                        autoFilled={!!safePhones.main}
                      />
                      <PhoneUSField
                        label="Work Phone"
                        valueE164={safePhones.work}
                        onChangeE164={(value) =>
                          onContactChange(realIndex, {
                            phones: { ...safePhones, work: value },
                          })
                        }
                        disabled={disabled}
                        autoFilled={!!safePhones.work}
                      />
                      <PhoneUSField
                        label="Fax Number"
                        valueE164={safePhones.fax ?? ""}
                        onChangeE164={(value) =>
                          onContactChange(realIndex, {
                            phones: { ...safePhones, fax: value },
                          })
                        }
                        disabled={disabled}
                        autoFilled={!!safePhones.fax}
                      />
                    </div>

                    {/* Preferencias de contacto */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormSelect
                        label="Preferred Contact Method"
                        placeholder="Select contact method"
                        name={`businessContacts.${realIndex}.preferred_contact_method`}
                        value={contact.preferred_contact_method ?? ""}
                        onChange={(value) =>
                          onContactChange(realIndex, {
                            preferred_contact_method: value as ContactMethod,
                          })
                        }
                        options={CONTACT_METHODS}
                        disabled={disabled}
                        autoFilled={!!contact.preferred_contact_method}
                        required
                      />

                      {contact.preferred_contact_method ===
                        ContactMethod.EMAIL && (
                        <FormSelect
                          label="Preferred Email"
                          placeholder="Select email type"
                          name={`businessContacts.${realIndex}.preferred_email_kind`}
                          value={contact.preferred_email_kind ?? ""}
                          onChange={(value) =>
                            onContactChange(realIndex, {
                              preferred_email_kind:
                                value as Contact["preferred_email_kind"],
                            })
                          }
                          options={EMAIL_KINDS}
                          disabled={disabled}
                          autoFilled={!!contact.preferred_email_kind}
                        />
                      )}

                      {(contact.preferred_contact_method ===
                        ContactMethod.PHONE ||
                        contact.preferred_contact_method ===
                          ContactMethod.MOBILE) && (
                        <FormSelect
                          label="Preferred Phone"
                          placeholder="Select phone type"
                          name={`businessContacts.${realIndex}.preferred_phone_kind`}
                          value={contact.preferred_phone_kind ?? ""}
                          onChange={(value) =>
                            onContactChange(realIndex, {
                              preferred_phone_kind:
                                value as Contact["preferred_phone_kind"],
                            })
                          }
                          options={PHONE_KINDS}
                          disabled={disabled}
                          autoFilled={!!contact.preferred_phone_kind}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
