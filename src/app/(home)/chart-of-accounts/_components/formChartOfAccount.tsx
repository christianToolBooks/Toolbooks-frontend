import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Save, X } from 'lucide-react';

import { Account, normalBalanceTypes } from '@/src/types/chart-of-accounts';

import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { accountFormSchema, AccountFormValues } from '@/src/lib/schemas/coa';
import { formatBusinessType, formatDate } from '@/src/lib/utils/formatters';
import { Textarea } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { UseUpdatedCoa } from '../hooks/useUpdatedCoa';
import { UseCreateCoa } from '../hooks/useCreateCoa';

interface ChartOfAccountFormProps {
  account?: Account | undefined;
  isLoading: boolean;
  businessType?: string;
}

const accountTypes = [
  { value: 'asset', label: 'Asset' },
  { value: 'liability', label: 'Liability' },
  { value: 'equity', label: 'Equity' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

export function ChartOfAccountForm({
  account,
  businessType,
}: ChartOfAccountFormProps) {
  const { isSendData, updatedAccount } = UseUpdatedCoa({});
  const { createCoa, isLoading } = UseCreateCoa();
  const isEditing = !!account;

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      account_code: account?.account_code || '',
      account_name: account?.account_name || '',
      account_type: account?.account_type || 'asset',
      normal_balance: account?.normal_balance || 'debit',
      description: account?.description || '',
      reporting_category: account?.reporting_category || '',
    },
  });

  return (
    <div className={`w-full max-w-7xl mx-auto ${account ? '' : 'ml-[9rem]'}`}>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3">
          <Card className="shadow-sm border-gray-200">
            <CardContent className="p-7">
              <Form {...form}>
                <form
                  className="space-y-8"
                  onSubmit={form.handleSubmit(data => {
                    if (account?.id) {
                      updatedAccount(data, account.id);
                    } else {
                      createCoa(data);
                    }
                  })}
                >
                  {/* Account Code and Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="account_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Account Code *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="20000"
                              {...field}
                              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="account_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Account Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Accounts Payable"
                              {...field}
                              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="account_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Account Type *
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                <SelectValue placeholder="Select account type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {accountTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="normal_balance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Normal Balance *
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                <SelectValue placeholder="Select normal balance" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {normalBalanceTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isEditing && (
                      <div className="space-y-2">
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Business Type
                        </FormLabel>
                        <Input
                          value={formatBusinessType(account.business_type)}
                          disabled
                          className="h-11 bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                        />
                        <p className="text-xs text-gray-500">
                          Business type cannot be changed
                        </p>
                      </div>
                    )}
                    <FormField
                      control={form.control}
                      name="reporting_category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Reporting Category
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Current Liabilities"
                              {...field}
                              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Optional description for this account"
                            className="p-4 resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
                    <Link
                      href={'/chart-of-accounts'}
                      passHref
                      className="h-10 px-6 flex items-center border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent cursor-pointer"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Link>
                    <Button
                      type="submit"
                      disabled={isLoading || isSendData}
                      className="h-11 px-6 bg-blue-900 hover:bg-blue-800 text-white cursor-pointer"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isEditing
                        ? isSendData
                          ? 'Updating...'
                          : 'Update Account'
                        : isLoading
                          ? 'Creating...'
                          : 'Create Account'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {isEditing && (
          <div className="xl:col-span-1">
            <Card className="shadow-sm border-gray-200 sticky top-6">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Account Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-600">
                      Status:
                    </span>
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded-full 
                      }`}
                    >
                      {account.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-600">
                      Business Type:
                    </span>
                    <span className="text-sm text-gray-900 font-medium">
                      {formatBusinessType(account.business_type)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-600">
                      Created:
                    </span>
                    <span className="text-sm text-gray-900">
                      {formatDate(account.createdAt)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-600">
                      Last Updated:
                    </span>
                    <span className="text-sm text-gray-900">
                      {formatDate(account.updatedAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
