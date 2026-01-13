"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft, Loader2, Power, PowerOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { CreateVendorAddressInput, CreateVendorContactInput } from "@/src/types/vendorsTypes";
import { useGetVendorById } from "../../_hooks/useGetVendorId";
import { useVendorDetails } from "../../_hooks/useVendorDetails";
import VendorDetailsEdit from "../../modals/vendor-edit-modal";
import { Badge } from "@/src/components/ui/badge";

export default function EditVendorPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params?.id as string;
  
  const { data: vendor, isLoading, error } = useGetVendorById(vendorId);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const vendorDetails = useVendorDetails({
    vendor: vendor || null,
    startInEdit: true,
  });

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirm) return;
    }
    router.push("/bill-pay/vendors");
  };

  const handleContactsReloaded = (contacts: CreateVendorContactInput[]) => {
    vendorDetails.updateRoot("contacts", contacts);
  };

  const handleAddressesReloaded = (addresses: CreateVendorAddressInput[]) => {
    vendorDetails.updateRoot("addresses", addresses);
  };

  const handleToggleStatus = async () => {
    if (!vendor) return;
    
    const success = await vendorDetails.toggleVendorStatus(
      vendorId,
      vendor.isActive || false
    );
    
    if (success) {
      setHasUnsavedChanges(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading vendor details...</p>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-red-600">Error</h2>
              <p className="text-muted-foreground">
                {error ? "Failed to load vendor details" : "Vendor not found"}
              </p>
              <Button onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Vendors
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4 hover:bg-secondary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Vendors
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Vendor</h1>
            <p className="text-muted-foreground mt-1">
              Update vendor information and manage contacts & addresses
            </p>
          </div>

          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <span className="h-2 w-2 rounded-full bg-amber-600 animate-pulse" />
                Unsaved changes
              </div>
            )}
            
            <Button
              variant="outline"
              onClick={handleToggleStatus}
              disabled={vendorDetails.isLoading}
              className={
                vendor?.isActive
                  ? "border-orange-200 text-orange-600 hover:bg-orange-50"
                  : "border-green-200 text-green-600 hover:bg-green-50"
              }
            >
              {vendorDetails.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : vendor?.isActive ? (
                <>
                  <PowerOff className="mr-2 h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <Power className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Vendor Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              {vendor.name}
              {vendor.legalName && vendor.legalName !== vendor.name && (
                <span className="text-muted-foreground font-normal ml-2">
                  ({vendor.legalName})
                </span>
              )}
            </CardTitle>
            
            {vendorDetails.isLoading ? (
              <Badge className="bg-blue-100 text-blue-800">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Updating...
              </Badge>
            ) : (
              <Badge className={vendorDetails.getStatusColor(!!vendor.isActive)}>
                {vendor.isActive ? "Active" : "Inactive"}
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Edit Form */}
      <Card>
        <CardContent className="pt-6">
          <VendorDetailsEdit
            vendorId={vendorId}
            data={vendorDetails.formData}
            type={vendor.type}
            onChange={(field, value) => {
              vendorDetails.updateRoot(field, value);
              setHasUnsavedChanges(true);
            }}
            contacts={vendorDetails.contacts}
            addresses={vendorDetails.addresses}
            addAddress={vendorDetails.addAddress}
            addContact={vendorDetails.addContact}
            updateContact={(index, field, value) => {
              vendorDetails.updateContact(index, field, value);
              setHasUnsavedChanges(true);
            }}
            removeContact={vendorDetails.removeContact}
            updateAddress={(index, field, value) => {
              vendorDetails.updateAddress(index, field, value);
              setHasUnsavedChanges(true);
            }}
            removeAddress={vendorDetails.removeAddress}
            makeDefault={vendorDetails.makeDefault}
            onContactsReloaded={handleContactsReloaded}
            onAddressesReloaded={handleAddressesReloaded}
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={vendorDetails.isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await vendorDetails.handleSave();
                setHasUnsavedChanges(false);
                router.push("/bill-pay/vendors");
              }}
              disabled={vendorDetails.isLoading || !hasUnsavedChanges}
              className="bg-chart-1 hover:bg-chart-1/90"
            >
              {vendorDetails.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
