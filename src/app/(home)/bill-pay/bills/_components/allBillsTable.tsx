"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination"
import { MoreHorizontal, Eye, Edit, Calendar, X } from "lucide-react"
import { BillDataResponseFromAPI } from "@/src/types/billPayTypes"
import { getPriorityColor, getStatusColor } from "../../_helpers/helpersToBill"

export function AllBillsTable({
  bills,
  onClose,
  onViewBill,
}: {
  bills: BillDataResponseFromAPI[]
  onClose: () => void
  onViewBill: (bill: BillDataResponseFromAPI) => void
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const paginatedBills = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return bills.slice(startIndex, endIndex)
  }, [bills, currentPage])

  const totalPages = Math.ceil(bills.length / itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>All Bills ({bills.length})</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Financial Status</TableHead>
                <TableHead>Memo</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.invoiceNumber}</TableCell>
                  <TableCell>{bill.vendor_name}</TableCell>
                  <TableCell className="font-medium">${Number.parseFloat(bill.total).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      {bill.dueDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    {bill.status && (
                      <Badge className={getStatusColor(bill.status || '')}>
                        {bill.status.replace("_", " ")}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {bill.financialStatus && (
                      <Badge className={getPriorityColor(bill.financialStatus || '')}>
                        {bill.financialStatus.replace("_", " ")}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{bill.memo || "-"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewBill(bill)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
