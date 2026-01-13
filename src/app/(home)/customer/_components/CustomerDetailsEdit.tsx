"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/src/components/ui/input";
import { HandCoins, Mail, Phone, User, Save } from "lucide-react";
import type {
  CreateCustomerContactInput,
  Customer,
  CreateCustomerAddressInput,
} from "@/src/types/customer";
import { useCreateCustomerContact } from "../hooks/useCreateCustomerContact";
import { useUpdateCustomerContact } from "../hooks/useUpdateCustomerContact";
import CustomerContactList from "./CustomerContactList";
import CustomerAddressList from "./CustomerAddressList";
import { useDeleteCustomerContact } from "../hooks/useDeleteCustomerContact";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";
import { Loader2 } from "lucide-react";
import { getCustomerById } from "@/src/lib/services/customersServices";

type EditableAddressFields = Omit<CreateCustomerAddressInput, 'id' | 'customerId' | 'createdAt' | 'updatedAt'>;

type Props = {
  customerId: string;
  data: Partial<Customer> | null;
  type: string | undefined;
  onChange: (field: keyof Customer, value: string) => void;
  contacts?: CreateCustomerContactInput[];
  addresses: CreateCustomerAddressInput[];
  addAddress: () => void;
  updateAddress: (index: number, field: keyof EditableAddressFields, value: string | boolean | number) => void;
  removeAddress: (index: number) => void;
  onContactsReloaded?: (contacts: CreateCustomerContactInput[]) => void;
  onAddressesReloaded?: (addresses: CreateCustomerAddressInput[]) => void;
  onSaveBasicInfo: () => Promise<void>;
  isSavingBasicInfo: boolean;
};

export default function CustomerDetailsEdit({
  customerId,
  data,
  type,
  onChange,
  contacts = [],
  addresses,
  addAddress,
  updateAddress,
  removeAddress,
  onContactsReloaded,
  onAddressesReloaded,
  onSaveBasicInfo,
  isSavingBasicInfo,
}: Props) {
  const [localContacts, setLocalContacts] = useState<CreateCustomerContactInput[]>(contacts);
  const [localAddresses, setLocalAddresses] = useState<CreateCustomerAddressInput[]>(addresses);

  const memoizedContacts = useMemo(() => contacts, [contacts]);
  const memoizedAddresses = useMemo(() => addresses, [addresses]);

  useEffect(() => {
    setLocalContacts(memoizedContacts);
  }, [memoizedContacts]);

  useEffect(() => {
    setLocalAddresses(memoizedAddresses);
  }, [memoizedAddresses]);


  const createContactMutation = useCreateCustomerContact();
  const updateContactMutation = useUpdateCustomerContact();
  const deleteContactMutation = useDeleteCustomerContact();

  const handleChange = useCallback((field: keyof Customer) => (value: string) => {
    onChange(field, value);
  }, [onChange]);

  return (
    <div className="space-y-8">
      <div className="relative border rounded-lg p-6 bg-card">
        <Button
          onClick={onSaveBasicInfo}
          disabled={isSavingBasicInfo}
          size="sm"
          className="absolute top-4 right-4 gap-2"
          variant="ghost"
        >
          {isSavingBasicInfo ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
        </Button>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-16">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Customer Name</p>
                <Input
                  value={data?.name ?? ""}
                  onChange={(e) => handleChange("name")(e.target.value)}
                  placeholder="Enter customer name"
                  type="text"
                />
              </div>
            </div>
            {type === "business" && (
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Legal Name</p>
                  <Input
                    value={data?.legalName ?? ""}
                    onChange={(e) => handleChange("legalName")(e.target.value)}
                    placeholder="Enter legal name"
                    type="text"
                  />
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Email</p>
                <Input
                  value={data?.email ?? ""}
                  onChange={(e) => handleChange("email")(e.target.value)}
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
                  onChange={(e) => handleChange("phone")(e.target.value)}
                  placeholder="Enter phone"
                  type="tel"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HandCoins className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Payment Terms</p>
                <Select
                  value={data?.paymentTerms ?? ""}
                  onValueChange={handleChange("paymentTerms")}
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
      </div>

      {type === "business" && (
        <div className="border-t pt-8">
          <CustomerContactList
            customerId={customerId}
            type={type}
            localContacts={localContacts}
            setLocalContacts={setLocalContacts}
            reloadContacts={async () => {}}
            createContact={createContactMutation}
            updateContact={updateContactMutation}
            deleteContact={deleteContactMutation}
            onContactsReloaded={(updatedContacts) => {
              setLocalContacts(updatedContacts);
              onContactsReloaded?.(updatedContacts);
            }}
          />
        </div>
      )}

      <div className="border-t pt-8">
        <CustomerAddressList
          customerId={customerId}
          addresses={localAddresses}
          addAddress={addAddress}
          updateAddress={updateAddress}
          removeAddress={removeAddress}
          onAddressesReloaded={onAddressesReloaded}
        />
      </div>
    </div>
  );
}
