/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import type { CreateVendorAddressInput } from "@/src/types/vendorsTypes";
import AddressCard from "./AddressCard";
import { UseMutationResult } from "@tanstack/react-query";
import { ApiResponse } from "@/src/api/apiResponse";
import { ErrorResponse } from "@/src/api/errorResponse";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { AddressCardSkeleton } from "./AddressCardSkeleton";

// Tipo para campos editables (excluye metadata)
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

interface AddressListProps {
  vendorId?: string;
  type?: string;
  localAddresses: CreateVendorAddressInput[];
  setLocalAddresses: (addresses: CreateVendorAddressInput[]) => void;
  reloadAddresses: () => Promise<void>;
  createAddress: MutationType;
  updateAddress: MutationType;
  deleteAddress: DeleteAddressMutation;
  addresses: CreateVendorAddressInput[];
  addAddress: () => void;
  onAddressChange?: (index: number, field: keyof EditableAddressFields, value: any) => void;
  onRemoveAddress?: (index: number) => void;
}

export default function AddressList({
  vendorId,
  type,
  localAddresses,
  setLocalAddresses,
  reloadAddresses,
  createAddress,
  deleteAddress,
  updateAddress,
  addresses,
  addAddress,
  onAddressChange,
  onRemoveAddress,
}: AddressListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const [isReloading, setIsReloading] = useState(false);

  const sortedAddresses = [...(localAddresses ?? [])].sort((a, b) => {
    if (a.isDefault) return -1;
    if (b.isDefault) return 1;
    return 0;
  });
 const handleAddAddress = useCallback(() => {
    const tempId = `temp-${Date.now()}`;
    const newAddress: CreateVendorAddressInput = {
      id: tempId,
      type: "billed_from",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      isDefault: (localAddresses?.length ?? 0) === 0,
    };
    setLocalAddresses?.([...(localAddresses ?? []), newAddress]);
    setEditingIndex((localAddresses?.length ?? 0));
  }, [localAddresses, setLocalAddresses]);

  const handleSaveAddress = useCallback(async (address: CreateVendorAddressInput, index: number) => {
    if (!vendorId ) return;
    setSavingIndex(index);
    try {
      if (address.id?.toString().startsWith('temp-')) {
        await createAddress.mutateAsync({ vendorId, address });
      } else if (address.id) {
        await updateAddress.mutateAsync({ 
          vendorId,
          addressId: address.id,
          data: address 
        });
      }
      setIsReloading(true);
      await reloadAddresses();
      toast.success("Address saved successfully");
  } catch (error) {
    console.error('Error saving address:', error);
      toast.error('Error saving address');
  } finally {
    setSavingIndex(null);
    setIsReloading(false);
  }
}, [vendorId, createAddress, updateAddress, reloadAddresses]);

const handleDeleteAddress = useCallback((address: CreateVendorAddressInput, index: number) => {
  if (!vendorId) return;

  deleteAddress.mutate({
    vendorId,
    addressId: address.id || '',
    addressIndex: index,
    localAddresses,
    setLocalAddresses,
    reloadAddresses,
  });
}, [vendorId, deleteAddress, localAddresses, setLocalAddresses, reloadAddresses]);

 const skeletonIndexes = useMemo(() => {
    const indexes = new Set<number>();

    if (savingIndex !== null && (createAddress.isPending || updateAddress.isPending || isReloading)) {
      indexes.add(savingIndex);
    }

    if (deleteAddress.isPending && deleteAddress.variables?.addressIndex !== undefined) {
      indexes.add(deleteAddress.variables.addressIndex);
  }
    
    return indexes;
  }, [
    savingIndex, 
    createAddress.isPending, 
    updateAddress.isPending, 
    isReloading, 
    deleteAddress.isPending, 
    deleteAddress.variables
  ]);

  const addressComponents = useMemo(() => {
    return sortedAddresses.map((address, index) => {
      const shouldShowSkeleton = skeletonIndexes.has(index);
      
      if (shouldShowSkeleton) {
        return <AddressCardSkeleton key={`saving-${address.id}-${index}`} />;
      }

      return (
        <AddressCard
          key={address.id?.toString() || `address-${index}`}
          address={address}
          index={index}
          editingIndex={editingIndex}
          setEditingIndex={setEditingIndex}
          localAddresses={localAddresses}
          setLocalAddresses={setLocalAddresses  }
          vendorId={vendorId}
          reloadAddresses={reloadAddresses}
          onSave={handleSaveAddress}
          onDelete={handleDeleteAddress}
          createAddress={createAddress}
          updateAddress={updateAddress}
          deleteAddress={deleteAddress}
          isReloading={isReloading}
        />
      );
    });
  }, [
    sortedAddresses,
    skeletonIndexes, 
    editingIndex, 
    localAddresses, 
    vendorId, 
    reloadAddresses, 
    handleSaveAddress, 
    handleDeleteAddress,
    createAddress, 
    updateAddress,
    deleteAddress,
    isReloading,
    setLocalAddresses
  ]);


 const isAnyMutationPending = createAddress.isPending || updateAddress.isPending || deleteAddress.isPending || isReloading;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">All Addresses</h3>
        <Button type="button" variant="outline" size="sm" onClick={handleAddAddress} disabled={isAnyMutationPending}>
          <Plus className="h-4 w-4 mr-1" />
          Add address
        </Button>
      </div>

      <div className="space-y-2 ">
        {addressComponents}
      </div>
    </div>
  );
}
