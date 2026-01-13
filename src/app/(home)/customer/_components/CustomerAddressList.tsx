/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Plus, MapPin } from "lucide-react";
import type { CreateCustomerAddressInput } from "@/src/types/customer";
import CustomerAddressCard from "./CustomerAddressCard";
import { useCreateCustomerAddress } from "../hooks/useCreateCustomerAddress";
import { useUpdateCustomerAddress } from "../hooks/useUpdateCustomerAddress";
import { useDeleteCustomerAddress } from "../hooks/useDeleteCustomerAddress";
import { toast } from "sonner";
import { getCustomerById } from "@/src/lib/services/customersServices";
import { Skeleton } from "@/src/components/ui/skeleton";

type EditableAddressFields = Omit<CreateCustomerAddressInput, 'id' | 'createdAt' | 'updatedAt'>;

interface CustomerAddressListProps {
  customerId: string;
  addresses: CreateCustomerAddressInput[];
  addAddress: () => void;
  updateAddress: (index: number, field: keyof EditableAddressFields, value: string | boolean | number) => void;
  removeAddress: (index: number) => void;
  onAddressesReloaded?: (addresses: CreateCustomerAddressInput[]) => void;
}

function AddressCardSkeleton() {
  return (
    <div className="p-3 bg-secondary/30 rounded-lg space-y-3 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24 bg-muted" />
            <Skeleton className="h-5 w-full bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CustomerAddressList({
  customerId,
  addresses,
  addAddress,
  updateAddress,
  removeAddress,
  onAddressesReloaded,
}: CustomerAddressListProps) {
  const [localAddresses, setLocalAddresses] = useState<CreateCustomerAddressInput[]>(addresses);
  const [editingAllAddressIndex, setEditingAllAddressIndex] = useState<number | null>(null);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const [isReloading, setIsReloading] = useState(false);

  const createAddressMutation = useCreateCustomerAddress();
  const updateAddressMutation = useUpdateCustomerAddress();
  const deleteAddressMutation = useDeleteCustomerAddress();

  useEffect(() => {
    setLocalAddresses(addresses);
  }, [addresses]);

  const defaultAddress = useMemo(() => {
    return localAddresses.find(a => a.isDefault === true);
  }, [localAddresses]);

  const defaultAddressIndex = useMemo(() => {
    return localAddresses.findIndex(a => a.isDefault === true);
  }, [localAddresses]);

  const allAddressesWithIndices = useMemo(() => {
    return localAddresses.map((address, originalIndex) => ({
      address,
      originalIndex
    }));
  }, [localAddresses]);

  const reloadAddresses = async () => {
    if (!customerId) return;
    try {
      const customer = await getCustomerById(customerId);

      if ("statusCode" in customer) {
        toast.error("Error reloading addresses");
        return;
      }

      if (customer && customer.addresses) {
        const updatedAddresses = customer.addresses as CreateCustomerAddressInput[];
        setLocalAddresses(updatedAddresses);
        onAddressesReloaded?.(updatedAddresses);
      } else {
        toast.warning('No addresses found for this customer');
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error reloading addresses");
    }
  };

  const handleAddAddress = useCallback(() => {
    const tempId = `temp-${Date.now()}`;
    const newAddress: CreateCustomerAddressInput = {
      id: tempId,
      type: "billed_from",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      isDefault: false,
    };
    setLocalAddresses([...localAddresses, newAddress]);
    setEditingAllAddressIndex(localAddresses.length);
  }, [localAddresses]);

  const handleSaveAddress = useCallback(async (address: CreateCustomerAddressInput, index: number) => {
    if (!customerId) {
      console.error('=== No customerId provided ===');
      toast.error('Customer ID is required');
      return;
    }
    
    const isNewAddress = !address.id || address.id.toString().startsWith('temp-');
    if (!isNewAddress) {
      console.warn('Attempted to save existing address, ignoring');
      return;
    }
    
    setSavingIndex(index);
    
    try {
      if (!address.line1 || !address.city || !address.state || !address.postalCode) {
        toast.error('Please fill all required address fields');
        setSavingIndex(null);
        return;
      }
      
      if (address.isDefault) {
        const currentDefaultAddress = localAddresses.find((addr, i) => 
          i !== index && addr.isDefault && addr.id && !addr.id.toString().startsWith('temp-')
        );
        
        if (currentDefaultAddress && currentDefaultAddress.id) {
          try {
            await updateAddressMutation.mutateAsync({
              customerId,
              addressId: currentDefaultAddress.id,
              data: { ...currentDefaultAddress, isDefault: false }
            });
          } catch (error) {
            toast.error('Error updating previous default address');
            setSavingIndex(null);
            return;
          }
        }
      }
      
      const response = await createAddressMutation.mutateAsync({ customerId, address });
      
      if ("code" in response && (response.code === 201 || response.code === 200)) {
        toast.success("Address created successfully");
      } else if ("statusCode" in response && response.statusCode !== 201 && response.statusCode !== 200) {
        toast.error(response.message || "Error creating address");
        setSavingIndex(null);
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsReloading(true);
      setEditingAllAddressIndex(null);
      await reloadAddresses();
    } catch (error) {
      console.error('=== Exception saving address ===');
      if (error instanceof Error) {
        toast.error(error.message || 'Error saving address');
      } else {
        toast.error('Error saving address');
      }
    } finally {
      setSavingIndex(null);
      setIsReloading(false);
    }
  }, [customerId, createAddressMutation, updateAddressMutation, reloadAddresses, localAddresses]);

  const handleDeleteAddress = useCallback((address: CreateCustomerAddressInput, index: number) => {
    if (!customerId) return;

    deleteAddressMutation.mutate({
      customerId,
      addressId: address.id || '',
      addressIndex: index,
      localAddresses,
      setLocalAddresses,
      reloadAddresses,
    });
  }, [customerId, deleteAddressMutation, localAddresses, reloadAddresses]);

  const skeletonIndexes = useMemo(() => {
    const indexes = new Set<number>();

    if (savingIndex !== null && (createAddressMutation.isPending || updateAddressMutation.isPending || isReloading)) {
      indexes.add(savingIndex);
    }

    if (deleteAddressMutation.isPending && deleteAddressMutation.variables?.addressIndex !== undefined) {
      indexes.add(deleteAddressMutation.variables.addressIndex);
    }
    
    return indexes;
  }, [
    savingIndex, 
    createAddressMutation.isPending, 
    updateAddressMutation.isPending, 
    isReloading, 
    deleteAddressMutation.isPending, 
    deleteAddressMutation.variables
  ]);

  const defaultAddressComponent = useMemo(() => {
    if (!defaultAddress || defaultAddressIndex === -1) {
      return (
        <div className="p-4 bg-secondary/30 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            No default address set. Mark an address as default from the All Addresses section.
          </p>
        </div>
      );
    }

    const shouldShowSkeleton = skeletonIndexes.has(defaultAddressIndex);
    
    if (shouldShowSkeleton) {
      return <AddressCardSkeleton key={`saving-default-${defaultAddress.id}`} />;
    }

    return (
      <div key={`default-${defaultAddress.id?.toString() || 'default'}`} className="p-3 sm:p-4 bg-secondary/30 rounded-lg">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center gap-2">
            <div className="flex gap-2 sm:gap-4 flex-1 min-w-0">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="space-y-1">
                  <p className="font-medium text-sm break-words">{defaultAddress.line1 || "—"}</p>
                  {defaultAddress.line2 && (
                    <p className="text-sm text-muted-foreground">{defaultAddress.line2}</p>
                  )}
                  <span className="text-xs text-primary font-medium">Default Address</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">City:</span> {defaultAddress.city || "—"}
                  </div>
                  <div>
                    <span className="font-medium">State:</span> {defaultAddress.state || "—"}
                  </div>
                  <div>
                    <span className="font-medium">Postal Code:</span> {defaultAddress.postalCode || "—"}
                  </div>
                  <div>
                    <span className="font-medium">Country:</span> {defaultAddress.country || "—"}
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Type:</span> {defaultAddress.type?.replace('_', ' ') || "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [
    defaultAddress,
    defaultAddressIndex,
    skeletonIndexes,
  ]);

  const addressComponents = useMemo(() => {
    return allAddressesWithIndices.map(({ address, originalIndex }) => {
      const shouldShowSkeleton = skeletonIndexes.has(originalIndex);
      
      if (shouldShowSkeleton) {
        return <AddressCardSkeleton key={`saving-${address.id}-${originalIndex}`} />;
      }

      return (
        <CustomerAddressCard
          key={address.id?.toString() || `address-${originalIndex}`}
          address={address}
          index={originalIndex}
          editingIndex={editingAllAddressIndex}
          setEditingIndex={setEditingAllAddressIndex}
          localAddresses={localAddresses}
          setLocalAddresses={setLocalAddresses}
          customerId={customerId}
          updateAddress={updateAddress}
          removeAddress={removeAddress}
          onAddressesReloaded={onAddressesReloaded}
          onSave={handleSaveAddress}
          onDelete={handleDeleteAddress}
          isReloading={isReloading}
        />
      );
    });
  }, [
    allAddressesWithIndices,
    skeletonIndexes,
    editingAllAddressIndex,
    localAddresses,
    customerId,
    updateAddress,
    removeAddress,
    onAddressesReloaded,
    handleSaveAddress,
    handleDeleteAddress,
    isReloading,
    setLocalAddresses
  ]);

  const isAnyMutationPending = createAddressMutation.isPending || updateAddressMutation.isPending || deleteAddressMutation.isPending || isReloading;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Default Address</h3>
            <p className="text-xs text-muted-foreground">This address can only be edited from the All Addresses section</p>
          </div>
        </div>
        <div className="space-y-2">
          {defaultAddressComponent}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-foreground">All Addresses</h3>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleAddAddress}
            disabled={isAnyMutationPending}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add address
          </Button>
        </div>

        <div className="space-y-2">
          {addressComponents}
        </div>
      </div>
    </div>
  );
}
