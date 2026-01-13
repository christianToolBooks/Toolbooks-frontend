"use client";
import {
  FolderClockIcon,
  InfoIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import { Customer } from "@/src/types/customer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Separator } from "@/src/components/ui/separator";
import { Button } from "@/src/components/ui/button";
import { BankAccount } from "@/src/types/bank-account";
import { formatSafeDate } from "../helpers/formatSafeDate";

interface ViewBanckAccountDialogProps {
  account: BankAccount;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewBankAccountDetailsDialog({
  account,
  open,
  onOpenChange,
}: ViewBanckAccountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Bank Account Details
          </DialogTitle>
          <DialogDescription>
            Complete information about {account.name}
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-4" />
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <InfoIcon className="h-5 w-5" />
              <h3 className="font-semibold text-sm">General Information</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 pl-6">
              <div className="flex items-center gap-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Name
                  </p>
                  <p className="text-sm font-medium">{account.name || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Official Name
                  </p>
                  <p className="text-sm font-medium">
                    {account.official_name || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* <MailIcon className="h-4 w-4 text-muted-foreground" /> */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Account Type
                  </p>
                  <p className="text-sm font-medium">{account.type || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Account Sup Type
                  </p>
                  <p className="text-sm font-medium">
                    {account.subtype || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Last digits (Mask)
                  </p>
                  <p className="text-sm font-medium">
                    {account.mask ? "****" + account.mask : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Currency
                  </p>
                  <p className="text-sm font-medium">
                    {account.iso_currency_code || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Current Balance
                  </p>
                  <p className="text-sm font-medium">
                    {account.current_balance || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Limit Balance
                  </p>
                  <p className="text-sm font-medium">
                    {account.limit_balance || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Holder Category
                  </p>
                  <p className="text-sm font-medium">
                    {account.holder_category || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FolderClockIcon className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Technical Metadata</h3>
            </div>

            <div className="space-y-3 pl-6">
              <div className="flex items-center gap-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Created At
                  </p>
                  <p className="text-sm font-medium">
                    {formatSafeDate(account.createdAt) || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Updated At
                  </p>
                  <p className="text-sm font-medium">
                    {formatSafeDate(account.updatedAt) || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
