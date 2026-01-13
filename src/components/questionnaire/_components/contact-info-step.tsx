  // ContactInfoStep.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type { Contact } from "@/src/types/questionnaire";
import { ContactMethod, EmailKind, PhoneKind } from "@/src/types/questionnaire";
import { Switch } from "../../ui/switch";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  FieldPath,
} from "react-hook-form";
import type { CreateGetStartedOnboardingInput as T } from "../schemas/schemas";
import { PhoneField } from "./inputPhoneToGetStarted";

interface ContactInfoStepProps {
  contacts: Partial<Contact>[];
  onChange: (index: number, path: string, value: string | boolean) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  getFieldError: (fieldPath: string) => string | null;
  register: UseFormRegister<T>;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  errors?: FieldErrors<T>;
}

export function ContactInfoStep({
  contacts,
  onChange,
  onAdd,
  onRemove,
  getFieldError,
  register,
  watch,
  setValue,
}: ContactInfoStepProps) {
  const isAnyPrimary = contacts.some((contact) => contact.isPrimary);
  return (
    <Card>
      <CardHeader className="flex flex-col items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-semibold text-primary">
            Contacts
          </CardTitle>
          <CardDescription>People we can reach out to</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="flex justify-end">
          <Button type="button" variant="secondary" size="sm" onClick={onAdd}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
        {contacts.map((c, i) => (
          <div key={i} className="space-y-6 rounded-lg border p-4">
            <div className="flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(i)}
                aria-label="Remove contact"
                className={`w-4 h-4 ${i.valueOf() === 0 ? "hidden" : ""}`}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input
                  value={c.first_name ?? ""}
                  onChange={(e) => onChange(i, "first_name", e.target.value)}
                  className={
                    getFieldError(`contact.${i}.first_name`)
                      ? "border-red-500"
                      : ""
                  }
                />
                {getFieldError(`contact.${i}.first_name`) && (
                  <p className="text-sm text-red-500">
                    {getFieldError(`contact.${i}.first_name`)}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input
                  value={c.last_name ?? ""}
                  onChange={(e) => onChange(i, "last_name", e.target.value)}
                  className={
                    getFieldError(`contact.${i}.last_name`)
                      ? "border-red-500"
                      : ""
                  }
                />
                {getFieldError(`contact.${i}.last_name`) && (
                  <p className="text-sm text-red-500">
                    {getFieldError(`contact.${i}.last_name`)}
                  </p>
                )}
              </div>
            {/* Título */}
            <div className="space-y-2">
              <Label>Position/Title</Label>
              <Input
                value={c.title ?? ""}
                onChange={(e) => onChange(i, "title", e.target.value)}
                placeholder="(optional)"
              />
            </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PhoneField
                name={`contact.${i}.phones.mobile` as FieldPath<T>}
                label="Mobile Phone"
                required
                register={register}
                watch={watch}
                setValue={setValue}
                errorMsg={
                  getFieldError(`contact.${i}.phones.mobile`) ?? undefined
                }
              />
              <PhoneField
                name={`contact.${i}.phones.work` as FieldPath<T>}
                label="Work Phone"
                register={register}
                watch={watch}
                setValue={setValue}
                errorMsg={
                  getFieldError(`contact.${i}.phones.work`) ?? undefined
                }
              />
              <PhoneField
                name={`contact.${i}.phones.fax` as FieldPath<T>}
                label="Fax"
                register={register}
                watch={watch}
                setValue={setValue}
                errorMsg={getFieldError(`contact.${i}.phones.fax`) ?? undefined}
              />
              <PhoneField
                name={`contact.${i}.phones.main` as FieldPath<T>}
                label="Main Phone"
                register={register}
                watch={watch}
                setValue={setValue}
                errorMsg={
                  getFieldError(`contact.${i}.phones.main`) ?? undefined
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Work Email *</Label>
                <Input
                  type="email"
                  value={c.emails?.work ?? ""}
                  onChange={(e) => onChange(i, "emails.work", e.target.value)}
                  className={
                    getFieldError(`contact.${i}.emails.work`)
                      ? "border-red-500"
                      : ""
                  }
                />
                {getFieldError(`contact.${i}.emails.work`) && (
                  <p className="text-sm text-red-500">
                    {getFieldError(`contact.${i}.emails.work`)}
                  </p>
                )}
              </div>
              <div>
                <div className="space-y-2">
                  <Label>Personal Email</Label>
                  <Input
                    type="email"
                    value={c.emails?.personal ?? ""}
                    onChange={(e) => onChange(i, "emails.personal", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Other Email</Label>
                <Input
                  type="email"
                  value={c.emails?.other ?? ""}
                  onChange={(e) => onChange(i, "emails.other", e.target.value)}
                />
              </div>
            </div>

            {/* Preferred Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Preferred Contact Method *</Label>
                <Select
                  value={c.preferred_contact_method ?? ""}
                onValueChange={(v) =>
                  onChange(i, "preferred_contact_method", v)
                }
              >
                <SelectTrigger
                  className={
                    getFieldError(`contact.${i}.preferred_contact_method`)
                      ? "border-red-500"
                      : ""
                  }
                >
                  <SelectValue placeholder="Select a method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ContactMethod.MOBILE}>
                    Phone
                  </SelectItem>
                  {/* <SelectItem value={ContactMethod.PHONE}>
                    Work Phone
                  </SelectItem> */}
                  <SelectItem value={ContactMethod.EMAIL}>
                    Email
                  </SelectItem>
                  <SelectItem value={ContactMethod.FAX}>Fax</SelectItem>
                </SelectContent>
              </Select>
              {getFieldError(`contact.${i}.preferred_contact_method`) && (
                <p className="text-sm text-red-500">
                  {getFieldError(`contact.${i}.preferred_contact_method`)}
                </p>
              )}
            </div>
            {c.preferred_contact_method === ContactMethod.EMAIL && (
              <div className="space-y-2">
                <Label>Email Kind</Label>
                <Select
                  value={c.preferred_email_kind ?? ""}
                  onValueChange={(v) => onChange(i, "preferred_email_kind", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an email kind" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EmailKind.WORK}>Work</SelectItem>
                    <SelectItem value={EmailKind.PERSONAL}>Personal</SelectItem>
                    <SelectItem value={EmailKind.OTHER}>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {c.preferred_contact_method === ContactMethod.PHONE || c.preferred_contact_method === ContactMethod.MOBILE && (
              <div className="space-y-2">
                <Label>Phone Kind</Label>
                <Select
                  value={c.preferred_phone_kind ?? ""}
                  onValueChange={(v) => onChange(i, "preferred_phone_kind", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a phone kind" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PhoneKind.MAIN}>Main</SelectItem>
                    <SelectItem value={PhoneKind.WORK}>Work</SelectItem>
                    <SelectItem value={PhoneKind.MOBILE}>Mobile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            </div>

            {/* Switches */}
            <div>
              <div className="grid grid-cols-2 mb-2 space-x-2 ">
                <Label className="text-sm text-muted-foreground">
                  Is Primary
                </Label>
                <Switch
                  checked={c.isPrimary ?? false}
                  onCheckedChange={(checked) =>
                    onChange(i, "isPrimary", checked)
                  }
                  disabled={!c.isPrimary && isAnyPrimary}
                />
              </div>
              <div className="grid grid-cols-2 space-x-2">
                <Label className="text-sm text-muted-foreground">
                  Is Authorized to Discuss
                </Label>
                <Switch
                  checked={c.isAuthorized ?? false}
                  onCheckedChange={(checked) =>
                    onChange(i, "isAuthorized", checked)
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
