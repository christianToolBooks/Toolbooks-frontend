import { Skeleton } from "@/src/components/ui/skeleton";

export default function ContactCardSkeleton() {
  return (
    <div className="p-3 bg-secondary/30 rounded-lg space-y-2 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 flex-1">
          <div className="h-4 w-4 bg-muted rounded-full mt-1" />
          <div className="grid grid-cols-5 gap-4 flex-1">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-4 bg-muted rounded w-32" />
            <div className="h-4 bg-muted rounded w-20" />
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-4 bg-muted rounded w-28" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-muted rounded-md" />
          <div className="h-8 w-8 bg-muted rounded-md" />
        </div>
      </div>
      <div className="ml-8 mt-1">
        <div className="h-3 w-20 bg-muted rounded" />
      </div>
    </div>
  );
}
