"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Building2,
  Calendar,
  Mail,
  MapPin,
  Phone,
  User,
  Edit,
  HandCoins,
} from "lucide-react";
import type { CreateVendorInput } from "@/src/types/vendorsTypes";
import { formatDate } from "@/src/lib/utils/formatters";
import { useVendorDetails } from "../_hooks/useVendorDetails";
import { useRouter } from "next/navigation";

type Props = {
  vendor: CreateVendorInput | null;
  isOpen: boolean;
  onClose: () => void;
};

export function VendorDetailsModal({
  vendor,
  isOpen,
  onClose,
}: Props) {
  const router = useRouter();
  const h = useVendorDetails({ vendor, startInEdit: false });

  if (!vendor || !isOpen || !h.formData) return null;

  const handleEditVendor = () => {
    if (vendor.id) {
      onClose();
      router.push(`/bill-pay/vendors/${vendor.id}/edit`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 w-[95vw] sm:w-full flex flex-col"
      >
        <DialogHeader className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 min-w-0">
                <div>
                  <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-primary break-words">
                    {vendor.name}
                  </h2>

                  <Badge
                    className={`${h.getStatusColor(!!vendor.isActive)} text-xs mt-1`}
                  >
                    {vendor.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleEditVendor}
              className="w-full sm:w-auto"
            >
              <Edit className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8 flex-1">
          {/* Basic Information */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-medium text-foreground">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground">
                    Legal Name
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground break-all">
                    {vendor.legalName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground">
                    Email
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground break-all">
                    {vendor.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-foreground">
                    Created
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {formatDate(vendor.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-foreground">
                    Phone
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {vendor.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <HandCoins className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-foreground">
                    Payments Terms
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {vendor.paymentTerms}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-foreground">
                    Type
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {vendor.type}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {vendor.notes && (
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-foreground">
                Notes
              </h3>
              <div className="flex flex-col gap-2 bg-secondary/50 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {vendor.notes}
                </p>
              </div>
            </div>
          )}

          {/* Primary Contact */}
          {h.contacts.length > 0 && (
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-foreground">
                Primary Contact
              </h3>
              <div className="flex flex-col gap-2 bg-secondary/50 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground break-words">
                      {h.primaryContact.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Primary Contact
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground">
                      Email
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground break-all">
                      {h.primaryContact.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground">
                      Phone
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {h.primaryContact.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Default Address */}
          {h.addresses.length > 0 && h.defaultAddress && (
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-foreground">
                Default Address
              </h3>
              <div className="bg-secondary/50 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground break-words">
                      {h.defaultAddress.line1}
                      {h.defaultAddress.line2 &&
                        `, ${h.defaultAddress.line2}`}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {h.defaultAddress.city}, {h.defaultAddress.state}{" "}
                      {h.defaultAddress.postalCode}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {h.defaultAddress.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Contacts */}
          {h.contacts.length > 0 && (
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-foreground">
                All Contacts
              </h3>
              <div className="space-y-2">
                {h.contacts.map((c, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2 justify-between p-3 bg-secondary/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full sm:w-auto">
                      <User className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="space-y-1 min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-foreground break-words">
                          {c.name}
                        </p>
                        <p className="text-xs text-muted-foreground break-all">
                          {c.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full sm:w-auto sm:text-right space-y-0.5 sm:flex-col sm:items-end pl-7 sm:pl-0">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {c.phone}
                      </p>
                      {c.isPrimary && (
                        <Badge variant="secondary" className="text-xs">
                          Primary
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Addresses */}
          {h.addresses.length > 0 && (
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-foreground">
                All Addresses
              </h3>
              <div className="space-y-2">
                {h.addresses.map((a, i) => (
                  <div
                    key={i}
                    className="p-3 sm:p-3 bg-secondary/30 rounded-lg"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-foreground break-words">
                            {a.line1}
                            {a.line2 && `, ${a.line2}`}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {a.city}, {a.state} {a.postalCode}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {a.country}
                          </p>
                        </div>
                      </div>
                      {a.isDefault && (
                        <Badge
                          variant="secondary"
                          className="text-xs shrink-0"
                        >
                          Default
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default VendorDetailsModal;
