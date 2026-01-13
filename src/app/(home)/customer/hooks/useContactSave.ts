import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { CreateCustomerContactInput } from "@/src/types/customer";
import type { UseMutationResult } from "@tanstack/react-query";
import type { ApiResponse } from "@/src/api/apiResponse";
import type { ErrorResponse } from "@/src/api/errorResponse";

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

interface UseContactSaveProps {
  customerId?: string;
  contactId?: string;
  isNewContact: boolean;
  localContacts: CreateCustomerContactInput[];
  currentIndex: number;
  updateContactMutation: UpdateContactMutation;
  reloadContacts: () => Promise<void>;
  onSaveComplete: () => void;
}

export function useContactSave({
  customerId,
  contactId,
  isNewContact,
  localContacts,
  currentIndex,
  updateContactMutation,
  reloadContacts,
  onSaveComplete,
}: UseContactSaveProps) {
  const [isSaving, setIsSaving] = useState(false);

  const saveExistingContact = useCallback(
    async (editedContact: CreateCustomerContactInput) => {
      if (!customerId || !contactId || isNewContact) return;

      setIsSaving(true);
      try {
        if (editedContact.isPrimary) {
          const currentPrimaryContact = localContacts.find(
            (c, i) =>
              i !== currentIndex &&
              c.isPrimary &&
              c.id &&
              !c.id.toString().startsWith("temp-")
          );

          if (currentPrimaryContact?.id) {
            await updateContactMutation.mutateAsync({
              customerId,
              contactId: currentPrimaryContact.id,
              data: { ...currentPrimaryContact, isPrimary: false },
            });
          }
        }

        const result = await updateContactMutation.mutateAsync({
          customerId,
          contactId,
          data: {
            name: editedContact.name,
            email: editedContact.email,
            phone: editedContact.phone,
            role: editedContact.role,
            jobTitle: editedContact.jobTitle,
            isPrimary: editedContact.isPrimary,
          },
        });

        if ("statusCode" in result && result.statusCode !== 200) {
          toast.error("Failed to update contact");
          return;
        }

        toast.success("Contact updated successfully");
        await reloadContacts();
        onSaveComplete();
      } catch (error) {
        toast.error("Error updating contact");
      } finally {
        setIsSaving(false);
      }
    },
    [
      customerId,
      contactId,
      isNewContact,
      localContacts,
      currentIndex,
      updateContactMutation,
      reloadContacts,
      onSaveComplete,
    ]
  );

  return {
    isSaving,
    saveExistingContact,
  };
}