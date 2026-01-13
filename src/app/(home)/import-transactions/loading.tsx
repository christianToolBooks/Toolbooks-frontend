// app/(home)/import-transactions/loading.tsx
import { Skeleton } from '@/src/components/ui/skeleton';
export default function LoadingImportPage() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6 px-4 lg:px-6">
      <Skeleton className="h-10 w-3/4" />

      {/* Placeholder for Upload Step or general loading */}
      <div className="border rounded-lg p-6 space-y-4">
        <Skeleton className="h-8 w-1/2" /> {/* Card Title */}
        <Skeleton className="h-6 w-full" /> {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Skeleton className="h-10 w-24" /> {/* Button */}
          <Skeleton className="h-10 w-32" /> {/* Button */}
        </div>
      </div>

      {/* Placeholder for privacy/format notes */}
      <div className="border rounded-lg p-4 space-y-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-6 w-1/3 mt-2" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}
