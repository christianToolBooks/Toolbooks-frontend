"use client";

import {
  MoreHorizontal,
  Edit,
  Eye,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import type { Customer } from "@/src/types/customer";
import UseCustomerActions from "../hooks/useCustomerActions";
import DeleteConfirmationModal from "@/src/components/ui/deleteConfirmationModal";
import { useState } from "react";
import { ViewCandidateDialog } from "./dialogs/viewCustomerDialog";
import { useRouter } from "next/navigation";

export interface CustomerActionsProps {
  customer: Customer;
  onDeleteSuccess?: () => void;
  customerId?: string;
}

export function CustomerActions({
  customer,
  onDeleteSuccess,
}: CustomerActionsProps) {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const router = useRouter();

  const {
    isDeleting,
    showDeleteModal,
    handleCloseModal,
    handleDelete,
  } = UseCustomerActions({
    customer,
    onDeleteSuccess,
  });

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/customer/${customer.id}/edit`);
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setViewDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(customer.id ?? "")}
          >
            Copy customer ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleEditClick}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleViewClick}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ViewCandidateDialog
        customer={customer}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? All associated invoices and data will be permanently removed from the system."
        itemName={customer.name}
        isDeleting={isDeleting}
        confirmText="Delete Customer"
        cancelText="Cancel"
      />
    </>
  );
}
