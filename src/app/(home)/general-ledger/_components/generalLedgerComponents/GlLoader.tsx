"use client"

import { Card, CardContent } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Skeleton } from "@/src/components/ui/skeleton"

export function GeneralLedgerTableSkeleton() {
  return (
    <div className="w-full space-y-4">
      <Card>
        <CardContent className="p-3">
          <div className="">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-24" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-24" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-12" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-14" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-12" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 20 }).map((_, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    {/* Date Column */}
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>

                    {/* Merchant Column */}
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <div className="flex items-center gap-1">
                          <Skeleton className="h-3 w-3 rounded-full" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </TableCell>

                    {/* Account Column */}
                    <TableCell>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </TableCell>

                    {/* Bank Account Column */}
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1">
                          <Skeleton className="h-3 w-3 rounded-sm" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </TableCell>

                    {/* Debit Column */}
                    <TableCell>
                      <div className="text-right">
                        {index % 3 === 0 ? (
                          <Skeleton className="h-5 w-16 ml-auto" />
                        ) : (
                          <div className="text-right text-slate-300">—</div>
                        )}
                      </div>
                    </TableCell>

                    {/* Credit Column */}
                    <TableCell>
                      <div className="text-right">
                        {index % 3 === 1 ? (
                          <Skeleton className="h-5 w-16 ml-auto" />
                        ) : (
                          <div className="text-right text-slate-300">—</div>
                        )}
                      </div>
                    </TableCell>

                    {/* Status Column */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </div>
                    </TableCell>

                    {/* Balance Column */}
                    <TableCell>
                      <div className="text-right">
                        <Skeleton className="h-5 w-20 ml-auto" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
