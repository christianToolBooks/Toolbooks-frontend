"use client";

import { GeneralLedgerClient } from "./_components/generalLedgerClient";
import { format } from "date-fns";
import UseGeneralLedger from "./hooks/generalLedgerHooks/useGeneralLedger";
import { GeneralLedgerColumns } from "./_components/generalLedgerComponents/GlColumns";
import useInstitutions from "@/src/hooks/useInstitutions";
import NoBanksFoundedScreen from "./_components/noFoundsScreen";

export default function GeneralLedger() {
  const {
    isLoading,
    transactions,
    setDateToFilter,
    setAccountFilter,
    page,
    setPage,
    totalPages,
    refresh,
  } = UseGeneralLedger();
  const { institutions  } = useInstitutions();

  const columns = GeneralLedgerColumns();
  if (institutions.length === 0 && !isLoading) {
    return (
      <NoBanksFoundedScreen/>
    );
  } 
  return (
    <div className="@container/main px-4 lg:px-6">
      <div className="text-center flex-1 p-10">
        <h1 className="text-2xl font-bold">GENERAL LEDGER</h1>
        <p className="text-sm text-gray-600 mt-1">
          Global Report of All Activity - Banks, Credit Cards & Journal Entries
        </p>
        <p className="text-sm text-gray-500">
          As of {format(new Date(), "MMMM dd, yyyy")}
        </p>
      </div>
      <GeneralLedgerClient
        transactions={transactions}
        columns={columns}
        setDateToFilter={setDateToFilter}
        setAccountFilter={setAccountFilter}
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        refresh={refresh}
      />
    </div>
  );
}
