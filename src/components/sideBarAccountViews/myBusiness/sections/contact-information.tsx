"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";

import { Mail, Phone, Globe, User, Shield, Save } from "lucide-react";
import type {
  Contact,
  OnboardingEmergencyContact,
} from "@/src/types/questionnaire";
import { useState } from "react";

interface EditableContactsPayload {
  contacts: Contact[];
  emergencyContact: OnboardingEmergencyContact | null;
}

interface ContactInformationProps {
  contacts?: Contact[];
  emergencyContact?: OnboardingEmergencyContact | null;
  isEditing?: boolean;
  onSave?: (data: EditableContactsPayload) => Promise<void>;
}

export function ContactInformation({
  contacts = [],
  emergencyContact,
  isEditing = false,
  onSave,
}: ContactInformationProps) {
  const [editContacts, setEditContacts] = useState<Contact[]>(contacts);
  const [editEmergency, setEditEmergency] =
    useState<OnboardingEmergencyContact | null>(emergencyContact ?? null);
  const [isSaving, setIsSaving] = useState(false);


  const handleEmergencyChange = <K extends keyof OnboardingEmergencyContact>(
    field: K,
    value: OnboardingEmergencyContact[K]
  ) => {
    setEditEmergency((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleContactChange = <K extends keyof Contact>(
    index: number,
    field: K,
    value: Contact[K]
  ) => {
    setEditContacts((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };
  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave({
        contacts: editContacts,
        emergencyContact: editEmergency,
      });
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <>
      <div className="border-t border-neutral-200" />
      <Card className="border-none shadow-none">
        <CardContent className="p-0">
          {/* Title */}
          <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Primary and emergency contact details for your business.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-base flex items-center gap-2 text-chart-1/90">
                  <User className="w-4 h-4" />
                  Business Contacts
                </h3>
                <div className="border-b border-muted mt-2" />
              </div>

              <div className="max-h-[500px] overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/30">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {editContacts.map((contact, index) => (
                      <div
                        key={contact.id}
                        className="rounded-lg border border-muted p-4 bg-muted/20 space-y-4"
                      >
                        {/* Name Row */}
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                            {contact.first_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">
                              {contact.first_name} {contact.last_name}
                            </p>
                            {contact.isPrimary && (
                              <span className="text-xs text-blue-600 font-medium">
                                Primary Contact
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Editable fields */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label>First Name</Label>
                            <Input
                              value={contact.first_name}
                              onChange={(e) =>
                                handleContactChange(
                                  index,
                                  "first_name",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Last Name</Label>
                            <Input
                              value={contact.last_name}
                              onChange={(e) =>
                                handleContactChange(
                                  index,
                                  "last_name",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label>Title</Label>
                          <Input
                            value={contact.title ?? ""}
                            onChange={(e) =>
                              handleContactChange(
                                index,
                                "title",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="space-y-1">
                          <Label>Work Email</Label>
                          <Input
                            value={contact.emails?.work ?? ""}
                            onChange={(e) =>
                              setEditContacts((prev) =>
                                prev.map((c, i) =>
                                  i === index
                                    ? {
                                        ...c,
                                        emails: {
                                          ...c.emails,
                                          work: e.target.value,
                                        },
                                      }
                                    : c
                                )
                              )
                            }
                          />
                        </div>

                        <div className="space-y-1">
                          <Label>Mobile</Label>
                          <Input
                            value={contact.phones?.mobile ?? ""}
                            onChange={(e) =>
                              setEditContacts((prev) =>
                                prev.map((c, i) =>
                                  i === index
                                    ? {
                                        ...c,
                                        phones: {
                                          ...c.phones,
                                          mobile: e.target.value,
                                        },
                                      }
                                    : c
                                )
                              )
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {contacts.length > 0 ? (
                      contacts.map((c) => (
                        <div
                          key={c.id}
                          className="rounded-lg border border-muted p-4 hover:bg-muted/10 transition space-y-2"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                              {c.first_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold">
                                {c.first_name} {c.last_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {c.title}
                              </p>

                              {c.isPrimary && (
                                <span className="text-xs text-blue-600 font-medium block mt-1">
                                  Primary Contact
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1 pt-2 text-sm text-muted-foreground">
                            <p className="flex items-center gap-2">
                              <Mail className="w-4 h-4" /> {c.emails?.work}
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone className="w-4 h-4" /> {c.phones?.mobile}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No contacts available.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-6">
              {/* Section Header */}
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-base flex items-center gap-2 text-red-600">
                  <Shield className="w-4 h-4" />
                  Emergency Contact
                </h3>
                <div className="border-b border-muted mt-2" />
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>First Name</Label>
                      <Input
                        value={editEmergency?.first_name ?? ""}
                        onChange={(e) =>
                          handleEmergencyChange("first_name", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Last Name</Label>
                      <Input
                        value={editEmergency?.last_name ?? ""}
                        onChange={(e) =>
                          handleEmergencyChange("last_name", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label>Relationship / Position</Label>
                    <Input
                      value={editEmergency?.relationship_or_position ?? ""}
                      onChange={(e) =>
                        handleEmergencyChange(
                          "relationship_or_position",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Phone</Label>
                    <Input
                      value={editEmergency?.phone ?? ""}
                      onChange={(e) =>
                        handleEmergencyChange("phone", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Email</Label>
                    <Input
                      value={editEmergency?.email ?? ""}
                      onChange={(e) =>
                        handleEmergencyChange("email", e.target.value)
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-sm text-muted-foreground">
                  {emergencyContact ? (
                    <>
                      <p className="text-base font-medium text-foreground">
                        {emergencyContact.first_name}{" "}
                        {emergencyContact.last_name}
                      </p>
                      <p>{emergencyContact.relationship_or_position}</p>

                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {emergencyContact.phone}
                      </p>

                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {emergencyContact.email}
                      </p>
                    </>
                  ) : (
                    <p>No emergency contact available.</p>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Save button */}
          {isEditing && (
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="mt-10 w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Contact Information"}
            </Button>
          )}
        </CardContent>
      </Card>
    </>
  );
}
