"use client";
import { Card, CardContent } from "@/src/components/ui/card";

interface BankAccountsSkeletonProps {
  count?: number;
}

export function BankAccountsSkeleton({ count = 3 }: BankAccountsSkeletonProps) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-[#1E3A8A]/10 shadow-sm">
          <CardContent className="p-4 flex gap-3 items-start">
            <div className="h-10 w-10 rounded-lg bg-[#1E3A8A]/10" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
              <div className="h-3 w-1/2 bg-gray-200 rounded" />
              <div className="h-3 w-3/4 bg-gray-200 rounded" />
              <div className="h-2 w-1/4 bg-gray-200 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
