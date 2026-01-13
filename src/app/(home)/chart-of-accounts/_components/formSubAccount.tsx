import { useForm } from 'react-hook-form';
import { Save, X } from 'lucide-react';
import Link from 'next/link';

import { normalBalanceTypes, SubAccount } from '@/src/types/chart-of-accounts';

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
  subAccountFormSchema,
  SubAccountFormValues,
} from '@/src/lib/schemas/subAccount';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/src/components/ui/button';
import { Textarea } from '@/src/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Select, SelectContent, SelectItem } from '@/src/components/ui/select';
import { UseSubAccount } from '../hooks/useSubAccount';
import { formatBusinessType, formatDate } from '@/src/lib/utils/formatters';

interface SubAccountFormProps {
  accountId?: string;
  accountType: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  subAccount?: SubAccount;
}

export function SubAccountForm({
  accountId,
  accountType,
  subAccount,
}: SubAccountFormProps) {
  const { isLoading, createSubAccount, updatedSubAccount } = UseSubAccount({
    ...(subAccount ? {} : { accountId }),
  });

  const form = useForm<SubAccountFormValues>({
    resolver: zodResolver(subAccountFormSchema),
    defaultValues: {
      account_code: subAccount?.account_code || '',
      account_name: subAccount?.account_name || '',
      account_type: accountType,
      normal_balance: subAccount?.normal_balance || 'debit',
      description: subAccount?.description || '',
      reporting_category: subAccount?.reporting_category || '',
    },
  });

  return (
    <div className={`w-full max-w-7xl mx-auto`}>
      <div className={`grid grid-cols-1 xl:grid-cols-${subAccount ? '4' : '3'} gap-8`}>
        <div className="xl:col-span-3">
          <Card className="shadow-sm border-gray-200">
            <CardContent className="p-7">
              <Form {...form}>
                <form
                  className="space-y-8"
                  onSubmit={form.handleSubmit(data => {
                    if (subAccount) {
                      updatedSubAccount(subAccount.id, data);
                    } else {
                      createSubAccount(data);
                    }
                  })}
                >
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
                            disabled={true}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                <SelectValue placeholder="account type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem key={accountType} value={accountType}>
                                {accountType}
                              </SelectItem>
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
                      disabled={isLoading}
                      className="h-11 px-6 bg-blue-900 hover:bg-blue-800 text-white cursor-pointer"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading
                        ? subAccount
                          ? 'Updating Sub Account...'
                          : 'Creating Sub Account...'
                        : subAccount
                          ? 'Update Sub Account'
                          : 'Create Sub Account'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        {subAccount && (
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
                      {subAccount.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-600">
                      Business Type:
                    </span>
                    <span className="text-sm text-gray-900 font-medium">
                      {formatBusinessType(subAccount.business_type)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-600">
                      Created:
                    </span>
                    <span className="text-sm text-gray-900">
                      {formatDate(subAccount.createdAt)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-600">
                      Last Updated:
                    </span>
                    <span className="text-sm text-gray-900">
                      {formatDate(subAccount.updatedAt)}
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
