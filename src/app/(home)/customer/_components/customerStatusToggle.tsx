"use client";

import { useState } from "react";
import { Switch } from "@/src/components/ui/switch";
import { Badge } from "@/src/components/ui/badge";
import { putCustomerAsInactive, putCustomerAsActive } from "@/src/lib/services/customersServices";
import { toast } from "sonner";
import type { Customer } from "@/src/types/customer";
import { Loader2 } from "lucide-react";

interface CustomerStatusToggleProps {
  customer: Customer;
  onStatusChange?: () => void;
}

export function CustomerStatusToggle({ customer, onStatusChange }: CustomerStatusToggleProps) {
  const [isActive, setIsActive] = useState(customer.isActive ?? true);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async (checked: boolean) => {
    if (!customer.id) {
      toast.error("Customer ID is missing");
      return;
    }

    setIsUpdating(true);

    try {
      const response = checked 
        ? await putCustomerAsActive(customer.id, { isActive: true })
        : await putCustomerAsInactive(customer.id, { isActive: false });

      if ("code" in response && response.code === 200) {
        setIsActive(checked);
        toast.success(checked ? "Customer activated successfully" : "Customer deactivated successfully");
        
        if (onStatusChange) {
          onStatusChange();
        }
      } else {
        toast.error(response.message || "Failed to update customer status");
      }
    } catch (error) {
      console.error("Error updating customer status:", error);
      toast.error("An error occurred while updating customer status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={isActive}
        onCheckedChange={handleToggle}
        disabled={isUpdating}
        className="data-[state=checked]:bg-green-500"
      />
      {isUpdating ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : (
        <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-green-500" : ""}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      )}
    </div>
  );
}
