"use client"

import { TableRow, TableCell } from "@/src/components/ui/table"

export function VendorsSkeletonTable() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-muted rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-40 bg-muted rounded animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-48 bg-muted rounded animate-pulse" />
          </TableCell>
          <TableCell className="text-right">
            <div className="h-8 w-8 bg-muted rounded animate-pulse ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}
