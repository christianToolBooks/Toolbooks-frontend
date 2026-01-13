"use client"

import * as React from "react"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { PdfScannerResult } from "./pdf-scanner"
import { AccountSelectorToBillForm } from "./accountSelectorToBillForm"
import { useJournalEntry } from "@/src/app/(home)/journal-entry/_components/journalEntryComponents/context/journalContext"
import type { CombinedAccount } from "@/src/types/chart-of-accounts"
import type { BillData, Vendor } from "@/src/types/billPayTypes"
import { VendorSelector } from "./vendor-selector"
import { DatePicker } from "@/src/components/ui/date-picker"
import { toast } from "sonner"

interface SelectorUI {
  accountNumber: string
  accountName: string
  isOpen: boolean
}

interface BillFormFieldsProps {
  formData: BillData
  onUpdateFormData: (updates: Partial<BillData>) => void
  onAddLineItem: () => void
  onRemoveLineItem: (index: number) => void
  onUpdateLineItem: (index: number, field: keyof BillData["lines"][number], value: string) => void
  onFormatLineItemOnBlur: (index: number, field: "quantity" | "unitPrice") => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  
  selector: SelectorUI
  onSelectorOpenChange: (open: boolean) => void
  onSelectAccount: (account: CombinedAccount) => void

  submitting?: boolean
  submitError?: string | null
  getFieldError?: (fieldPath: string) => string | null;
}

const toFixed2 = (v: string | number) => (typeof v === "number" ? v : Number(v || 0)).toFixed(2)

