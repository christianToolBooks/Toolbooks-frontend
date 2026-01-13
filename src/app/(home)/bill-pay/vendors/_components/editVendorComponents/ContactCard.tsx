"use client"

import { useState, useCallback, memo, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Switch } from "@/src/components/ui/switch"
import { Save, X, Edit, Trash2, User } from "lucide-react"
import { InputPhoneContactCard } from "./InputPhoneContactCard"
import type { CreateVendorContactInput } from "@/src/types/vendorsTypes"
import type { UseMutationResult } from "@tanstack/react-query"
import type { ApiResponse } from "@/src/api/apiResponse"
import type { ErrorResponse } from "@/src/api/errorResponse"
import { DeleteContactDialog } from "../../dialogs/deleteContactDialog"

type DeleteContactMutation = UseMutationResult<
  ApiResponse<void>,
  ErrorResponse,
  {
    vendorId: string
    contactId: string
    contactIndex: number
    localContacts: CreateVendorContactInput[]
    setLocalContacts: (contacts: CreateVendorContactInput[]) => void
    reloadContacts: () => Promise<void>
  },
  { previousContacts: CreateVendorContactInput[] }
>

type CreateContactMutation = UseMutationResult<
  ApiResponse<CreateVendorContactInput> | ErrorResponse,
  Error,
  {
    vendorId: string
    contact: CreateVendorContactInput
  },
  unknown
>

type UpdateContactMutation = UseMutationResult<
  ApiResponse<CreateVendorContactInput>,
  ErrorResponse,
  {
    vendorId: string
    contactId: string
    data: Partial<CreateVendorContactInput>
  },
  unknown
>

type Props = {
  contact: CreateVendorContactInput
  index: number
  editingIndex: number | null
  setEditingIndex: (i: number | null) => void
  localContacts: CreateVendorContactInput[]
  setLocalContacts: (c: CreateVendorContactInput[]) => void
  vendorId?: string
  reloadContacts: () => Promise<void>
  createContact: CreateContactMutation
  updateContact: UpdateContactMutation
  onSave: (contact: CreateVendorContactInput, index: number) => void
  isReloading: boolean
  onDelete?: (contact: CreateVendorContactInput, index: number) => void | Promise<void>
  deleteContact: DeleteContactMutation
  onFieldChange?: (index: number, field: keyof CreateVendorContactInput, value: string | boolean) => void
}

