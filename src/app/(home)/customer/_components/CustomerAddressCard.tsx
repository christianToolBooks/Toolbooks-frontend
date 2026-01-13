"use client";

import { useState, useCallback, useEffect, memo } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Save, X, Edit, Trash2, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { AddressInputWithAutocomplete } from "../../bill-pay/vendors/_components/shared/AddressInputWithAutocomplete";
import type { AddressDetails } from "@/src/hooks/useAddressAutoComplete";
import { CreateCustomerAddressInput} from "@/src/types/customer";
import { DeleteAddressDialog } from "./dialogs/deleteAddressDialog";
import { updateAddressById } from "@/src/lib/services/customersServices";
import { toast } from "sonner";

type EditableAddressFields = Omit<CreateCustomerAddressInput, 'id' | 'createdAt' | 'updatedAt'>;

interface CustomerAddressCardProps {
  address: CreateCustomerAddressInput;
  index: number;
  editingIndex: number | null;
  setEditingIndex: (index: number | null) => void;
  localAddresses: CreateCustomerAddressInput[];
  setLocalAddresses: (addresses: CreateCustomerAddressInput[]) => void;
  customerId: string;
  updateAddress: (index: number, field: keyof EditableAddressFields, value: string | boolean | number) => void;
  removeAddress: (index: number) => void;
  onAddressesReloaded?: (addresses: CreateCustomerAddressInput[]) => void;
  onSave: (address: CreateCustomerAddressInput, index: number) => void;
  onDelete: (address: CreateCustomerAddressInput, index: number) => void;
  isReloading: boolean;
}

