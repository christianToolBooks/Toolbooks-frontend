// Contacts.tsx (arreglado)
"use client";

import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { ContactsProps, FormStepsProps } from "../_types/businessPropsTypes";
import { InputPhoneFormateToCustomerForm } from "./inputPhoneFormateCustomerForm";

type Props = ContactsProps & FormStepsProps & { phoneResetKey?: number };

export function Contacts({
  contacts,
  onAddContact,
  onRemoveContact,
  onUpdateContact,
  register,      
  setValue,      
  watch,
  phoneResetKey,
  errors
}: Props) {

  return (
    <section className="overflow-hidden rounded-2xl border border-[#EFECE6]/50 bg-white/80 shadow-sm backdrop-blur-sm">
      <header className="flex items-center justify-between border-b border-[#EFECE6]/50 px-5 py-4 md:px-6">
        <h2 className="text-lg font-semibold text-[#1E3A8A] md:text-xl">Contacts</h2>
        <button
          type="button"
          onClick={onAddContact}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E3A8A] text-white transition-colors hover:bg-[#1E3A8A]/90"
        >
          <Plus className="h-5 w-5" />
        </button>
      </header>

      <div className="px-5 py-6 md:px-6">
        <div className="space-y-4">
          {(contacts ?? []).map((contact, index) => (
            <div key={`${index}-${phoneResetKey ?? 0}`} className="rounded-xl border border-[#EFECE6]/60 bg-white/60 p-4 backdrop-blur-sm">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                <div className="md:col-span-3 space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wide text-[#5C769D]">Name</Label>
                  <Input
                    value={contact.name ?? ""}
                    onChange={(e) => onUpdateContact(index, "name", e.target.value)}
                    className="h-10 border-2 border-chart-5 bg-transparent px-2 text-sm focus:border-[#1E3A8A] focus:ring-0"
                  />
                  {errors?.contacts?.[index]?.name && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.contacts[index]?.name?.message as string}
                    </p>
                  )}
                </div>

                <div className="md:col-span-3 space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wide text-[#5C769D]">Email</Label>
                  <Input
                    type="email"
                    value={contact.email ?? ""}
                    onChange={(e) => onUpdateContact(index, "email", e.target.value)}
                    className="h-10 border-2 border-chart-5 bg-transparent px-2 text-sm focus:border-[#1E3A8A] focus:ring-0"
                  />
                  {errors?.contacts?.[index]?.name && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.contacts[index]?.name?.message as string}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <InputPhoneFormateToCustomerForm
                    key={`phone-${index}-${phoneResetKey ?? 0}`}
                    contactsIndex={index}
                    register={register}  
                    setValue={setValue}  
                    watch={watch}
                    errors={errors}        
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wide text-[#5C769D]">Job Title</Label>
                  <Input
                    value={contact.jobTitle ?? ""}
                    onChange={(e) => onUpdateContact(index, "jobTitle", e.target.value)}
                    className="h-10 border-2 border-chart-5 bg-transparent px-2 text-sm focus:border-[#1E3A8A] focus:ring-0"
                  />
                  {errors?.contacts?.[index]?.name && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.contacts[index]?.name?.message as string}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <Label className="text-[11px] uppercase tracking-wide text-[#5C769D]">Role</Label>
                  <Input
                    value={contact.role ?? ""}
                    onChange={(e) => onUpdateContact(index, "role", e.target.value)}
                    className="h-10 border-2 border-chart-5 bg-transparent px-2 text-sm focus:border-[#1E3A8A] focus:ring-0"
                  />
                  {errors?.contacts?.[index]?.name && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.contacts[index]?.name?.message as string}
                    </p>
                  )}
                </div>

                <div className="md:col-span-1 flex items-center justify-center space-y-1.5">
                  <div className="flex flex-col items-center space-y-2">
                    <Label className="text-[11px] uppercase tracking-wide text-[#5C769D]">Primary</Label>
                    <Switch
                      checked={contact.isPrimary ?? false}
                      onCheckedChange={(checked) => onUpdateContact(index, "isPrimary", checked)}
                    />
                  </div>
                </div>

                <div className="md:col-span-1 flex items-end justify-end">
                  <button
                    type="button"
                    onClick={() => onRemoveContact(index)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
