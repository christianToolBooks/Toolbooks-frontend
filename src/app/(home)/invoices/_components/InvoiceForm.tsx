"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useFieldArray } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, Loader2, PlusCircle, Trash2 } from "lucide-react";
import Image from "next/image";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Calendar } from "@/src/components/ui/calendar";
import { cn } from "@/src/lib/utils/utils";
import { Invoice } from "@/src/types/invoice";
import { formatCurrency, formatPhoneDisplay } from "@/src/lib/utils/formatters";
import BrandingLoading from "./loaders/LoadingBranding";
import { UseInvoiceContex } from "../context/invoiceProvider";
import { useInvoiceForm } from "../hooks/useInvoiceForm";
import { Textarea } from "@/src/components/ui/textarea";
import SelectCustomerInvoice from "./selectCustomerInvoice";



export function InvoiceForm() {
  const router = useRouter();
  const {
    branding: brandingSettings,
    isLoadingBranding,
    isLoadingCustomers,
  } = UseInvoiceContex();

  const {
    form,
    watchedItems,
    isSubmitting,
    setCustomerInfo,
    customerInfo,
    subtotal,
    taxTotal,
    totalAmount,
    invoiceNumber,
    onSubmit,
  } = useInvoiceForm({ initialData: null });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  return (
    <>
      <header className="mb-8 p-6 rounded-lg border flex justify-between items-center bg-card">
        {isLoadingBranding ? (
          <BrandingLoading />
        ) : (
          <>
            <div className="h-25">
              <h2 className="text-xl font-bold mb-2">
                {brandingSettings?.business_name
                  ? brandingSettings?.business_name
                  : "Unknown name"}
              </h2>

              <div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {brandingSettings?.email
                    ? brandingSettings?.email
                    : "example@gmail.com"}
                </p>

                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {brandingSettings?.primary_contact
                    ? formatPhoneDisplay(brandingSettings.primary_contact)
                    : "+1 (234)567-890"}
                </p>

                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {brandingSettings?.business_address
                    ? brandingSettings?.business_address
                    : "123 Business Street, City, Country"}
                </p>
              </div>
            </div>

            {brandingSettings?.logo_url && (
              <Image
                src={
                  brandingSettings.logo_url ||
                  "https://img.icons8.com/ios-filled/100/000000/no-image.png"
                }
                alt="Company logo"
                width={100}
                height={60}
                className="object-contain"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
          </>
        )}
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Select a Customer</CardTitle>
            </CardHeader>

            <CardContent>
              <SelectCustomerInvoice
                setCustomerInfo={setCustomerInfo}
                customerName={customerInfo.name}
                customerInfo={customerInfo}
                isLoading={isLoadingCustomers}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between gap-2">
                <div className="flex gap-6 items-center">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="invoiceDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Invoice Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value + "T00:00:00"), "PPP")
                              ) : (
                                <span>Select invoice date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value
                                ? new Date(field.value + "T00:00:00")
                                : undefined
                            }
                            onSelect={(date) => {
                              if (date) {
                                const year = date.getFullYear();
                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                const day = String(date.getDate()).padStart(2, "0");
                                field.onChange(`${year}-${month}-${day}`);
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value + "T00:00:00"), "PPP")
                              ) : (
                                <span>Select due date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value
                                ? new Date(field.value + "T00:00:00")
                                : undefined
                            }
                            onSelect={(date) => {
                              if (date) {
                                const year = date.getFullYear();
                                const month = String(date.getMonth() + 1).padStart(2, "0");
                                const day = String(date.getDate()).padStart(2, "0");
                                field.onChange(`${year}-${month}-${day}`);
                              }
                            }}
                            disabled={(date) =>
                              date < new Date(form.watch("invoiceDate") + "T00:00:00")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

                {/* Currency Display */}
                  <div>
                    <p className="text-sm font-medium text-chart-2">
                      Currency
                    </p>
                    <div className="flex items-center gap-2 ">
                      <p className="text-sm font-semibold text-chart-1 px-1 py-2">
                        USD - US Dollar
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 items-end">
                  <div className="flex items-center gap-10">
                    <div>
                      <p className="text-md font-medium text-blue-900">
                        Invoice Number
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        This number will be assigned to your invoice
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-900 font-mono">
                        {invoiceNumber || "Generating..."}
                      </p>
                      {invoiceNumber && (
                        <p className="text-xs text-blue-600 mt-1">
                          ✓ Ready to use
                        </p>
                      )}
                    </div>
                  </div>
                </div>

              </div>


              {/* Memo Field */}
              <FormField
                control={form.control}
                name="memo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Memo (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Add any notes or special instructions..."
                        className="resize-none"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Items</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flow-root overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/4">Description</TableHead>
                      <TableHead className="w-20">Quantity</TableHead>
                      <TableHead className="w-28">Unit Price</TableHead>
                      <TableHead className="w-32">Department</TableHead>
                      <TableHead className="w-32">Tax Code</TableHead>
                      <TableHead className="w-28 text-right">Amount</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {fields.map((field, index) => {
                      const item = watchedItems?.[index] || {
                        lineNo: index + 1,
                        description: "",
                        quantity: "0",
                        unitPrice: "0",
                        amount: "0",
                        department: "",
                        taxCode: "",
                      };

                      const amount = parseFloat(item.amount) || 0;

                      return (
                        <TableRow key={field.id}>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`items.${index}.description`}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="Service description"
                                />
                              )}
                            />
                          </TableCell>

                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`items.${index}.quantity`}
                              render={({ field }) => (
                                <Input
                                  type="number"
                                  step="1"
                                  min="1"
                                  {...field}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 1;
                                    field.onChange(value.toString());
                                  }}
                                />
                              )}
                            />
                          </TableCell>

                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`items.${index}.unitPrice`}
                              render={({ field }) => (
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  {...field}
                                />
                              )}
                            />
                          </TableCell>

                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`items.${index}.department`}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="e.g. Operations"
                                  maxLength={50}
                                />
                              )}
                            />
                          </TableCell>

                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`items.${index}.taxCode`}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="e.g. Standard"
                                  maxLength={30}
                                />
                              )}
                            />
                          </TableCell>

                          <TableCell className="text-right font-medium">
                            {formatCurrency(amount)}
                          </TableCell>

                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                              disabled={fields.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4 cursor-pointer"
                onClick={() =>
                  append({
                    lineNo: fields.length + 1,
                    description: "",
                    quantity: "1",
                    unitPrice: "0.00",
                    amount: "0.00",
                    department: "",
                    taxCode: "",
                  })
                }
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </CardContent>
          </Card>

          {/* Section 3: Summary Only (dates moved to Invoice Details) */}
          <div className="flex justify-end">
            <div className="w-full max-w-sm space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Tax:</span>
                <span>{formatCurrency(taxTotal)}</span>
              </div>

              <div className="flex justify-between text-lg font-bold">
                <span>Total Due:</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Actions */}
          <div className="flex justify-end space-x-4 pt-10">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || !invoiceNumber}
              className="cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Create Invoice
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
