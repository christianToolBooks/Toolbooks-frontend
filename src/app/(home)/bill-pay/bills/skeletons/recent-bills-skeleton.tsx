import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Skeleton } from "@/src/components/ui/skeleton"

export function RecentBillsSkeleton() {
  return (
    <Card>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right space-y-1">
                  <Skeleton className="h-5 w-20" />
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-3 w-3" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}