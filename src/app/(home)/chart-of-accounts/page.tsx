'use client';

import { ChartOfAccountsClient } from './_components/chartOfAccountsClient';
import { createColumnsCoa } from './_components/chartOfAccountsColumns';
import { UseChartOfAccount } from './hooks/useChartOfAccount';
import ChartOfAccountsLoading from './loading';

export default function ChartOfAccountsPage() {
  const { coa, errorMessage, isLoading, refetch } = UseChartOfAccount();
  const columns = createColumnsCoa(refetch);

  return (
    <div className="@container/main px-4 lg:px-6">
      <header className="flex flex-col items-center p-4 gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-chart-1 dark:text-gray-100">
          Chart Of Accounts
        </h1>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Here you can manage you’r Accounts template
        </p>
      </header>

      {isLoading ? (
        <ChartOfAccountsLoading />
      ) : errorMessage ? (
        <div className="w-full text-center py-10">
          <h2 className="text-red-500 dark:text-red-400">{errorMessage}</h2>
        </div>
      ) : (
        <ChartOfAccountsClient columns={columns} data={coa} refetch={refetch} />
      )}
    </div>
  );
}
