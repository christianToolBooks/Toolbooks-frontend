import { Skeleton } from '@/src/components/ui/skeleton';

export default function BrandingLoading() {
  return (
    <div className="flex justify-between items-center w-full">
      {/* Left side - Business info */}
      <div className="h-25">
        {/* Business name */}
        <Skeleton className="h-7 w-48 mb-2" />

        {/* Contact information */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-56" /> {/* Email */}
          <Skeleton className="h-4 w-36" /> {/* Phone */}
          <Skeleton className="h-4 w-64" /> {/* Address */}
        </div>
      </div>

      {/* Right side - Logo placeholder */}
      <Skeleton className="h-[60px] w-[150px] rounded" />
    </div>
  );
}
