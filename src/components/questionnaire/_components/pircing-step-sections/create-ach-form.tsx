/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  ACHToPayResponse,
  BankToPayTypeEnum,
  PayarcAccountType,
} from "@/src/types/paymentMethods";
import { useCreateAchForm } from "../../_hooks/useCreateAchForm";
import { useEffect } from "react";
import { Building2, Check, CreditCard } from "lucide-react";
import { BankAccountsSkeleton } from "../skeletons/bankAccountsSkeleton";

export interface CreateACHFormProps {
  customerId: string;
  onSelectACH?: (id: string) => void;
  onSuccess?: (data: { type_ach_bank: BankToPayTypeEnum }) => void;
}

export function CreateACHForm({ customerId, onSelectACH }: CreateACHFormProps) {
  const form = useCreateAchForm(customerId, undefined, onSelectACH);

  useEffect(() => {
    form.getAllACHToPay();
  }, []);

  const loadingBanks = form.loadingAllACH;

  const accountType = form.watch("account_type");
  const isBusiness =
    accountType === PayarcAccountType.BUSINESS_CHECKING ||
    accountType === PayarcAccountType.BUSINESS_SAVINGS;

  return (
    <div className="space-y-8">
      <section>
        {loadingBanks ? (
          <>
            <h3 className="text-md font-semibold text-[#1E3A8A] flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5" />
              Loading bank accounts...
            </h3>
            <BankAccountsSkeleton
              count={Math.max(form.getAllACH?.data?.length || 0, 3)}
            />
          </>
        ) : form.getAllACH?.data && form.getAllACH.data.length > 0 ? (
          <>
            <div className="mb-8">
              <h3 className="text-md font-semibold text-[#1E3A8A] flex items-center gap-2 mb-2">
                Bank Accounts
              </h3>
              <p className="text-sm text-gray-500 mt-1 text-start">
                Select a bank account for payments
              </p>
            </div>

            <div className="space-y-3">
              {form.getAllACH.data.map((account: ACHToPayResponse) => (
                <div
                  key={account.id}
                  onClick={() => form.handleSelectACH(account.id)}
                  className={`group relative p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                    form.selectedACHId === account.id
                      ? "border-gray-400 bg-gray-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-md flex items-center justify-center transition-all duration-200 ${
                          form.selectedACHId === account.id
                            ? "bg-chart-1 text-white"
                            : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                        }`}
                      >
                        {form.selectedACHId === account.id ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Building2 className="w-5 h-5" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <p className="font-medium text-gray-900 truncate">
                          {account.first_name} {account.last_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {account.company_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span>{account.account_type}</span>
                        <span className="text-gray-300">•</span>
                        <span className="font-mono">
                          {account.routing_number}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-600 italic">
            No bank accounts found. Add one below.
          </p>
        )}
      </section>

      <section>
        <h3 className="text-md font-semibold text-[#1E3A8A] flex items-center gap-2">
          Add New Bank Account
        </h3>

        <Card className="border-none shadow-none">
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  placeholder="John"
                  {...form.register("first_name")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  placeholder="Doe"
                  {...form.register("last_name")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account_type">Account Type</Label>
                <Select
                  value={form.watch("account_type")}
                  onValueChange={(val) =>
                    form.setValue("account_type", val as PayarcAccountType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Account Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PayarcAccountType.PERSONAL_CHECKING}>
                      Personal Checking
                    </SelectItem>
                    <SelectItem value={PayarcAccountType.PERSONAL_SAVINGS}>
                      Personal Savings
                    </SelectItem>
                    <SelectItem value={PayarcAccountType.BUSINESS_CHECKING}>
                      Business Checking
                    </SelectItem>
                    <SelectItem value={PayarcAccountType.BUSINESS_SAVINGS}>
                      Business Savings
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {isBusiness && (
                <div className="space-y-2">
                  <Label htmlFor="company_name">
                    Company Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="company_name"
                    placeholder="Acme Corp"
                    {...form.register("company_name")}
                    className={form.errors.company_name ? "border-red-500" : ""}
                  />
                  {form.errors.company_name && (
                    <p className="text-sm text-red-500">
                      {form.errors.company_name.message}
                    </p>
                  )}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="account_number">Account Number</Label>
                <Input
                  id="account_number"
                  placeholder="123456789"
                  {...form.register("account_number")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="routing_number">Routing Number</Label>
                <Input
                  id="routing_number"
                  placeholder="987654321"
                  {...form.register("routing_number")}
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={form.handleSubmit}
              disabled={form.loading}
              className="w-full bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90 transition-all"
            >
              {form.loading ? "Saving..." : "Save Bank Account"}
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
