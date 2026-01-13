import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import type { CreateCustomerContactInput } from "@/src/types/customer";
import { getCustomerById } from "@/src/lib/services/customersServices";
import type { UseMutationResult } from "@tanstack/react-query";
import type { ApiResponse } from "@/src/api/apiResponse";
import type { ErrorResponse } from "@/src/api/errorResponse";

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

interface UseCustomerContactsProps {
  customerId?: string;
  initialContacts: CreateCustomerContactInput[];
  createContactMutation: CreateContactMutation;
  updateContactMutation: UpdateContactMutation;
  deleteContactMutation: DeleteContactMutation;
  onContactsReloaded?: (contacts: CreateCustomerContactInput[]) => void;
}

export function useCustomerContacts({
  customerId,
  initialContacts,
  createContactMutation,
  updateContactMutation,
  deleteContactMutation,
  onContactsReloaded,
}: UseCustomerContactsProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const [isReloading, setIsReloading] = useState(false);

  const reloadContacts = useCallback(async () => {
    if (!customerId) return;

    try {
      const customer = await getCustomerById(customerId);

      if ("statusCode" in customer) {
        toast.error("Error reloading contacts");
        return;
      }

      if (customer && customer.contacts) {
        const updatedContacts = customer.contacts as CreateCustomerContactInput[];
        onContactsReloaded?.(updatedContacts);
      }
    } catch (error) {
      console.error("Error reloading contacts:", error);
      toast.error("Error reloading contacts");
    }
  }, [customerId, onContactsReloaded]);

  const handleAddContact = useCallback(() => {
    const tempId = `temp-${Date.now()}`;
    const newContact: CreateCustomerContactInput = {
      id: tempId,
      name: "",
      email: "",
      phone: "",
      role: "",
      jobTitle: "",
      isPrimary: false,
    };
    onContactsReloaded?.([...initialContacts, newContact]);
    setEditingIndex(initialContacts.length);
  }, [initialContacts, onContactsReloaded]);

  const handleFieldChange = useCallback(
    (index: number, field: keyof CreateCustomerContactInput, value: string | boolean) => {
      const updated = [...initialContacts];
      updated[index] = { ...updated[index], [field]: value };
      onContactsReloaded?.(updated);
    },
    [initialContacts, onContactsReloaded]
  );

  const handleSaveNewContact = useCallback(
    async (contact: CreateCustomerContactInput, index: number) => {
      if (!customerId) {
        toast.error("Customer ID is required");
        return;
      }

      const isNewContact = !contact.id || contact.id.toString().startsWith("temp-");
      if (!isNewContact) {
        console.warn("Attempted to save existing contact, ignoring");
        return;
      }

      if (!contact.name || !contact.email) {
        toast.error("Please fill all required contact fields");
        return;
      }

      setSavingIndex(index);

      try {
        if (contact.isPrimary) {
          const currentPrimary = initialContacts.find(
            (c, i) => i !== index && c.isPrimary && c.id && !c.id.toString().startsWith("temp-")
          );

          if (currentPrimary?.id) {
            await updateContactMutation.mutateAsync({
              customerId,
              contactId: currentPrimary.id,
              data: { ...currentPrimary, isPrimary: false },
            });
          }
        }

        const response = await createContactMutation.mutateAsync({
          customerId,
          contact,
        });

        if ("code" in response && (response.code === 201 || response.code === 200)) {
          toast.success("Contact created successfully");
        } else if ("statusCode" in response && response.statusCode !== 201 && response.statusCode !== 200) {
          toast.error(response.message || "Error creating contact");
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsReloading(true);
        await reloadContacts();
        setEditingIndex(null);
      } catch (error) {
        console.error("Error saving contact:", error);
        toast.error("Error saving contact");
      } finally {
        setIsReloading(false);
        setSavingIndex(null);
      }
    },
    [customerId, initialContacts, createContactMutation, updateContactMutation, reloadContacts]
  );

  const handleUpdateContact = useCallback(
    async (contact: CreateCustomerContactInput) => {
      if (!customerId || !contact.id) return;

      try {
        if (contact.isPrimary) {
          const currentPrimary = initialContacts.find(
            (c) => c.id !== contact.id && c.isPrimary && c.id && !c.id.toString().startsWith("temp-")
          );

          if (currentPrimary?.id) {
            await updateContactMutation.mutateAsync({
              customerId,
              contactId: currentPrimary.id,
              data: { ...currentPrimary, isPrimary: false },
            });
          }
        }

        const result = await updateContactMutation.mutateAsync({
          customerId,
          contactId: contact.id,
          data: {
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            role: contact.role,
            jobTitle: contact.jobTitle,
            isPrimary: contact.isPrimary,
          },
        });

        if ("statusCode" in result && result.statusCode !== 200) {
          toast.error("Failed to update contact");
          return false;
        }

        toast.success("Contact updated successfully");
        await reloadContacts();
        return true;
      } catch (error) {
        console.error("Error updating contact:", error);
        toast.error("Error updating contact");
        return false;
      }
    },
    [customerId, initialContacts, updateContactMutation, reloadContacts]
  );

  const handleDeleteContact = useCallback(
    async (contact: CreateCustomerContactInput, index: number) => {
      if (contact.id && customerId) {
        await deleteContactMutation.mutateAsync({
          customerId,
          contactId: contact.id,
          contactIndex: index,
          localContacts: initialContacts,
          setLocalContacts: onContactsReloaded || (() => {}),
          reloadContacts,
        });
      } else {
        const updated = initialContacts.filter((_, i) => i !== index);
        onContactsReloaded?.(updated);
      }
    },
    [customerId, deleteContactMutation, initialContacts, reloadContacts, onContactsReloaded]
  );

  const primaryContact = useMemo(
    () => initialContacts.find((c) => c.isPrimary === true),
    [initialContacts]
  );

  const primaryContactIndex = useMemo(
    () => initialContacts.findIndex((c) => c.isPrimary === true),
    [initialContacts]
  );

  const isAnyMutationPending =
    createContactMutation.isPending ||
    updateContactMutation.isPending ||
    deleteContactMutation.isPending ||
    isReloading;

  return {
    localContacts: initialContacts,
    setLocalContacts: onContactsReloaded || (() => {}),
    editingIndex,
    setEditingIndex,
    savingIndex,
    isReloading,
    primaryContact,
    primaryContactIndex,
    isAnyMutationPending,
    handleAddContact,
    handleFieldChange,
    handleSaveNewContact,
    handleUpdateContact,
    handleDeleteContact,
    reloadContacts,
  };
}