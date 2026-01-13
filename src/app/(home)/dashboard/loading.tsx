import React from 'react';
import { Skeleton } from '@/src/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/src/components/ui/card';

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-8">
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-8 w-4/5" />
            </CardHeader>

            <CardFooter className="flex-col items-start gap-1 pt-2 text-sm">
              <Skeleton className="h-4 w-1/2" />
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-4 md:gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-1/4 mb-2" />
          </CardHeader>

          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-1/4 mb-2" />
          </CardHeader>

          <CardContent>
            <div className="space-y-2">
              {[...Array(5)].map(
                (
                  _,
                  i 
                ) => (
                  <div key={i} className="flex justify-between gap-4">
                    <Skeleton className="h-5 flex-1" />
                    <Skeleton className="h-5 flex-1" />
                    <Skeleton className="h-5 flex-1" />
                    <Skeleton className="h-5 w-1/4" />
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
