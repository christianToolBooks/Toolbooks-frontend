/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, memo, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Save, X, Edit, Trash2, MapPin } from "lucide-react";
import type { CreateVendorAddressInput } from "@/src/types/vendorsTypes";
import { UseMutationResult } from "@tanstack/react-query";
import { ApiResponse } from "@/src/api/apiResponse";
import { ErrorResponse } from "@/src/api/errorResponse";
import { DeleteAddressDialog } from "../../dialogs/deleteAddressDialog";
import { AddressInputWithAutocomplete } from "../shared/AddressInputWithAutocomplete";
import type { AddressDetails } from "@/src/hooks/useAddressAutoComplete";

// Tipo para campos editables
type EditableAddressFields = Omit<CreateVendorAddressInput, 'id' | 'vendorId' | 'createdAt' | 'updatedAt'>;

type DeleteAddressMutation = UseMutationResult<
  ApiResponse<void>,
  ErrorResponse,
  {
    vendorId: string;
    addressId: string;
    addressIndex: number;
    localAddresses: CreateVendorAddressInput[];
    setLocalAddresses: (addresses: CreateVendorAddressInput[]) => void;
    reloadAddresses: () => Promise<void>;
  },
  { previousAddresses: CreateVendorAddressInput[] }
>;

type MutationType = {
  mutateAsync: (variables: any) => Promise<any>;
  isPending: boolean;
};

type AddressCardProps = {
  address: CreateVendorAddressInput;
  index: number;
  editingIndex: number | null;
  setEditingIndex: (i: number | null) => void;
  localAddresses: CreateVendorAddressInput[];
  setLocalAddresses: (addresses: CreateVendorAddressInput[]) => void;
  vendorId?: string;
  reloadAddresses: () => Promise<void>;
  createAddress: MutationType;
  deleteAddress: DeleteAddressMutation;
  updateAddress: MutationType;
  onDelete?: (address: CreateVendorAddressInput, index: number) => void;
  onSave: (address: CreateVendorAddressInput, index: number) => void;
  isReloading: boolean;
  onFieldChange?: (index: number, field: keyof EditableAddressFields, value: string | boolean | number) => void;
};

