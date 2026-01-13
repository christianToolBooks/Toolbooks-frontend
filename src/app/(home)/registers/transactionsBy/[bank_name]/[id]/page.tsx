"use client";
import { useParams } from "next/navigation";
import { TransactionsTable } from "../../../_components/transactionByAccount/transactions-table";
import { Separator } from "@/src/components/ui/separator";
import { format } from "date-fns";

export default function Home() {
  const params = useParams();
  const accountNameRaw = params?.bank_name as string;
  const accountId = params?.id as string;
  const accountName = decodeURIComponent(accountNameRaw.replace(/-/g, " "));

  return (
    <div className="@container/main px-4 lg:px-6">
      <div className="flex flex-col items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-chart-1 dark:text-gray-100">
          {accountName}
        </h1>

        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Here you can Manage your {accountName} associated with your Business.
        </p>
        <p className="text-sm text-gray-500">
          As of {format(new Date(), "MMMM dd, yyyy")}
        </p>
      </div>
      <Separator className="mb-2" />

      <div className="h-full">
        <TransactionsTable plaidItemId={accountId} transactions={[]} onAccountSelect={() => {}} />
      </div>
    </div>
  );
}