function CustomerAddressCardComponent({
  address,
  index,
  editingIndex,
  setEditingIndex,
  localAddresses,
  setLocalAddresses,
  updateAddress,
  onSave,
  onDelete,
  isReloading,
  customerId,
}: CustomerAddressCardProps) {
  const [editingData, setEditingData] = useState<CreateCustomerAddressInput | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const isNewAddress = !address.id || address.id.toString().startsWith('temp-');
  const isEditing = editingIndex === index;
  const isSaving = isReloading;
  const hasDefaultAddress = localAddresses.some((a, i) => i !== index && a.isDefault);
  const isDefaultDisabled = hasDefaultAddress && !editingData?.isDefault;

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

    updateAddress(index, "line1", updatedAddress.line1 || "");
    updateAddress(index, "city", updatedAddress.city || "");
    updateAddress(index, "state", updatedAddress.state || "");
    updateAddress(index, "postalCode", updatedAddress.postalCode || "");
    updateAddress(index, "country", updatedAddress.country || "US");
    if (updatedAddress.latitude !== undefined) {
      updateAddress(index, "latitude", updatedAddress.latitude);
    }
    if (updatedAddress.longitude !== undefined) {
      updateAddress(index, "longitude", updatedAddress.longitude);
    }
  }, [editingData, index, updateAddress]);

  const startEdit = useCallback(() => {
    setEditingIndex(index);
  }, [index, setEditingIndex]);

  const cancelEdit = useCallback(() => {
    if (isNewAddress) {
      const updated = localAddresses.filter((_, i) => i !== index);
      setLocalAddresses(updated);
    }
    
    setEditingIndex(null);
    setEditingData(null);
  }, [isNewAddress, index, localAddresses, setLocalAddresses, setEditingIndex]);

  const saveAddress = useCallback(() => {
    if (!editingData) return;
    onSave(editingData, index);
  }, [editingData, index, onSave]);

  const handleSaveExistingAddress = useCallback(async () => {
    if (!editingData || !customerId || !address.id || isNewAddress) return;

    setIsSavingAddress(true);
    try {
      const result = await updateAddressById(customerId, address.id, {
        type: editingData.type,
        line1: editingData.line1,
        line2: editingData.line2,
        city: editingData.city,
        state: editingData.state,
        postalCode: editingData.postalCode,
        country: editingData.country,
        isDefault: editingData.isDefault,
      });

      if ("statusCode" in result && result.statusCode !== 200) {
        toast.error("Failed to update address");
        return;
      }

      toast.success("Address updated successfully");
      setEditingIndex(null);
      setEditingData(null);
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Error updating address");
    } finally {
      setIsSavingAddress(false);
    }
  }, [editingData, customerId, address.id, isNewAddress, setEditingIndex]);

  const updateField = useCallback(
    <K extends keyof EditableAddressFields>(
      field: K,
      value: EditableAddressFields[K]
    ) => {
      if (!editingData) return;
      
      if (field === 'isDefault' && value === true && !isDefaultDisabled) {
        const updatedAddresses = localAddresses.map((addr, i) => {
          const shouldBeDefault = i === index;
          console.log(`Address ${i} (ID: ${addr.id}): isDefault = ${shouldBeDefault}`);
          return {
            ...addr,
            isDefault: shouldBeDefault
          };
        });
        
        setLocalAddresses(updatedAddresses);
        updatedAddresses.forEach((addr, i) => {
          updateAddress(i, 'isDefault', addr.isDefault);
        });
      }
      
      setEditingData((prev) => (prev ? { ...prev, [field]: value } : null));
      updateAddress(index, field, value as string | boolean | number);
    },
    [editingData, index, updateAddress, localAddresses, setLocalAddresses, isDefaultDisabled]
  );

  const handleDelete = useCallback(() => {
    onDelete(address, index);
    setShowDeleteDialog(false);
  }, [onDelete, address, index]);

  const openDeleteDialog = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  return (
    <>
      <div className="relative p-4 bg-secondary/30 rounded-lg space-y-3">
        {isEditing ? (
          <>
            {!isNewAddress && (
              <Button
                onClick={handleSaveExistingAddress}
                disabled={isSavingAddress || isSaving}
                size="sm"
                className="absolute top-2 right-2 gap-1 h-8"
                variant="ghost"
              >
                {isSavingAddress ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pr-12">
              <div className="sm:col-span-2">
                <AddressInputWithAutocomplete
                  value={editingData?.line1 ?? ""}
                  onChange={(value) => updateField("line1", value)}
                  onAddressSelect={handleAddressSelect}
                  disabled={isSaving}
                  label="Address Line 1 *"
                  placeholder="Start typing address..."
                />
              </div>

              <div className="sm:col-span-2 space-y-2">
                <Label>Address Line 2</Label>
                <Input
                  value={editingData?.line2 ?? ""}
                  onChange={(e) => updateField("line2", e.target.value)}
                  placeholder="Apt, suite, etc."
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label>City *</Label>
                <Input
                  value={editingData?.city ?? ""}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="City"
                  required
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label>State *</Label>
                <Input
                  value={editingData?.state ?? ""}
                  onChange={(e) => updateField("state", e.target.value)}
                  placeholder="State"
                  required
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label>Postal Code *</Label>
                <Input
                  value={editingData?.postalCode ?? ""}
                  onChange={(e) => updateField("postalCode", e.target.value)}
                  placeholder="ZIP/Postal Code"
                  required
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label>Country *</Label>
                <Select
                  value={editingData?.country ?? "US"}
                  onValueChange={(value) => updateField("country", value)}
                  disabled={isSaving}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="MX">Mexico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Address Type</Label>
                <Select
                  value={editingData?.type ?? "billed_from"}
                  onValueChange={(value) => updateField("type", value as EditableAddressFields["type"])}
                  disabled={isSaving}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="billed_from">Billed From</SelectItem>
                    <SelectItem value="shipped_from">Shipped From</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {!isNewAddress && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!!editingData?.isDefault}
                      onCheckedChange={(checked) => updateField("isDefault", checked)}
                      disabled={isSaving || isDefaultDisabled}
                    />
                    <span className={isDefaultDisabled ? "text-muted-foreground text-sm" : "text-sm"}>
                      Default Address
                    </span>
                  </div>
                  {isDefaultDisabled && (
                    <p className="text-xs text-amber-600 ml-10">
                      You already have a default address
                    </p>
                  )}
                </div>
              )}
              
              {isNewAddress && <div />}
              
              <div className="flex gap-2">
                {isNewAddress && (
                  <Button
                    onClick={saveAddress}
                    size="sm"
                    className="bg-chart-1"
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                )}
                
                <Button
                  onClick={cancelEdit}
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                  disabled={isSaving || isSavingAddress}
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
                <p className="text-sm font-medium text-muted-foreground">Postal Code</p>
                <p className="text-sm">{address.postalCode || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Country</p>
                <p className="text-sm">{address.country || "-"}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                {address.isDefault && (
                  <span className="text-xs font-medium text-primary">Default Address</span>
                )}
                <span className="text-xs text-muted-foreground">{address.type?.replace('_', ' ')}</span>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={startEdit} variant="outline" size="icon" className="h-8 w-8 bg-transparent" disabled={isSaving}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={openDeleteDialog} 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" 
                  disabled={isSaving}
                >
                  <Trash2 className="h-4 w-4" />
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
        addressLine1={address.line1 || "Unknown address"}
      />
    </>
  );
}

export default memo(CustomerAddressCardComponent);
