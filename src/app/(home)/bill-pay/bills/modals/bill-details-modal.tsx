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
  FileText,
  Calendar,
  DollarSign,
  Building2,
  Clock,
  Percent,
  Receipt,
  ClipboardList,
  Loader2,
  Hash,
  User,
} from "lucide-react";
import { BillDataByIdFromAPI } from "@/src/types/billPayTypes";
import {
  getAgingColor,
  getPriorityColor,
  getStatusColor,
  normalizeDate,
} from "../../_helpers/helpersToBill";

interface BillDetailsModalProps {
  bill: BillDataByIdFromAPI | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export function BillDetailsModal({
  bill,
  isOpen,
  onClose,
  isLoading,
}: BillDetailsModalProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <>
            <DialogHeader>
              <DialogTitle>Loading Bill Details</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </>
        ) : !bill ? (
          <>
            <DialogHeader>
              <DialogTitle>Bill Details</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">No bill data available</p>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-primary">
                    Invoice #{bill.invoiceNumber}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {bill.status && (
                      <Badge className={getStatusColor(bill.status)}>
                        {bill.status}
                      </Badge>
                    )}
                    {bill.financialStatus && (
                      <Badge className={getPriorityColor(bill.financialStatus)}>
                        {bill.financialStatus}
                      </Badge>
                    )}
                    {bill.agingStage && (
                      <Badge className={getAgingColor(bill.agingStage)}>
                        {bill.agingStage}
                      </Badge>
                    )}
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Vendor Information */}
              {bill.vendor && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">
                    Vendor Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Name
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {bill.vendor.name}
                        </p>
                      </div>
                    </div>

                    {bill.vendor.legalName && (
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Legal Name
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {bill.vendor.legalName}
                          </p>
                        </div>
                      </div>
                    )}

                    {bill.vendor.email && (
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Email
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {bill.vendor.email}
                          </p>
                        </div>
                      </div>
                    )}

                    {bill.vendor.phone && (
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Phone
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {bill.vendor.phone}
                          </p>
                        </div>
                      </div>
                    )}

                    {bill.vendor.paymentTerms && (
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Payment Terms
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {bill.vendor.paymentTerms}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Currency
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {bill.vendor.defaultCurrency}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        variant={bill.vendor.isActive ? "default" : "secondary"}
                      >
                        {bill.vendor.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">
                  Important Dates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Invoice Date
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {bill.invoiceDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Due Date
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {bill.dueDate}
                      </p>
                      {bill.financialStatus !== "paid" && (
                        <span
                          className={`text-sm font-medium ${
                            normalizeDate(bill.dueDate).getTime() <
                            normalizeDate(new Date()).getTime()
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {normalizeDate(bill.dueDate).getTime() <
                          normalizeDate(new Date()).getTime()
                            ? "⚠ Overdue"
                            : "✓ On time"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Created At
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(bill.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Last Updated
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(bill.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {bill.lines &&
                Array.isArray(bill.lines) &&
                bill.lines.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground">
                      Line Items ({bill.lines.length})
                    </h3>
                    <div className="rounded-lg border max-h-[400px] overflow-y-auto divide-y">
                      {bill.lines.map((line) => (
                        <div key={line.lineNo} className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="flex flex-col  items-start gap-2 mb-2">
                                <Badge variant="outline">
                                  Line #{line.lineNo}
                                </Badge>
                                <div className="flex gap-2">
                                  <p className="text-sm font-medium">
                                    Description:
                                  </p>
                                  <p className="text-sm font-normal">
                                    {line.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm font-bold ml-4">
                              ${line.amount}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Financial Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">
                  Financial Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Subtotal
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${bill.subtotal}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Percent className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Tax Total
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${bill.taxTotal}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Discount Total
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${bill.discountTotal}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Total Amount
                      </p>
                      <p className="text-lg font-bold text-primary">
                        ${bill.total} {bill.currency}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {bill.memo && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-foreground">Memo</h3>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {bill.memo}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button>Edit Bill</Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
