'use client';

import type React from 'react';
import type { UseFormReturn } from 'react-hook-form';

import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import type { CreateCustomerData } from '@/src/types/customer';
import { CustomerFormValues } from '@/src/lib/schemas/customer';
import { Form, FormField, FormMessage } from '@/src/components/ui/form';
import { formatPhoneInput } from '@/src/lib/utils/formatters';

interface CustomerFormProps {
  onSubmit: (data: CreateCustomerData) => void;
  isLoading?: boolean;
  form: UseFormReturn<CustomerFormValues>;
}

export function CustomerForm({
  onSubmit,
  isLoading,
  form,
}: CustomerFormProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle style={{ fontSize: '15px' }}>
          Create a new Customer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(data => onSubmit(data))}
            className="flex max-md:flex-col gap-4 md:items-end"
          >
            <div className="flex-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <>
                    <FormMessage />
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <Input {...field} placeholder="Enter customer name..." />
                  </>
                )}
              />
            </div>

            <div className="flex-1">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <>
                    <FormMessage />
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter customer Email..."
                    />
                  </>
                )}
              />
            </div>

            <div className="flex-1">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <>
                    <FormMessage />
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone
                    </Label>
                    <div className='relative'>
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none z-10">
                        +1
                      </span>
                      <Input
                        value={formatPhoneInput(field.value)}
                        className="pl-10"
                        placeholder="(234) 567-8900"
                        onChange={e => {
                          const numbers = e.target.value.replace(/\D/g, '');
                          field.onChange(numbers);
                        }}
                        maxLength={14}
                      />
                    </div>
                  </>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-chart-1 text-white hover:bg-chart-2 cursor-pointer"
            >
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
