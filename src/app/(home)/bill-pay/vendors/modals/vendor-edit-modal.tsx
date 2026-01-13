"use client";

import { useState, useEffect } from "react";
import { Input } from "@/src/components/ui/input";
import { HandCoins, Mail, Phone, User } from "lucide-react";
import { getVendorById } from "@/src/lib/services/vendorServices";
import { toast } from "sonner";
import type {
  CreateVendorContactInput,
  CreateVendorInput,
} from "@/src/types/vendorsTypes";
import { useCreateVendorContact } from "../_hooks/useCreateVendorContact";
import { useUpdateVendorContact } from "../_hooks/useUpdateVendorContact";
import ContactList from "../_components/editVendorComponents/ContactList";
import AddressList from "../_components/editVendorComponents/AddressList";
import { useDeleteVendorContact } from "../_hooks/useDeleteVendorContact";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { useCreateVendorAddress } from "../_hooks/useCreateVendorAddress";
import { useUpdateVendorAddress } from "../_hooks/useUpdateVendorAddress";
import { useDeleteVendorAddress } from "../_hooks/useDeleteVendorAddress";
import { CreateVendorAddressInput } from "../../_schemas/businessVendorSchema";

type EditableAddressFields = Omit<CreateVendorAddressInput, 'id' | 'vendorId' | 'createdAt' | 'updatedAt'>;

type Props = {
  vendorId?: string;
  data: Partial<CreateVendorInput> | null;
  type: string | undefined;
  onChange: (field: keyof CreateVendorInput, value: string) => void;
  contacts: CreateVendorContactInput[];
  addresses: CreateVendorAddressInput[];
  addAddress: () => void;
  addContact: () => void;
  updateContact: (index: number, field: keyof CreateVendorContactInput, value: string | boolean) => void;
  removeContact: (index: number) => void;
  updateAddress: (index: number, field: keyof EditableAddressFields, value: string | boolean | number) => void;
  removeAddress: (index: number) => void;
  makeDefault: (index: number) => void;
  onContactsReloaded?: (contacts: CreateVendorContactInput[]) => void;
  onAddressesReloaded?: (addresses: CreateVendorAddressInput[]) => void;
};

export default function VendorDetailsEdit({
  vendorId,
  data,
  type,
  onChange,
  contacts,
  addresses,
  addAddress,
  addContact,
  updateContact,
  removeContact,
  updateAddress,
  removeAddress,
  onContactsReloaded,
  onAddressesReloaded,
}: Props) {
  const [localContacts, setLocalContacts] =
    useState<CreateVendorContactInput[]>(contacts);
  const [localAddresses, setLocalAddresses] =
    useState<CreateVendorAddressInput[]>(addresses);

  useEffect(() => {
    setLocalContacts(contacts);
  }, [contacts]);

  useEffect(() => {
    setLocalAddresses(addresses);
  }, [addresses]);

  const reloadContacts = async () => {
    if (!vendorId) return;

    try {
      const vendor = await getVendorById(vendorId);

      if ("statusCode" in vendor) {
        toast.error("Error reloading contacts");
        return;
      }

      if (vendor.data && "contacts" in vendor.data && vendor.data.contacts) {
        const updatedContacts = vendor.data.contacts as CreateVendorContactInput[];
        setLocalContacts(updatedContacts);
        onContactsReloaded?.(updatedContacts);
      }
    } catch (error) {
      console.error("reloadContacts: Error reloading contacts:", error);
      toast.error("Error reloading contacts");
    }
  };

  const reloadAddresses = async () => {
    if (!vendorId) return;

    try {
      const vendor = await getVendorById(vendorId);

      if ("statusCode" in vendor) {
        toast.error("Error reloading addresses");
        return;
      }

      if (vendor.data && "addresses" in vendor.data && vendor.data.addresses) {
        const updatedAddresses = vendor.data.addresses as CreateVendorAddressInput[];
        setLocalAddresses(updatedAddresses);
        onAddressesReloaded?.(updatedAddresses);
      }
    } catch (error) {
      console.error("reloadAddresses: Error reloading addresses:", error);
      toast.error("Error reloading addresses");
    }
  };
  
  const createContactMutation = useCreateVendorContact();
  const updateContactMutation = useUpdateVendorContact();
  const deleteContactMutation = useDeleteVendorContact();
  const createAddressMutation = useCreateVendorAddress();
  const updateAddressMutation = useUpdateVendorAddress();
  const deleteAddressMutation = useDeleteVendorAddress();

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Vendor Name</p>
              <Input
                value={data?.name ?? ""}
                onChange={(e) => onChange("name", e.target.value)}
                placeholder="Enter vendor name"
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Legal Name</p>
              <Input
                value={data?.legalName ?? ""}
                onChange={(e) => onChange("legalName", e.target.value)}
                placeholder="Enter legal name"
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Email</p>
              <Input
                value={data?.email ?? ""}
                onChange={(e) => onChange("email", e.target.value)}
                placeholder="Enter email"
                type="email"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Phone</p>
              <Input
                value={data?.phone ?? ""}
                onChange={(e) => onChange("phone", e.target.value)}
                placeholder="Enter phone"
                type="tel"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <HandCoins className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Payments Terms</p>
              <Select
                value={data?.paymentTerms ?? ""}
                onValueChange={(e) => onChange("paymentTerms", e)}
              >
                <SelectTrigger className="h-10 border-2 border-chart-5 bg-transparent focus:border-[#1E3A8A] focus:ring-0">
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="net_0">Net 0</SelectItem>
                  <SelectItem value="net_15">Net 15</SelectItem>
                  <SelectItem value="net_30">Net 30</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {type === "business" && (
        <ContactList
          vendorId={vendorId}
          type={type}
          localContacts={localContacts}
          setLocalContacts={setLocalContacts}
          reloadContacts={reloadContacts}
          createContact={createContactMutation}
          updateContact={updateContactMutation}
          deleteContact={deleteContactMutation}
          onContactChange={updateContact}
          onAddContact={addContact}
          onRemoveContact={removeContact}
        />
      )}

      <AddressList
        addresses={addresses}
        type={type}
        vendorId={vendorId}
        localAddresses={localAddresses}
        reloadAddresses={reloadAddresses}
        setLocalAddresses={setLocalAddresses}
        createAddress={createAddressMutation}
        deleteAddress={deleteAddressMutation}
        updateAddress={updateAddressMutation}
        addAddress={addAddress}
        onAddressChange={updateAddress}
        onRemoveAddress={removeAddress}
      />
    </div>
  );
}
