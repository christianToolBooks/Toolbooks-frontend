"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import {
  BookOpen,
  Calendar,
  CreditCard,
  DollarSign,
  ExternalLink,
  Landmark,
  Tag,
  User,
} from "lucide-react";
import Image from "next/image";
import {
  formatCurrency,
  formatDate,
  humanizeKey,
} from "@/src/lib/utils/formatters";
import { GeneralLedgerLine } from "@/src/types/generaldLedgerTypes";

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: GeneralLedgerLine;
}

export function TransactionDetailModal({
  isOpen,
  onClose,
  transaction: tx,
}: TransactionDetailModalProps) {
  if (!tx) return null;

  const bankTx = tx.transaction?.bankTransaction;
  const bankAccount = bankTx?.bankAccount;
  const raw = bankTx?.raw_payload;

  const merchantName =
    bankTx?.merchant_name || bankTx?.name || "Unknown Merchant";
  const description = tx.transaction?.description || "";
  const creditAmount = Number(tx.credit || 0);
  const debitAmount = Number(tx.debit || 0);
  const isCredit = creditAmount > 0;
  const displayAmount = isCredit ? creditAmount : debitAmount;
  const currency =
    tx.transaction?.currency || bankTx?.iso_currency_code || "USD";
  const memo = tx.memo || "";
  const entryNo = tx.transaction?.entry_no;
  const entryDate = tx.transaction?.entry_date;

  const status = tx.transaction?.status;
  const pending = bankTx?.pending;

  const logoUrl =
    raw?.logo_url && /^https?:\/\//.test(raw.logo_url) ? raw.logo_url : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[100vw] max-w-5xl max-h-[90vh] overflow-y-auto p-4 sm:p-7 ">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-chart-1 dark:text-gray-100">
            Transaction Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Header card */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-3">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={`${merchantName} logo`}
                  width={42}
                  height={42}
                  unoptimized
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="flex items-center justify-center p-3 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                  <User className="h-8 w-8" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-100 break-words">
                  {merchantName}
                </h3>
                {description && (
                  <p className="text-sm sm:text-base text-blue-900/80 dark:text-blue-300 break-words">
                    {description}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 items-end">
                <div className="flex gap-2">
                  {typeof pending === "boolean" && (
                    <Badge variant={pending ? "secondary" : "default"}>
                      {pending ? "Pending" : "Cleared"}
                    </Badge>
                  )}
                  {status && <Badge variant="outline">{status}</Badge>}
                </div>
                <Badge variant="outline">{currency}</Badge>
              </div>
            </div>
          </div>

          {/* Amount / Status cards */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-gray-900 border rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Amount
                </span>
              </div>
              <p
                className="text-xl sm:text-2xl font-bold text-chart-1"
              >
                {isCredit ? "+" : ""}
                {formatCurrency(displayAmount)}{" "}
                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 ml-1">
                  {isCredit ? "Credit" : "Debit"}
                </span>
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border rounded-lg p-3 sm:p-4 w-full">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Payment Channel / Category
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {raw?.payment_channel && (
                  <Badge variant="outline">{raw.payment_channel}</Badge>
                )}
                {bankTx?.primary_detail && (
                  <Badge variant="outline">
                    {humanizeKey(bankTx.primary_detail)}
                  </Badge>
                )}
                {bankTx?.detailed && (
                  <Badge variant="outline" className="text-xs">
                    {humanizeKey(bankTx.detailed)}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-4 sm:my-6" />

          {/* Transaction Information */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-gray-100">
              Transaction Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {bankTx?.date && (
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    Transaction Date
                  </label>
                  <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100">
                    {formatDate(bankTx.date)}
                  </p>
                </div>
              )}

              {bankTx?.authorized_date && (
                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                    Authorized Date
                  </label>
                  <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100">
                    {formatDate(bankTx.authorized_date)}
                  </p>
                </div>
              )}

              {(bankTx?.primary_detail || bankTx?.detailed) && (
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {bankTx?.primary_detail && (
                      <Badge variant="outline">
                        {humanizeKey(bankTx.primary_detail)}
                      </Badge>
                    )}
                    {bankTx?.detailed && (
                      <Badge variant="outline" className="text-xs">
                        {humanizeKey(bankTx.detailed)}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {description && description !== memo && (
                <div>
                  <label className="text-sm text-gray-600">Description</label>
                  <div className="text-sm bg-gray-50 p-2 rounded border">
                    {description}
                  </div>
                </div>
              )}

              {memo && ( 
                <div>
                  <label className="text-sm text-gray-600">Memo</label>
                  <div className="text-sm bg-gray-50 p-2 rounded border">
                    {memo}
                  </div>
                </div>
             )}
            </div>
          </div>
          <Separator className="my-4 sm:my-6" />
          {/* Account & Ledger */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-gray-100">
              Account &amp; Ledger
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Bank Account */}
              {bankAccount && (
                <div className="space-y-1 flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                    <Landmark className="h-4 w-4" />
                    Bank Account
                  </label>
                  <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100">
                    {bankAccount.name} ****{bankAccount.mask} (
                    {bankAccount.subtype})
                  </p>
                  {bankAccount.current_balance && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Current Balance: {bankAccount.current_balance}
                    </p>
                  )}
                </div>
              )}

              {/* Ledger Entry */}
              {(entryNo || entryDate) && (
                <div className="space-y-1 flex flex-col gap-2">
                  <label className="flex gap-2 items-center text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                    <BookOpen className="h-4 w-4" />
                    Ledger Entry
                  </label>
                  {entryNo && (
                    <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100">
                      {entryNo}
                    </p>
                  )}
                  {entryDate && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(entryDate)}
                    </p>
                  )}
                </div>
              )}

                <div className="space-y-1 sm:col-span-2 flex flex-col gap-2">
                  <label className="flex gap-2 items-center text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                    <CreditCard className="h-4 w-4" />
                    Account
                  </label>
                  <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100">
                    {tx.account ? `${tx.account.account_name} (${tx.account.account_code})` : "N/A"}
                  </p>
                </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t">
            <div>
              {raw?.website && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-blue-600 hover:text-blue-700"
                >
                  <a
                    href={`https://${raw.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View merchant site
                  </a>
                </Button>
              )}
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto bg-transparent"
              >
                Close
              </Button>
              {/* Si en el futuro agregas navegación/edición, colócala aquí */}
              {/* <Button className="w-full sm:w-auto">Edit in Ledger</Button> */}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
