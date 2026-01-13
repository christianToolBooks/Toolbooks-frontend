"use client";

import { useMemo } from "react";
import { Button } from "@/src/components/ui/button";
import { Plus, User } from "lucide-react";
import CustomerContactCard from "./CustomerContactCard";
import ContactCardSkeleton from "./ContactCardSkeleton";
import type { CreateCustomerContactInput } from "@/src/types/customer";
import type { UseMutationResult } from "@tanstack/react-query";
import { ApiResponse } from "@/src/api/apiResponse";
import { ErrorResponse } from "@/src/api/errorResponse";
import { useCustomerContacts } from "../hooks/useCustomerContacts";

type DeleteContactMutation = UseMutationResult<
  ApiResponse<void>, 
  ErrorResponse, 
  { 
    customerId: string; 
    contactId: string;
    contactIndex: number;
    localContacts: CreateCustomerContactInput[];
    setLocalContacts: (contacts: CreateCustomerContactInput[]) => void;
    reloadContacts: () => Promise<void>;
  },
  { previousContacts: CreateCustomerContactInput[] } 
>;

type CreateContactMutation = UseMutationResult<
  ApiResponse<CreateCustomerContactInput> | ErrorResponse,
  Error,
  {
    customerId: string;
    contact: CreateCustomerContactInput;
  },
  unknown
>;

type UpdateContactMutation = UseMutationResult<
  ApiResponse<CreateCustomerContactInput>,
  ErrorResponse,
  {
    customerId: string;
    contactId: string;
    data: Partial<CreateCustomerContactInput>;
  },
  unknown
>;
interface CustomerContactListProps {
  customerId?: string;
  type?: string;
  localContacts: CreateCustomerContactInput[];
  setLocalContacts: (c: CreateCustomerContactInput[]) => void;
  reloadContacts: () => Promise<void>;
  createContact: CreateContactMutation;
  updateContact: UpdateContactMutation;
  deleteContact: DeleteContactMutation;
  onContactsReloaded?: (contacts: CreateCustomerContactInput[]) => void;
}

