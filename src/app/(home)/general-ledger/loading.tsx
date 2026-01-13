// app/(home)/income-expenses/loading.tsx
import { Skeleton } from '@/src/components/ui/skeleton';

export default function GeneralLedgerLoader() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* Skeleton for Filters Card */}
      <div className="mb-6">
        <Skeleton className="h-8 w-1/4 mb-2" /> {/* Card Title */}
        <Skeleton className="h-6 w-1/2 mb-4" /> {/* Card Description */}
        <Skeleton className="h-10 w-full md:w-[300px]" />{' '}
        {/* Select Dropdown */}
      </div>

      {/* Skeleton for Table Title Area or "No account selected" message area */}
      <Skeleton className="h-10 w-3/4 md:w-1/2 mt-6" />

      {/* Skeleton for Table itself */}
      <div className="space-y-2 mt-4">
        <Skeleton className="h-12 w-full" /> {/* Table Header */}
        <Skeleton className="h-10 w-full" /> {/* Table Row */}
        <Skeleton className="h-10 w-full" /> {/* Table Row */}
        <Skeleton className="h-10 w-full" /> {/* Table Row */}
        <Skeleton className="h-10 w-full" /> {/* Table Row */}
      </div>

      {/* Skeleton for Totals Summary */}
      <div className="mt-6">
        <Skeleton className="h-8 w-1/3 mb-3" /> {/* Summary Title */}
        <Skeleton className="h-6 w-full mb-2" /> {/* Summary Line 1 */}
        <Skeleton className="h-6 w-full mb-2" /> {/* Summary Line 2 */}
        <Skeleton className="h-6 w-full" /> {/* Summary Line 3 (Net) */}
      </div>
    </div>
  );
}
