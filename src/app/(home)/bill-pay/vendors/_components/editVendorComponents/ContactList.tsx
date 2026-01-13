"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import ContactCard from "./ContactCard";
import ContactCardSkeleton from "./ContactCardSkeleton";
import type { CreateVendorContactInput } from "@/src/types/vendorsTypes";
import type { UseMutationResult } from "@tanstack/react-query";
import { ApiResponse } from "@/src/api/apiResponse";
import { ErrorResponse } from "@/src/api/errorResponse";
import { toast } from "sonner";

type DeleteContactMutation = UseMutationResult<
  ApiResponse<void>, 
  ErrorResponse, 
  { 
    vendorId: string; 
    contactId: string;
    contactIndex: number;
    localContacts: CreateVendorContactInput[];
    setLocalContacts: (contacts: CreateVendorContactInput[]) => void;
    reloadContacts: () => Promise<void>;
  },
  { previousContacts: CreateVendorContactInput[] } 
>;

type CreateContactMutation = UseMutationResult<
  ApiResponse<CreateVendorContactInput> | ErrorResponse,
  Error,
  {
    vendorId: string;
    contact: CreateVendorContactInput;
  },
  unknown
>;

type UpdateContactMutation = UseMutationResult<
  ApiResponse<CreateVendorContactInput>,
  ErrorResponse,
  {
    vendorId: string;
    contactId: string;
    data: Partial<CreateVendorContactInput>;
  },
  unknown
>;

interface ContactListProps {
  vendorId?: string;
  type?: string;
  localContacts: CreateVendorContactInput[];
  setLocalContacts: (c: CreateVendorContactInput[]) => void;
  reloadContacts: () => Promise<void>;
  createContact: CreateContactMutation;
  updateContact: UpdateContactMutation;
  deleteContact: DeleteContactMutation; 
  onContactChange?: (index: number, field: keyof CreateVendorContactInput, value: string | boolean) => void;
  onAddContact?: () => void;
  onRemoveContact?: (index: number) => void;
}

export default function ContactList({
  vendorId,
  type,
  localContacts,
  setLocalContacts,
  reloadContacts,
  createContact,
  updateContact,
  deleteContact,
  onContactChange,
  onAddContact,
  onRemoveContact,
}: ContactListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const [isReloading, setIsReloading] = useState(false);

  // Memoizar contactos ordenados
  const sortedContacts = useMemo(() => {
    return [...localContacts].sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
  }, [localContacts]);

  // Memoizar handleFieldChange con useCallback
  const handleFieldChange = useCallback((
    index: number,
    field: keyof CreateVendorContactInput,
    value: string | boolean
  ) => {
    const updated = [...localContacts];
    updated[index] = { ...updated[index], [field]: value };
    setLocalContacts(updated);
    
    onContactChange?.(index, field, value);
  }, [localContacts, setLocalContacts, onContactChange]);

  const handleSaveContact = useCallback(async (contact: CreateVendorContactInput, index: number) => {
    if (!vendorId) return;

    setSavingIndex(index);

    try {
      if (contact.id?.toString().startsWith('temp-')) {
        await createContact.mutateAsync({ vendorId, contact });
      } else if (contact.id) {
        await updateContact.mutateAsync({ 
          vendorId, 
          contactId: contact.id, 
          data: contact 
        });
      }
      
      setIsReloading(true);
      await reloadContacts();
      toast.success('Contact saved successfully');
      
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error('Error saving contact');
    } finally {
      setIsReloading(false);
      setSavingIndex(null);
    }
  }, [vendorId, createContact, updateContact, reloadContacts]);

  const handleAddContact = useCallback(() => {
    onAddContact?.();
    setEditingIndex(localContacts.length);
  }, [onAddContact, localContacts.length]);

  const handleRemoveContact = useCallback(async (contact: CreateVendorContactInput, index: number) => {
    if (contact.id && vendorId) {
      await deleteContact.mutateAsync({
        vendorId,
        contactId: contact.id,
        contactIndex: index,
        localContacts,
        setLocalContacts,
        reloadContacts,
      });
    } else {
      onRemoveContact?.(index);
    }
  }, [vendorId, deleteContact, localContacts, setLocalContacts, reloadContacts, onRemoveContact]);

  const skeletonIndexes = useMemo(() => {
    const indexes = new Set<number>();
    
    if (savingIndex !== null && (createContact.isPending || updateContact.isPending || isReloading)) {
      indexes.add(savingIndex);
    }
    
    if (deleteContact.isPending && deleteContact.variables?.contactIndex !== undefined) {
      indexes.add(deleteContact.variables.contactIndex);
    }
    
    return indexes;
  }, [
    savingIndex, 
    createContact.isPending, 
    updateContact.isPending, 
    isReloading, 
    deleteContact.isPending, 
    deleteContact.variables
  ]);

  const contactComponents = useMemo(() => {
    return sortedContacts.map((contact, index) => {
      const shouldShowSkeleton = skeletonIndexes.has(index);
      
      if (shouldShowSkeleton) {
        return <ContactCardSkeleton key={`saving-${contact.id}-${index}`} />;
      }

      return (
        <ContactCard
          key={contact.id?.toString() || `contact-${index}`}
          contact={contact}
          index={index}
          editingIndex={editingIndex}
          setEditingIndex={setEditingIndex}
          localContacts={localContacts}
          setLocalContacts={setLocalContacts}
          vendorId={vendorId}
          reloadContacts={reloadContacts}
          onSave={handleSaveContact}
          onDelete={handleRemoveContact}
          createContact={createContact}
          updateContact={updateContact}
          deleteContact={deleteContact}
          isReloading={isReloading}
          onFieldChange={handleFieldChange}
        />
      );
    });
  }, [
    sortedContacts, 
    skeletonIndexes, 
    editingIndex, 
    localContacts, 
    vendorId, 
    reloadContacts, 
    handleSaveContact, 
    handleRemoveContact,
    handleFieldChange,
    createContact, 
    updateContact,
    deleteContact,
    isReloading,
    setLocalContacts
  ]);

  const isAnyMutationPending = createContact.isPending || updateContact.isPending || deleteContact.isPending || isReloading;

  return (
    <div className="space-y-4">
      {type === "business" && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">All Contacts</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddContact}
            disabled={isAnyMutationPending}
          >
            <Plus className="h-4 w-4 mr-1" /> Add contact
          </Button>
        </div>
      )}

      <div className="space-y-2 overflow-y-auto h-[200px]">
        {contactComponents}
      </div>
    </div>
  );
}