"use client"

import { useState, useCallback, memo } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Switch } from "@/src/components/ui/switch"
import { Save, X, Loader2 } from "lucide-react"
import { InputPhoneContactCard } from "../../bill-pay/vendors/_components/editVendorComponents/InputPhoneContactCard"
import type { CreateCustomerContactInput } from "@/src/types/customer"
import type { UseMutationResult } from "@tanstack/react-query"
import type { ApiResponse } from "@/src/api/apiResponse"
import type { ErrorResponse } from "@/src/api/errorResponse"
import { DeleteContactDialog } from "../../bill-pay/vendors/dialogs/deleteContactDialog"
import { useItemEditing } from "../hooks/useItemEditing"
import { usePrimaryLogic } from "../hooks/usePrimaryLogic"
import CustomerContactCardView from "./CustomerContactCardView"
import { useContactSave } from "../hooks/useContactSave"

type DeleteContactMutation = UseMutationResult<
  ApiResponse<void>,
  ErrorResponse,
  {
    customerId: string
    contactId: string
    contactIndex: number
    localContacts: CreateCustomerContactInput[]
    setLocalContacts: (contacts: CreateCustomerContactInput[]) => void
    reloadContacts: () => Promise<void>
  },
  { previousContacts: CreateCustomerContactInput[] }
>

type CreateContactMutation = UseMutationResult<
  ApiResponse<CreateCustomerContactInput> | ErrorResponse,
  Error,
  {
    customerId: string
    contact: CreateCustomerContactInput
  },
  unknown
>

type UpdateContactMutation = UseMutationResult<
  ApiResponse<CreateCustomerContactInput>,
  ErrorResponse,
  {
    customerId: string
    contactId: string
    data: Partial<CreateCustomerContactInput>
  },
  unknown
>

type Props = {
  contact: CreateCustomerContactInput
  index: number
  editingIndex: number | null
  setEditingIndex: (i: number | null) => void
  localContacts: CreateCustomerContactInput[]
  setLocalContacts: (c: CreateCustomerContactInput[]) => void
  customerId?: string
  reloadContacts: () => Promise<void>
  createContact: CreateContactMutation
  updateContact: UpdateContactMutation
  onSave: (contact: CreateCustomerContactInput, index: number) => void
  isReloading: boolean
  onDelete?: (contact: CreateCustomerContactInput, index: number) => void | Promise<void>
  deleteContact: DeleteContactMutation
  onFieldChange?: (index: number, field: keyof CreateCustomerContactInput, value: string | boolean) => void
}