function AddressCardComponent({
  address,
  index,
  editingIndex,
  setEditingIndex,
  localAddresses,
  setLocalAddresses,
  createAddress,
  updateAddress,
  onSave,
  isReloading,
  onDelete,
  onFieldChange,
}: AddressCardProps) {
  const [editingData, setEditingData] = useState<CreateVendorAddressInput | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isNewAddress, setIsNewAddress] = useState(false);

  const isEditing = editingIndex === index;
  const isSaving = createAddress.isPending || updateAddress.isPending || isReloading;

  useEffect(() => {
    if (address.id?.toString().startsWith('temp-')) {
      setIsNewAddress(true);
    } else {
      setIsNewAddress(false);
    }
  }, [address.id]);

  useEffect(() => {
    if (isEditing) {
      setEditingData({ ...address });
    } else {
      setEditingData(null);
    }
  }, [isEditing, address]);

  const handleAddressSelect = useCallback((addressDetails: AddressDetails) => {
    if (!editingData) return;

    const updatedAddress = {
      ...editingData,
      line1: addressDetails.address || editingData.line1,
      city: addressDetails.city || editingData.city,
      state: addressDetails.state || editingData.state,
      postalCode: addressDetails.zipCode || editingData.postalCode,
      country: addressDetails.country || editingData.country || "US",
      latitude: addressDetails.latitude,
      longitude: addressDetails.longitude,
    };

    setEditingData(updatedAddress);

    if (onFieldChange) {
      onFieldChange(index, "line1", updatedAddress.line1 || "");
      onFieldChange(index, "city", updatedAddress.city || "");
      onFieldChange(index, "state", updatedAddress.state || "");
      onFieldChange(index, "postalCode", updatedAddress.postalCode || "");
      onFieldChange(index, "country", updatedAddress.country || "US");
      if (updatedAddress.latitude !== undefined) {
        onFieldChange(index, "latitude", updatedAddress.latitude);
      }
      if (updatedAddress.longitude !== undefined) {
        onFieldChange(index, "longitude", updatedAddress.longitude);
      }
    }
  }, [editingData, index, onFieldChange]);

  const startEdit = useCallback(() => {
    setEditingIndex(index);
  }, [index, setEditingIndex]);

  const cancelEdit = useCallback(() => {
    if (isNewAddress && address.id?.toString().startsWith('temp-')) {
      const updated = localAddresses.filter((_, i) => i !== index);
      setLocalAddresses(updated);
    }
    
    setEditingIndex(null);
    setEditingData(null);
  }, [isNewAddress, address.id, index, localAddresses, setLocalAddresses, setEditingIndex]);

  const saveAddress = useCallback(() => {
    if (!editingData) return;
    onSave(editingData, index);
    cancelEdit();
  }, [editingData, index, onSave, cancelEdit]);

  const updateField = useCallback(
    <K extends keyof EditableAddressFields>(
      field: K,
      value: EditableAddressFields[K]
    ) => {
      if (!editingData) return;
      
      setEditingData((prev) => (prev ? { ...prev, [field]: value } : null));
      
      if (onFieldChange) {
        onFieldChange(index, field, value as string | boolean | number);
      }
    },
    [editingData, index, onFieldChange]
  );

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(address, index);
    } else {
      const updated = localAddresses.filter((_, i) => i !== index);
      setLocalAddresses(updated);
      if (editingIndex === index) {
        setEditingIndex(null);
      }
    }
    setShowDeleteDialog(false);
  }, [
    onDelete,
    index,
    address,
    localAddresses,
    setLocalAddresses,
    editingIndex,
    setEditingIndex,
  ]);

  const openDeleteDialog = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  return (
    <>
      <div className="p-3 sm:p-4 bg-secondary/30 rounded-lg space-y-3">
        {isEditing ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="sm:col-span-2">
                <AddressInputWithAutocomplete
                  value={editingData?.line1 ?? ""}
                  onChange={(value) => updateField("line1", value)}
                  onAddressSelect={handleAddressSelect}
                  disabled={isSaving}
                  label="Address Line 1"
                  placeholder="Start typing address..."
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs sm:text-sm">Address Line 2 (Optional)</Label>
                <Input
                  value={editingData?.line2 ?? ""}
                  onChange={(e) => updateField("line2", e.target.value)}
                  disabled={isSaving}
                  placeholder="Apt, suite, etc."
                  className="text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs sm:text-sm">City</Label>
                <Input
                  value={editingData?.city ?? ""}
                  onChange={(e) => updateField("city", e.target.value)}
                  disabled={isSaving}
                  placeholder="City"
                  className="text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs sm:text-sm">State</Label>
                <Input
                  value={editingData?.state ?? ""}
                  onChange={(e) => updateField("state", e.target.value)}
                  disabled={isSaving}
                  placeholder="State"
                  className="text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs sm:text-sm">Postal Code</Label>
                <Input
                  value={editingData?.postalCode ?? ""}
                  onChange={(e) => updateField("postalCode", e.target.value)}
                  disabled={isSaving}
                  placeholder="ZIP/Postal"
                  className="text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs sm:text-sm">Country</Label>
                <Input
                  value={editingData?.country ?? ""}
                  onChange={(e) => updateField("country", e.target.value)}
                  disabled={isSaving}
                  placeholder="Country"
                  className="text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={!!editingData?.isDefault}
                  onCheckedChange={() => updateField("isDefault", !editingData?.isDefault)}
                  disabled={isSaving}
                />
                <span className="text-sm">Default</span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={saveAddress}
                  size="sm"
                  className="bg-chart-1 flex-1 sm:flex-none"
                  disabled={isSaving}
                >
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
                  {isNewAddress ? "Discard" : "Cancel"}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Line 1</p>
                <p className="text-sm">{address.line1 || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Line 2</p>
                <p className="text-sm">{address.line2 || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">City</p>
                <p className="text-sm">{address.city || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">State</p>
                <p className="text-sm">{address.state || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Postal code
                </p>
                <p className="text-sm">{address.postalCode || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Country</p>
                <p className="text-sm">{address.country || "-"}</p>
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
          </>
        )}
      </div>
      
      <DeleteAddressDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        addressLine1={address.line1 || ""}
      />
    </>
  );
}

export default memo(AddressCardComponent);