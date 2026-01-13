// app/invoices/_components/InvoiceFormLoading.tsx
'use client';

import { Skeleton } from '@/src/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/src/components/ui/card';

export default function InvoiceFormLoading() {
  return (
    <div className="space-y-8">
      {/* Header Loading */}
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <div className="space-y-3">
            <Skeleton className="h-6 w-52" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-48" />
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3.5 w-60" />
            </div>
          </div>
          <Skeleton className="h-[60px] w-[150px] rounded-md" />
        </div>
      </Card>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Table skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="grid grid-cols-6 gap-4">
                <Skeleton className="h-9 col-span-2" />
                <Skeleton className="h-9" />
                <Skeleton className="h-9" />
                <Skeleton className="h-9" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            ))}
          </div>

          <Skeleton className="h-9 w-28" />
        </CardContent>
      </Card>

      {/* Summary Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <Skeleton className="h-9 w-full" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Skeleton className="h-9 w-16" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