function CustomerContactCardComponent({
  contact,
  index,
  editingIndex,
  setEditingIndex,
  localContacts,
  setLocalContacts,
  createContact,
  updateContact,
  onSave,
  isReloading,
  onDelete,
  onFieldChange,
  customerId,
  reloadContacts,
}: Props) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const {
    editingData,
    isNewItem: isNewContact,
    isEditing,
    startEdit,
    cancelEdit,
    updateField: baseUpdateField,
  } = useItemEditing(
    contact,
    index,
    editingIndex,
    localContacts,
    setLocalContacts,
    setEditingIndex
  )

  const { isPrimaryDisabled, updatePrimary } = usePrimaryLogic(
    localContacts,
    index,
    "isPrimary"
  )

  const { isSaving: isSavingExisting, saveExistingContact } = useContactSave({
    customerId,
    contactId: contact.id,
    isNewContact,
    localContacts,
    currentIndex: index,
    updateContactMutation: updateContact,
    reloadContacts,
    onSaveComplete: () => setEditingIndex(null),
  })

  const isSaving = createContact.isPending || updateContact.isPending || isReloading

  const updateField = useCallback(
    <K extends keyof CreateCustomerContactInput>(field: K, value: CreateCustomerContactInput[K]) => {
      if (field === "isPrimary" && value === true) {
        updatePrimary(
          true, 
          (updatedContacts) => {
            setLocalContacts(updatedContacts);
            if (onFieldChange) {
              updatedContacts.forEach((c, i) => {
                onFieldChange(i, 'isPrimary', c.isPrimary || false);
              });
            }
          },
          onFieldChange as ((index: number, field: string, value: boolean) => void) | undefined
        );
      }
      
      baseUpdateField(field, value);
      
      if (onFieldChange && value !== undefined) {
        onFieldChange(index, field as keyof CreateCustomerContactInput, value as string | boolean);
      }
    },
    [baseUpdateField, updatePrimary, setLocalContacts, onFieldChange, index]
  )

  const saveNewContact = useCallback(() => {
    if (!editingData) return
    onSave(editingData, index)
    cancelEdit()
  }, [editingData, index, onSave, cancelEdit])

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(contact, index)
    }
    setShowDeleteDialog(false)
  }, [onDelete, contact, index])

  if (!isEditing) {
    return (
      <>
        <CustomerContactCardView
          contact={contact}
          onEdit={startEdit}
          onDelete={() => setShowDeleteDialog(true)}
          disabled={isSaving}
        />

        <DeleteContactDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleDelete}
          contactName={contact.name || ""}
        />
      </>
    )
  }

  return (
    <>
      <div className="relative p-3 sm:p-4 bg-secondary/30 rounded-lg space-y-3">
        {!isNewContact && (
          <Button
            onClick={() => editingData && saveExistingContact(editingData)}
            disabled={isSavingExisting || isSaving}
            size="sm"
            className="absolute top-2 right-2 gap-1 h-8"
            variant="ghost"
          >
            {isSavingExisting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          </Button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 pr-12">
          <div className="space-y-1">
            <Label className="text-xs sm:text-sm">Name</Label>
            <Input value={editingData?.name ?? ""} onChange={(e) => updateField("name", e.target.value)} disabled={isSaving} className="text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs sm:text-sm">Email</Label>
            <Input value={editingData?.email ?? ""} onChange={(e) => updateField("email", e.target.value)} disabled={isSaving} className="text-sm" />
          </div>
          <InputPhoneContactCard value={editingData?.phone ?? ""} onChange={(val) => updateField("phone", val)} disabled={isSaving} />
          <div className="space-y-1">
            <Label className="text-xs sm:text-sm">Role</Label>
            <Input value={editingData?.role ?? ""} onChange={(e) => updateField("role", e.target.value)} disabled={isSaving} className="text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs sm:text-sm">Job Title</Label>
            <Input value={editingData?.jobTitle ?? ""} onChange={(e) => updateField("jobTitle", e.target.value)} disabled={isSaving} className="text-sm" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          {!isNewContact && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Switch
                  checked={!!editingData?.isPrimary}
                  onCheckedChange={(checked) => updateField("isPrimary", checked)}
                  disabled={isSaving || isPrimaryDisabled}
                />
                <span className={isPrimaryDisabled ? "text-muted-foreground" : ""}>Is Primary</span>
              </div>
              {isPrimaryDisabled && (
                <p className="text-xs text-amber-600 ml-10">You already have a primary contact</p>
              )}
            </div>
          )}
          
          {isNewContact && <div />}
          
          <div className="flex gap-2">
            {isNewContact && (
              <Button onClick={saveNewContact} size="sm" className="bg-chart-1 flex-1 sm:flex-none" disabled={isSaving}>
                <Save className="h-4 w-4 mr-1" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            )}
            <Button onClick={cancelEdit} variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent" disabled={isSaving || isSavingExisting}>
              <X className="h-4 w-4 mr-1" />
              {isNewContact ? "Discard" : "Cancel"}
            </Button>
          </div>
        </div>
      </div>

      <DeleteContactDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        contactName={contact.name || ""}
      />
    </>
  )
}

export default memo(CustomerContactCardComponent)
