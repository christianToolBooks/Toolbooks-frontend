"use client"

import { Label } from "@/src/components/ui/label"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/src/components/ui/pagination"

interface TransactionsPaginationProps {
  currentPage: number
  totalPages: number
  filteredCount: number
  setPage: (page: number) => void
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export function TransactionsPagination({
  currentPage,
  totalPages,
  setPage,
  hasPreviousPage,
  hasNextPage,
}: TransactionsPaginationProps) {

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 p-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => setPage(currentPage - 1)}
              className={!hasPreviousPage ? "pointer-events-none opacity-50" : undefined}
            />
          </PaginationItem>
          <PaginationItem>
            <div className="flex items-center justify-center h-9 px-4 py-2 text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => setPage(currentPage + 1)}
              className={!hasNextPage ? "pointer-events-none opacity-50" : undefined}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}