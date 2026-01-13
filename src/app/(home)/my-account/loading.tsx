// components/BrandingCardLoader.tsx
import { Skeleton } from '@/src/components/ui/skeleton';

export default function BrandingCardLoader() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6">
          <Skeleton className="w-32 h-32 rounded-lg mb-4" />
          <Skeleton className="h-9 w-16 rounded-md" /> {/* Edit button */}
        </div>

        {/* Business Info Section */}
        <div className="relative mb-8">
          {/* Edit link in top right */}
          <div className="absolute top-0 right-0">
            <Skeleton className="h-4 w-8" />
          </div>

          {/* Business Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Business Name */}
              <div>
                <Skeleton className="h-5 w-28 mb-2" /> {/* Label */}
                <Skeleton className="h-4 w-24" /> {/* Value */}
              </div>

              {/* Business Email */}
              <div>
                <Skeleton className="h-5 w-32 mb-2" /> {/* Label */}
                <Skeleton className="h-4 w-48" /> {/* Value */}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Business Phone */}
              <div>
                <Skeleton className="h-5 w-32 mb-2" /> {/* Label */}
                <Skeleton className="h-4 w-28" /> {/* Value */}
              </div>

              {/* Business Address */}
              <div>
                <Skeleton className="h-5 w-36 mb-2" /> {/* Label */}
                <Skeleton className="h-4 w-52" /> {/* Value */}
              </div>
            </div>
          </div>

          {/* Update Button */}
          <div className="flex justify-end">
            <Skeleton className="h-9 w-20 rounded-md" />
          </div>
        </div>

        {/* Footer Timestamps - DENTRO de la carta */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <Skeleton className="h-4 w-36" /> {/* Created date */}
          <Skeleton className="h-4 w-40" /> {/* Last updated date */}
        </div>
      </div>
    </div>
  );
}
