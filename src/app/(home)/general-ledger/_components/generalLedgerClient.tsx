"use client";

import { BankTransaction, GeneralLedgerLine, Transaction } from "@/src/types/generaldLedgerTypes";
import { GeneralLedgerTable } from "./generalLedgerComponents/GlDataTable";
import GeneralLedgerFilers from "./generalLedgerComponents/GlFilters";
import { ColumnDef } from "@tanstack/react-table";
import {
  AccountFilterType,
  DateFilter,
} from "../hooks/generalLedgerHooks/useGeneralLedger";
import { Dispatch, SetStateAction } from "react";
import { GeneralLedgerTableSkeleton } from "./generalLedgerComponents/GlLoader";
import { Button } from "@/src/components/ui/button";
import {
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination";

interface GeneralLedgerClientProps {
  /**
   * Table columns definition.
   */
  columns: ColumnDef<GeneralLedgerLine>[];
  transactions: GeneralLedgerLine[];
  setDateToFilter: Dispatch<SetStateAction<DateFilter>>;
  setAccountFilter: Dispatch<SetStateAction<AccountFilterType | null>>;
  isLoading: boolean;
  refresh?: () => Promise<void>;
  /**
   * Pagination state and handlers.
   */
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalPages?: number;
}

export function GeneralLedgerClient({
  transactions,
  columns,
  setDateToFilter,
  setAccountFilter,
  isLoading,
  page,
  setPage,
  totalPages,
  refresh,
}: GeneralLedgerClientProps) {

 
  return (
    <div className="space-y-3">
      <GeneralLedgerFilers
        setDateToFilter={setDateToFilter}
        setAccountFilter={setAccountFilter}
        refresh={refresh}
        setPage={setPage}
        loading={isLoading}
      />

      {isLoading ? (
        <GeneralLedgerTableSkeleton />
      ) : (
        <GeneralLedgerTable columns={columns} data={transactions} />
      )}

      <div className="flex items-center justify-center p-4">
        <div className="flex items-center">
          <PaginationContent className="gap-6">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                size="sm"
                onClick={() => setPage(page - 1)}
                className={
                  page === 1 || page < 1
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>
            <PaginationItem>
              <p className="text-sm font-medium">
                Page {page} of {totalPages}
              </p>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                className={
                  page === totalPages
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
                size="sm"
                onClick={() => setPage(page + 1)}
              />
            </PaginationItem>
          </PaginationContent>

          {/* <Button
            className="cursor-pointer"
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button> */}
        </div>
      </div>
    </div>
  );
}