function ContactCardComponent({
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
}: Props) {
  const [editingData, setEditingData] = useState<CreateVendorContactInput | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isNewContact, setIsNewContact] = useState(false)

  const isEditing = editingIndex === index
  const isSaving = createContact.isPending || updateContact.isPending || isReloading

  useEffect(() => {
    const contactId = contact.id?.toString();
    setIsNewContact(!contactId || contactId.startsWith('temp-'));
  }, [contact.id])

  useEffect(() => {
    if (isEditing) {
      setEditingData({ ...contact })
    } else {
      setEditingData(null)
    }
  }, [isEditing, contact])

  const startEdit = useCallback(() => {
    setEditingIndex(index)
    setEditingData({ ...contact })
  }, [index, contact, setEditingIndex])

  const cancelEdit = useCallback(() => {
    const contactId = contact.id?.toString();
    const isTempContact = !contactId || contactId.startsWith('temp-');
    
    if (isTempContact) {
      const updated = localContacts.filter((_, i) => i !== index)
      setLocalContacts(updated)
    }
    
    setEditingIndex(null)
    setEditingData(null)
  }, [contact.id, index, localContacts, setLocalContacts, setEditingIndex])

  const saveContact = useCallback(() => {
    if (!editingData) return
    onSave(editingData, index)
    cancelEdit()
  }, [editingData, index, onSave, cancelEdit])

  const updateField = useCallback(
    <K extends keyof CreateVendorContactInput>(field: K, value: CreateVendorContactInput[K]) => {
      if (!editingData) return
      setEditingData((prev) => (prev ? { ...prev, [field]: value } : null))
    },
    [editingData],
  )

  const handleDelete = useCallback(() => {
    if (onDelete) {
      const result = onDelete(contact, index)
      if (result instanceof Promise) {
        result.catch((error) => {
          console.error("Error deleting contact:", error)
        })
      }
    } else {
      const updated = localContacts.filter((_, i) => i !== index)
      setLocalContacts(updated)
      if (editingIndex === index) {
        setEditingIndex(null)
      }
    }
    setShowDeleteDialog(false)
  }, [onDelete, index, contact, localContacts, setLocalContacts, editingIndex, setEditingIndex])

  const openDeleteDialog = useCallback(() => {
    setShowDeleteDialog(true)
  }, [])

  const contactId = contact.id?.toString();
  const buttonText = (!contactId || contactId.startsWith('temp-')) ? "Discard" : "Cancel";

  return (
    <>
      <div className="p-3 sm:p-4 bg-secondary/30 rounded-lg space-y-3">
        {isEditing ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              <div className="space-y-1">
                <Label className="text-xs sm:text-sm">Name</Label>
                <Input
                  value={editingData?.name ?? ""}
                  onChange={(e) => updateField("name", e.target.value)}
                  disabled={isSaving}
                  className="text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs sm:text-sm">Email</Label>
                <Input
                  value={editingData?.email ?? ""}
                  onChange={(e) => updateField("email", e.target.value)}
                  disabled={isSaving}
                  className="text-sm"
                />
              </div>
              <InputPhoneContactCard
                value={editingData?.phone ?? ""}
                onChange={(val) => updateField("phone", val)}
                disabled={isSaving}
              />
              <div className="space-y-1">
                <Label className="text-xs sm:text-sm">Role</Label>
                <Input
                  value={editingData?.role ?? ""}
                  onChange={(e) => updateField("role", e.target.value)}
                  disabled={isSaving}
                  className="text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs sm:text-sm">Job Title</Label>
                <Input
                  value={editingData?.jobTitle ?? ""}
                  onChange={(e) => updateField("jobTitle", e.target.value)}
                  disabled={isSaving}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Switch
                  checked={!!editingData?.isPrimary}
                  onCheckedChange={(checked) => updateField("isPrimary", checked)}
                  disabled={isSaving}
                />
                Is Primary
              </div>
              <div className="flex gap-2">
                <Button onClick={saveContact} size="sm" className="bg-chart-1 flex-1 sm:flex-none" disabled={isSaving}>
                  <Save className="h-4 w-4 mr-1" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button
                  onClick={cancelEdit}
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none bg-transparent"
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-1" /> 
                  {buttonText}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center gap-2">
                <div className="flex gap-2 sm:gap-4 flex-1 min-w-0">
                  <User className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="flex flex-col gap-2 flex-1 min-w-0 lg:hidden">
                    <div className="space-y-1">
                      <p className="font-medium text-sm break-words">{contact.name || "—"}</p>
                      {contact.isPrimary && <span className="text-xs text-primary font-medium">Primary Contact</span>}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground break-all">{contact.email || "—"}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{contact.phone || "—"}</p>
                    <div className="flex gap-2 text-xs sm:text-sm text-muted-foreground">
                      <span>{contact.role || "—"}</span>
                      {contact.role && contact.jobTitle && <span>•</span>}
                      <span>{contact.jobTitle || "—"}</span>
                    </div>
                  </div>
                  <div className="hidden lg:grid lg:grid-cols-5 gap-4 flex-1 min-w-0">
                    <p className="font-medium text-sm break-words">{contact.name || "—"}</p>
                    <p className="text-sm text-muted-foreground break-all">{contact.email || "—"}</p>
                    <p className="text-sm text-muted-foreground">{contact.phone || "—"}</p>
                    <p className="text-sm text-muted-foreground break-words">{contact.role || "—"}</p>
                    <p className="text-sm text-muted-foreground break-words">{contact.jobTitle || "—"}</p>
                  </div>
                </div>
                <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                  <Button
                    onClick={startEdit}
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent"
                    disabled={isSaving}
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    onClick={openDeleteDialog}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 sm:h-9 sm:w-9 text-red-500 hover:text-red-700 hover:bg-red-50"
                    disabled={isSaving}
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
              {contact.isPrimary && (
                <div className="hidden lg:block text-xs text-primary font-medium ml-8">Primary Contact</div>
              )}
            </div>
          </>
        )}
      </div>

      <DeleteContactDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        contactName={contact.name}
      />
    </>
  )
}

export default memo(ContactCardComponent)
