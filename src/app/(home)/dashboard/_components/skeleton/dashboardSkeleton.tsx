"use client";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="flex flex-1 flex-col animate-pulse">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="px-4 lg:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-4">
                <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 w-16 bg-gray-300 rounded"></div>
              </Card>
            ))}
          </div>

          <div className="px-4 lg:px-6">
            <Card className="p-6">
              <div className="h-5 w-40 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              </div>
              <div className="mt-4 h-10 w-32 bg-gray-300 rounded"></div>
            </Card>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <div className="h-5 w-32 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg"
                    >
                      <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                        <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
                        <div className="flex gap-2">
                          <div className="h-4 w-16 bg-gray-200 rounded"></div>
                          <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="px-4 lg:px-6">
            <Card className="p-6">
              <div className="h-5 w-40 bg-gray-200 rounded mb-4"></div>
              <div className="h-[200px] w-full bg-gray-100 rounded"></div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
