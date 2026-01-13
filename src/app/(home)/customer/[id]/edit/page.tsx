"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft, Loader2, Power, PowerOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { getCustomerById, updateCustomer } from "@/src/lib/services/customersServices";
import { toast } from "sonner";
import type { Customer, UpdateCustomerForm } from "@/src/types/customer";
import CustomerDetailsEdit from "../../_components/CustomerDetailsEdit";
import { useCustomerEditLogic } from "../../hooks/useCustomerEditLogic";

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params?.id as string;
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingBasicInfo, setIsSavingBasicInfo] = useState(false);

  const customerLogic = useCustomerEditLogic(customer);

  const refreshCustomer = useCallback(async () => {
    if (!customerId) return;

    try {
      const response = await getCustomerById(customerId);
      if ("statusCode" in response) {
        toast.error("Error refreshing customer data");
        return;
      }

      setCustomer(response);
      
      if (response.addresses) {
        customerLogic.setAddresses(response.addresses);
      }

      if (response.contacts) {
        customerLogic.setContacts(response.contacts);
      }
    } catch (error) {
      toast.error("Failed to refresh customer data");
    }
  }, [customerId, customerLogic]);

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const response = await getCustomerById(customerId);
        if ("statusCode" in response) {
          toast.error("Customer not found");
          router.push("/customer");
          return;
        }
        setCustomer(response);
      } catch (error) {
        console.error("Error fetching customer:", error);
        toast.error("Failed to load customer");
        router.push("/customer");
      } finally {
        setIsLoading(false);
      }
    }

    if (customerId) {
      fetchCustomer();
    }
  }, [customerId, router]);

  const handleBack = () => {
    router.push("/customer");
  };

  const handleToggleStatus = async () => {
    if (!customer) return;
    
    const success = await customerLogic.toggleCustomerStatus(
      customerId,
      customer.isActive || false
    );
    
    if (success) {
      const response = await getCustomerById(customerId);
      if (!("statusCode" in response)) {
        setCustomer(response);
      }
    }
  };

  const handleSaveBasicInfo = async () => {
    if (!customerLogic.formData) return;

    setIsSavingBasicInfo(true);
    try {
      const updateData: UpdateCustomerForm = {
        name: customerLogic.formData.name ?? "",
        email: customerLogic.formData.email ?? "",
        phone: customerLogic.formData.phone ?? "",
        taxId: customerLogic.formData.taxId ?? "",
        isActive: customerLogic.formData.isActive ?? true,
        legalName: customerLogic.formData.legalName ?? "",
        paymentTerms: customerLogic.formData.paymentTerms ?? "net_30",
        defaultCurrency: customerLogic.formData.defaultCurrency ?? "USD",
        notes: customerLogic.formData.notes ?? "",
      };

      const response = await updateCustomer(customerId, updateData);

      if ("statusCode" in response) {
        toast.error(response.message || "Failed to update customer");
        return;
      }

      toast.success("Customer information updated successfully");
      await refreshCustomer();
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("An error occurred while updating");
    } finally {
      setIsSavingBasicInfo(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-red-600">Error</h2>
              <p className="text-muted-foreground">Customer not found</p>
              <Button onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Customers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4 hover:bg-secondary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Customer</h1>
            <p className="text-muted-foreground mt-1">
              Update customer information and manage contacts and addresses
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleToggleStatus}
              disabled={customerLogic.isLoading}
              className={
                customer?.isActive
                  ? "border-orange-200 text-orange-600 hover:bg-orange-50"
                  : "border-green-200 text-green-600 hover:bg-green-50"
              }
            >
              {customerLogic.isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : customer?.isActive ? (
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

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              {customer.name}
              {customer.legalName && customer.legalName !== customer.name && (
                <span className="text-muted-foreground font-normal ml-2">
                  ({customer.legalName})
                </span>
              )}
            </CardTitle>
            
            {customerLogic.isLoading ? (
              <Badge className="bg-blue-100 text-blue-800">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Updating...
              </Badge>
            ) : (
              <Badge variant={customer.isActive ? "default" : "secondary"}>
                {customer.isActive ? "Active" : "Inactive"}
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <CustomerDetailsEdit
            customerId={customerId}
            data={customerLogic.formData}
            type={customer.type}
            onChange={(field, value) => {
              customerLogic.updateRoot(field, value);
            }}
            contacts={customerLogic.contacts}
            addresses={customerLogic.addresses}
            addAddress={customerLogic.addAddress}
            updateAddress={customerLogic.updateAddress}
            removeAddress={customerLogic.removeAddress}
            onAddressesReloaded={(addresses) => {
              customerLogic.setAddresses(addresses);
              refreshCustomer();
            }}
            onSaveBasicInfo={handleSaveBasicInfo}
            isSavingBasicInfo={isSavingBasicInfo}
          />

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={customerLogic.isLoading || isSavingBasicInfo}
            >
              Back to Customers
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