export default function CustomerContactList({
  customerId,
  type,
  localContacts,
  setLocalContacts,
  reloadContacts,
  createContact,
  updateContact,
  deleteContact,
  onContactsReloaded,
}: CustomerContactListProps) {
  const {
    editingIndex,
    setEditingIndex,
    savingIndex,
    isReloading,
    isAnyMutationPending,
    handleAddContact,
    handleFieldChange,
    handleSaveNewContact,
    handleDeleteContact,
  } = useCustomerContacts({
    customerId,
    initialContacts: localContacts,
    createContactMutation: createContact,
    updateContactMutation: updateContact,
    deleteContactMutation: deleteContact,
    onContactsReloaded: (updatedContacts) => {
      setLocalContacts(updatedContacts);
      onContactsReloaded?.(updatedContacts);
    },
  });

  const primaryContact = useMemo(
    () => localContacts.find((c) => c.isPrimary === true),
    [localContacts]
  );

  const primaryContactIndex = useMemo(
    () => localContacts.findIndex((c) => c.isPrimary === true),
    [localContacts]
  );

  const allContactsWithIndices = useMemo(() => {
    return localContacts.map((contact, originalIndex) => ({
      contact,
      originalIndex,
    }));
  }, [localContacts]);

  const skeletonIndexes = useMemo(() => {
    const indexes = new Set<number>();

    if (savingIndex !== null && (createContact.isPending || updateContact.isPending || isReloading)) {
      indexes.add(savingIndex);
    }

    if (deleteContact.isPending && deleteContact.variables?.contactIndex !== undefined) {
      indexes.add(deleteContact.variables.contactIndex);
    }

    return indexes;
  }, [savingIndex, createContact.isPending, updateContact.isPending, isReloading, deleteContact.isPending, deleteContact.variables]);

  const primaryContactComponent = useMemo(() => {
    if (!primaryContact || primaryContactIndex === -1) {
      return (
        <div className="p-4 bg-secondary/30 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            No primary contact set. Mark a contact as primary from the All Contacts section.
          </p>
        </div>
      );
    }

    const shouldShowSkeleton = skeletonIndexes.has(primaryContactIndex);

    if (shouldShowSkeleton) {
      return <ContactCardSkeleton key={`saving-primary-${primaryContact.id}`} />;
    }

    return (
      <div key={`primary-${primaryContact.id?.toString() || "primary"}`} className="p-3 sm:p-4 bg-secondary/30 rounded-lg">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center gap-2">
            <div className="flex gap-2 sm:gap-4 flex-1 min-w-0">
              <User className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
              
              <div className="flex flex-col gap-2 flex-1 min-w-0 lg:hidden">
                <div className="space-y-1">
                  <p className="font-medium text-sm break-words">{primaryContact.name || "—"}</p>
                  <span className="text-xs text-primary font-medium">Primary Contact</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground break-all">{primaryContact.email || "—"}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{primaryContact.phone || "—"}</p>
                <div className="flex gap-2 text-xs sm:text-sm text-muted-foreground">
                  <span>{primaryContact.role || "—"}</span>
                  {primaryContact.role && primaryContact.jobTitle && <span>•</span>}
                  <span>{primaryContact.jobTitle || "—"}</span>
                </div>
              </div>

              <div className="hidden lg:grid lg:grid-cols-5 gap-4 flex-1 min-w-0">
                <p className="font-medium text-sm break-words">{primaryContact.name || "—"}</p>
                <p className="text-sm text-muted-foreground break-all">{primaryContact.email || "—"}</p>
                <p className="text-sm text-muted-foreground">{primaryContact.phone || "—"}</p>
                <p className="text-sm text-muted-foreground break-words">{primaryContact.role || "—"}</p>
                <p className="text-sm text-muted-foreground break-words">{primaryContact.jobTitle || "—"}</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:block text-xs text-primary font-medium ml-8">Primary Contact</div>
        </div>
      </div>
    );
  }, [primaryContact, primaryContactIndex, skeletonIndexes]);

  const contactComponents = useMemo(() => {
    return allContactsWithIndices.map(({ contact, originalIndex }) => {
      const shouldShowSkeleton = skeletonIndexes.has(originalIndex);

      if (shouldShowSkeleton) {
        return <ContactCardSkeleton key={`saving-${contact.id}-${originalIndex}`} />;
      }

      return (
        <CustomerContactCard
          key={contact.id?.toString() || `contact-${originalIndex}`}
          contact={contact}
          index={originalIndex}
          editingIndex={editingIndex}
          setEditingIndex={setEditingIndex}
          localContacts={localContacts}
          setLocalContacts={setLocalContacts}
          customerId={customerId}
          reloadContacts={async () => {
            await reloadContacts();
          }}
          onSave={handleSaveNewContact}
          onDelete={handleDeleteContact}
          createContact={createContact}
          updateContact={updateContact}
          deleteContact={deleteContact}
          isReloading={isReloading}
          onFieldChange={handleFieldChange}
        />
      );
    });
  }, [
    allContactsWithIndices,
    skeletonIndexes,
    editingIndex,
    localContacts,
    customerId,
    handleSaveNewContact,
    handleDeleteContact,
    handleFieldChange,
    createContact,
    updateContact,
    deleteContact,
    isReloading,
    setEditingIndex,
    setLocalContacts,
    reloadContacts,
  ]);

  return (
    <div className="space-y-6">
      {type === "business" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Primary Contact</h3>
              <p className="text-xs text-muted-foreground">
                This contact can only be edited from the All Contacts section
              </p>
            </div>
          </div>
          <div className="space-y-2">{primaryContactComponent}</div>
        </div>
      )}

      {type === "business" && (
        <div className="space-y-4">
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

          <div className="space-y-2">{contactComponents}</div>
        </div>
      )}
    </div>
  );
}
