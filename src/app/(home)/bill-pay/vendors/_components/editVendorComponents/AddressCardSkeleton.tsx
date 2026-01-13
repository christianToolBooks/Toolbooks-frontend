"use client";

import { Skeleton } from "@/src/components/ui/skeleton";

export function AddressCardSkeleton() {
  return (
    <div className="p-3 bg-secondary/30 rounded-lg space-y-3 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24 bg-muted" />
            <Skeleton className="h-5 w-full bg-muted" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-10 rounded-full bg-muted" />
          <Skeleton className="h-4 w-20 bg-muted" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-md bg-muted" />
          <Skeleton className="h-8 w-20 rounded-md bg-muted" />
        </div>
      </div>
    </div>
  );
}
