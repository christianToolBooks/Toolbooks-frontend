import { Card, CardContent } from "@/src/components/ui/card"
import { Skeleton } from "@/src/components/ui/skeleton"

export function BillMetricsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-8 w-16 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