export function BillFormFields({
  formData,
  onUpdateFormData,
  onAddLineItem,
  onRemoveLineItem,
  onUpdateLineItem,
  onFormatLineItemOnBlur,
  onSubmit,
  onCancel,
  selector,
  onSelectorOpenChange,
  onSelectAccount,
  submitting,
  submitError,
  getFieldError,
}: BillFormFieldsProps) {
  const { accountSearch } = useJournalEntry()

  const handleChooseAccount = (account: CombinedAccount) => {
    onSelectAccount(account)
    accountSearch.clearQuery?.()
    onSelectorOpenChange(false)
  }

  const parseDate = (dateString: string | null | undefined): Date | undefined => {
    if (!dateString) return undefined
    return new Date(dateString + 'T00:00:00')
  }

  const formatDateForForm = (date: Date | undefined): string => {
    if (!date) return ""
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const minDueDate = formData.invoiceDate ? parseDate(formData.invoiceDate) : undefined

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="mx-auto w-full max-w-8xl">
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-12" noValidate>
          <div className="space-y-6 lg:col-span-8">
            {submitError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
                    <div className="mt-2 text-sm text-red-700 whitespace-pre-line">
                      {submitError}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <PdfScannerResult
              confidence={formData.confidence}
              warnings={formData.warnings}
              discrepancies={formData.discrepancies}
            />

            <section className="overflow-hidden rounded-2xl border border-[#EFECE6]/50 bg-white/80 shadow-sm backdrop-blur-sm">
              <header className="border-b border-[#EFECE6]/50 px-5 py-4 md:px-6">
                <h2 className="text-lg font-semibold text-[#1E3A8A] md:text-xl">Bill Information</h2>
              </header>
              <div className="px-5 py-6 md:px-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber" className="text-xs uppercase tracking-wide text-[#5C769D]">
                      Invoice Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="invoiceNumber"
                      value={formData.invoiceNumber ?? ""}
                      onChange={(e) => onUpdateFormData({ invoiceNumber: e.target.value })}
                      className={`h-10 border-2 ${getFieldError?.("invoiceNumber") ? "border-red-500" : "border-chart-5"} bg-transparent px-2 text-base focus:border-[#1E3A8A] focus:ring-0`}
                    />
                    {getFieldError?.("invoiceNumber") && (
                      <p className="text-sm text-red-600 mt-1">{getFieldError("invoiceNumber")}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-xs uppercase tracking-wide text-[#5C769D]">
                      Currency <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="currency"
                      value={formData.currency ?? ""}
                      onChange={(e) => onUpdateFormData({ currency: e.target.value })}
                      placeholder="e.g. USD"
                      className={`h-10 border-2 ${getFieldError?.("currency") ? "border-red-500" : "border-chart-5"} bg-transparent px-2 text-base focus:border-[#1E3A8A] focus:ring-0`}
                    />
                    {getFieldError?.("currency") && (
                      <p className="text-sm text-red-600 mt-1">{getFieldError("currency")}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="invoiceDate" className="text-xs uppercase tracking-wide text-[#5C769D]">
                      Invoice Date <span className="text-red-500">*</span>
                    </Label>
                    <DatePicker
                      date={parseDate(formData.invoiceDate)}
                      onDateChange={(date) => {
                        const newInvoiceDate = formatDateForForm(date)
                        if (formData.dueDate && date) {
                          const currentDueDate = parseDate(formData.dueDate)
                          if (currentDueDate && currentDueDate < date) {
                            onUpdateFormData({ 
                              invoiceDate: newInvoiceDate,
                              dueDate: newInvoiceDate 
                            })
                            toast.info("Due date updated to match invoice date")
                            return
                          }
                        }
                        onUpdateFormData({ invoiceDate: newInvoiceDate })
                      }}
                      placeholder="Select invoice date"
                    />
                    {getFieldError?.("invoiceDate") && (
                      <p className="text-sm text-red-600 mt-1">{getFieldError("invoiceDate")}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate" className="text-xs uppercase tracking-wide text-[#5C769D]">
                      Due Date <span className="text-red-500">*</span>
                    </Label>
                    <DatePicker
                      date={parseDate(formData.dueDate)}
                      onDateChange={(date) => {
                        if (minDueDate && date) {
                          const dateToCheck = new Date(date)
                          dateToCheck.setHours(0, 0, 0, 0)
                          const minDate = new Date(minDueDate)
                          minDate.setHours(0, 0, 0, 0)
                          
                          if (dateToCheck < minDate) {
                            toast.error("Due date cannot be before invoice date")
                            return
                          }
                        }
                        onUpdateFormData({ dueDate: formatDateForForm(date) })
                      }}
                      placeholder="Select due date"
                    />
                    {getFieldError?.("dueDate") && (
                      <p className="text-sm text-red-600 mt-1">{getFieldError("dueDate")}</p>
                    )}
                    {minDueDate && (
                      <p className="text-xs text-[#5C769D] mt-1">
                        Must be on or after {formatDateForForm(minDueDate)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="overflow-visible rounded-2xl border border-[#EFECE6]/50 bg-white/80 shadow-sm backdrop-blur-sm relative z-10">
              <header className="border-b border-[#EFECE6]/50 px-5 py-4 md:px-6">
                <h2 className="text-lg font-semibold text-[#1E3A8A] md:text-xl">Vendor Information</h2>
              </header>

              <div className="px-5 py-6 md:px-6 space-y-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wide text-[#5C769D]">
                      Vendor <span className="text-red-500">*</span>
                    </Label>

                    <VendorSelector
                      value={formData.vendorId || ""}
                      onChange={(vendor) => {
                        onUpdateFormData({ vendorId: vendor?.id })
                      }}
                      placeholder="Select vendor…"
                    />
                    {getFieldError?.("vendorId") && (
                      <p className="text-sm text-red-600 mt-1">{getFieldError("vendorId")}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wide text-[#5C769D]">
                      Chart Account <span className="text-red-500">*</span>
                    </Label>
                    <AccountSelectorToBillForm
                      accountNumber={selector.accountNumber}
                      accountName={selector.accountName}
                      isOpen={selector.isOpen}
                      onOpenChange={onSelectorOpenChange}
                      accountSearch={accountSearch}
                      onSelectAccount={handleChooseAccount}
                    />
                    {(getFieldError?.("account_id") || getFieldError?.("subaccount_id")) && (
                      <p className="text-sm text-red-600 mt-1">
                        {getFieldError?.("account_id") || getFieldError?.("subaccount_id")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-[#EFECE6]/50 bg-white/80 shadow-sm backdrop-blur-sm">
              <header className="flex items-center justify-between border-b border-[#EFECE6]/50 px-5 py-4 md:px-6">
                <h2 className="text-lg font-semibold text-[#1E3A8A] md:text-xl">
                  Line Items <span className="text-red-500">*</span>
                </h2>
                <button
                  type="button"
                  onClick={onAddLineItem}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E3A8A] text-white transition-colors hover:bg-[#1E3A8A]/90"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </header>
              <div className="px-5 py-6 md:px-6">
                <div className="space-y-4">
                  {Array.isArray(formData.lines) && formData.lines.length > 0 ? (
                    formData.lines.map((item, index) => (
                      <div key={index} className="rounded-xl border border-[#EFECE6]/60 bg-white/60 p-4 backdrop-blur-sm">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                          <div className="md:col-span-6 lg:col-span-7 space-y-1.5">
                            <Label className="text-[11px] uppercase tracking-wide text-[#5C769D]">Description</Label>
                            <Input
                              value={item.description ?? ""}
                              onChange={(e) => onUpdateLineItem(index, "description", e.target.value)}
                              className="h-10 border-2 border-chart-5 bg-transparent px-2 text-sm focus:border-[#1E3A8A] focus:ring-0"
                            />
                          </div>

                          <div className="md:col-span-2 space-y-1.5">
                            <Label className="text-[11px] uppercase tracking-wide text-[#5C769D]">Qty</Label>
                            <Input
                              type="text"
                              inputMode="decimal"
                              value={item.quantity ?? ""}
                              onChange={(e) => onUpdateLineItem(index, "quantity", e.target.value)}
                              onBlur={() => onFormatLineItemOnBlur(index, "quantity")}
                              placeholder="0.0000"
                              className={`h-10 border-2 ${getFieldError?.(`lines.${index}.quantity`) ? "border-red-500" : "border-chart-5"} bg-transparent px-2 text-sm focus:border-[#1E3A8A] focus:ring-0`}
                            />
                            {getFieldError?.(`lines.${index}.quantity`) && (
                              <p className="text-xs text-red-600">{getFieldError(`lines.${index}.quantity`)}</p>
                            )}
                          </div>

                          <div className="md:col-span-2 space-y-1.5">
                            <Label className="text-[11px] uppercase tracking-wide text-[#5C769D]">Unit Price</Label>
                            <Input
                              type="text"
                              inputMode="decimal"
                              value={item.unitPrice ?? ""}
                              onChange={(e) => onUpdateLineItem(index, "unitPrice", e.target.value)}
                              onBlur={() => onFormatLineItemOnBlur(index, "unitPrice")}
                              placeholder="0.00"
                              className={`h-10 border-2 ${getFieldError?.(`lines.${index}.unitPrice`) ? "border-red-500" : "border-chart-5"} bg-transparent px-2 text-sm focus:border-[#1E3A8A] focus:ring-0`}
                            />
                            {getFieldError?.(`lines.${index}.unitPrice`) && (
                              <p className="text-xs text-red-600">{getFieldError(`lines.${index}.unitPrice`)}</p>
                            )}
                          </div>

                          <div className="md:col-span-2 space-y-1.5">
                            <Label className="text-[11px] uppercase tracking-wide text-[#5C769D]">Amount</Label>
                            <Input
                              type="text"
                              value={item.amount ?? ""}
                              readOnly
                              className="h-10 border-2 border-chart-5 bg-transparent px-2 text-sm font-medium text-[#1E3A8A]"
                            />
                          </div>

                          <div className="md:col-span-12 lg:col-span-1 flex items-end justify-end">
                            <button
                              type="button"
                              onClick={() => onRemoveLineItem(index)}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No line items yet. Click the + button to add one.</p>
                    </div>
                  )}
                </div>
                {getFieldError?.("lines") && (
                  <p className="text-sm text-red-600 mt-2">{getFieldError("lines")}</p>
                )}
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-[#EFECE6]/50 bg-white/80 shadow-sm backdrop-blur-sm">
              <header className="border-b border-[#EFECE6]/50 px-5 py-4 md:px-6">
                <h2 className="text-lg font-semibold text-[#1E3A8A] md:text-xl">Additional Notes</h2>
              </header>
              <div className="px-5 py-6 md:px-6">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wide text-[#5C769D]">Memo</Label>
                  <Textarea
                    value={formData.memo ?? ""}
                    onChange={(e) => onUpdateFormData({ memo: e.target.value })}
                    placeholder="Add any additional notes here..."
                    className="resize-none rounded-md border-2 border-chart-5 bg-transparent px-2 text-base placeholder:font-light focus:border-[#1E3A8A] focus:ring-0"
                    rows={3}
                  />
                </div>
              </div>
            </section>

            {submitError && <p className="text-red-600 text-sm px-1">Error: {submitError}</p>}
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-6">
              <section className="overflow-hidden rounded-2xl border border-[#EFECE6]/50 bg-white/90 shadow-sm backdrop-blur-sm">
                <header className="border-b border-[#EFECE6]/50 px-5 py-4">
                  <h3 className="text-lg font-semibold text-[#1E3A8A]">Bill Summary</h3>
                </header>

                <div className="px-5 py-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#5C769D]">Subtotal</span>
                    <span className="font-medium text-[#1E3A8A]">${toFixed2(formData.subtotal)}</span>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="taxTotal" className="text-xs uppercase tracking-wide text-[#5C769D]">
                      Tax Total
                    </Label>
                    <Input
                      id="taxTotal"
                      type="number"
                      step="0.01"
                      value={formData.taxTotal ?? ""}
                      onChange={(e) => onUpdateFormData({ taxTotal: e.target.value })}
                      className="h-10 border-none px-2 text-base shadow-none focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="discountTotal" className="text-xs uppercase tracking-wide text-[#5C769D]">
                      Discount
                    </Label>
                    <Input
                      id="discountTotal"
                      type="number"
                      step="0.01"
                      value={formData.discountTotal ?? ""}
                      onChange={(e) => onUpdateFormData({ discountTotal: e.target.value })}
                      className="h-10 border-none px-2 text-base shadow-none focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none"
                    />
                  </div>

                  <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-[#A2A8AB]/30 to-transparent" />

                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-[#1E3A8A]">Total</span>
                    <span className="text-2xl font-bold text-[#1E3A8A]">${toFixed2(formData.total)}</span>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={onCancel}
                      className="w-1/2 cursor-pointer rounded-md border border-[#EFECE6] px-4 py-2 text-[#5C769D] transition-colors hover:bg-gray-50 hover:text-[#1E3A8A]"
                      disabled={!!submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 cursor-pointer rounded-md bg-[#1E3A8A] px-4 py-2 font-medium text-white transition-colors hover:bg-[#1E3A8A]/90 disabled:opacity-60"
                      disabled={!!submitting}
                    >
                      {submitting ? "Saving..." : "Save Bill"}
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </aside>
        </form>
      </div>
    </div>
  )
}