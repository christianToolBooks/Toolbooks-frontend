"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  CreateVendorInput,
  CreateVendorContactInput,
} from "@/src/types/vendorsTypes";
import { handleUpdateVendor } from "../actions/updateVendor";
import { useQueryClient } from "@tanstack/react-query";
import { CreateVendorAddressInput } from "../../_schemas/businessVendorSchema";
import {
  putVendorAsActive,
  putVendorAsInactive,
} from "@/src/lib/services/vendorServices";
import { toast } from "sonner";

export type UseVendorDetailsArgs = {
  vendor: CreateVendorInput | null;
  startInEdit?: boolean;
  onUpdate?: (updatedVendor: CreateVendorInput) => void;
};

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

export function useVendorDetails({
  vendor,
  startInEdit = false,
  onUpdate,
}: UseVendorDetailsArgs) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateVendorInput> | null>(
    null
  );

  useEffect(() => {
    if (vendor) {
      setFormData(clone(vendor));
      setIsEditing(startInEdit);
    }
  }, [vendor, startInEdit]);

  const updateRoot = (
    k: keyof CreateVendorInput,
    v: string | boolean | number | CreateVendorContactInput[] | CreateVendorAddressInput[]
  ) => setFormData((p) => ({ ...(p ?? {}), [k]: v }));

  const addresses = useMemo(
    () => (formData?.addresses ?? []) as CreateVendorAddressInput[],
    [formData?.addresses]
  );

  const contacts = useMemo(
    () => (formData?.contacts ?? []) as CreateVendorContactInput[],
    [formData?.contacts]
  );

  const updateContact = <K extends keyof CreateVendorContactInput>(
    index: number,
    field: K,
    value: CreateVendorContactInput[K]
  ) => {
    const next = contacts.map((c, i) =>
      i === index ? { ...c, [field]: value } : c
    );
    updateRoot("contacts", next);
  };

  const addContact = () => {
    const next: CreateVendorContactInput = {
      name: "",
      email: "",
      phone: "",
      role: "",
      jobTitle: "",
      isPrimary: contacts.length === 0,
    };
    updateRoot("contacts", [...contacts, next]);
  };

  const removeContact = (index: number) => {
    const next = contacts.filter((_, i) => i !== index);
    updateRoot("contacts", next);
  };

  const updateAddress = <K extends keyof CreateVendorAddressInput>(
    index: number,
    field: K,
    value: CreateVendorAddressInput[K]
  ) => {
    const next = addresses.map((a, i) =>
      i === index ? { ...a, [field]: value } : a
    );
    updateRoot("addresses", next);
  };

  const addAddress = () => {
    const next: CreateVendorAddressInput = {
      type: "billed_from",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      isDefault: addresses.length === 0,
    } as CreateVendorAddressInput;
    updateRoot("addresses", [...addresses, next]);
  };

  const removeAddress = (index: number) => {
    const next = addresses.filter((_, i) => i !== index);
    updateRoot("addresses", next);
  };

  const makeDefault = (index: number) => {
    const next = addresses.map((a, i) => ({ ...a, isDefault: i === index }));
    updateRoot("addresses", next);
  };

  const primaryIndex = useMemo(
    () =>
      Math.max(
        0,
        contacts.findIndex((c) => c.isPrimary)
      ),
    [contacts]
  );
  const defaultAddrIndex = useMemo(
    () =>
      Math.max(
        0,
        addresses.findIndex((a) => a.isDefault)
      ),
    [addresses]
  );

  const primaryContact = contacts[primaryIndex];
  const defaultAddress = addresses[defaultAddrIndex];
  const handleSave = async () => {
    if (!vendor?.id || !formData) return;
    setIsLoading(true);

    interface PayloadData {
      id?: string;
      createdAt?: string;
      updatedAt?: string;
      payarc_merchant_code?: string;
      payarc_merchant_id?: string;
      payarc_onboarding_status?: string;
      payarc_agreement_sent_at?: string;
      payarc_onboarded_at?: string;
      payarc_contact_email?: string;
      payarc_last_webhook?: string;
      default_split_amount_cents?: number;
      default_split_percent?: number;
      addresses?: CreateVendorAddressInput[];
      contacts?: CreateVendorContactInput[];
      [key: string]: unknown;
    }

    const {
      id,
      createdAt,
      updatedAt,
      payarc_merchant_code,
      payarc_merchant_id,
      payarc_onboarding_status,
      payarc_agreement_sent_at,
      payarc_onboarded_at,
      payarc_contact_email,
      payarc_last_webhook,
      default_split_amount_cents,
      default_split_percent,
      addresses,
      contacts,
      ...payload
    } = formData as PayloadData;

    try {
      await handleUpdateVendor(vendor.id, payload as Partial<CreateVendorInput>);

      queryClient.invalidateQueries({ queryKey: ["vendor-details", vendor.id] });
      queryClient.invalidateQueries({ queryKey: ["vendors"] });

      if (onUpdate && formData) {
        onUpdate(formData as CreateVendorInput);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating vendor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (vendor) setFormData(clone(vendor));
  };

  const getStatusColor = (status: boolean) =>
    status ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";

  const toggleVendorStatus = async (vendorId: string, currentStatus: boolean) => {
    setIsLoading(true);
    try {
      const response = currentStatus
        ? await putVendorAsInactive(vendorId, {})
        : await putVendorAsActive(vendorId, {});

      if ("statusCode" in response) {
        toast.error(response.message || "Failed to update vendor status");
        return false;
      }

      // Actualizar el estado local
      if (formData) {
        setFormData((prev) => ({ ...prev, isActive: !currentStatus }));
      }

      // Invalidar queries para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ["vendor-details", vendorId] });
      queryClient.invalidateQueries({ queryKey: ["vendors"] });

      toast.success(
        `Vendor ${
          currentStatus ? "deactivated" : "activated"
        } successfully`
      );
      return true;
    } catch (error) {
      console.error("Error toggling vendor status:", error);
      toast.error("Failed to update vendor status");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isEditing,
    setIsEditing,
    isLoading,
    formData,
    setFormData,
    contacts,
    addresses,
    primaryIndex,
    defaultAddrIndex,
    primaryContact,
    defaultAddress,
    updateRoot,
    updateContact,
    addContact,
    removeContact,
    updateAddress,
    addAddress,
    removeAddress,
    makeDefault,
    handleSave,
    handleCancel,
    getStatusColor,
    toggleVendorStatus,
  };
}
