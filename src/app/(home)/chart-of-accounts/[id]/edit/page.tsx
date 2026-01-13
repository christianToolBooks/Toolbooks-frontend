'use client';

import { ArrowLeft } from 'lucide-react';
import { ChartOfAccountForm } from '../../_components/formChartOfAccount';
import { UseUpdatedCoa } from '../../hooks/useUpdatedCoa';
import { useParams } from 'next/navigation';
import { ChartOfAccountFormSkeleton } from '../../_components/loaders/coaLoaderForm';
import Link from 'next/link';

export default function EditAccount() {
  const params = useParams();
  const accountId = params?.id as string;
  const { account, errorMessage, isLoading } = UseUpdatedCoa({ accountId });

  return (
    <div>
      <div className="max-w-7xl mx-auto  sm:px-6 lg:px-8">
        <div className=" border-b border-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className=" py-2">
            <div className="flex items-center gap-6">
              <Link
                className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                href={'/chart-of-accounts'}
                passHref
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Accounts
              </Link>
            </div>

            <div className="mt-4">
              <h1 className="text-3xl font-bold text-blue-900">Edit Account</h1>
              <p className="mt-2 text-sm text-gray-600">
                Update account details
              </p>
            </div>
          </div>
        </div>

        <div className="py-8">
          {errorMessage ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
              <div className="text-center">
                <div className="text-red-500 text-lg font-medium mb-2">
                  Error
                </div>
                <p className="text-gray-600">{errorMessage}</p>
              </div>
            </div>
          ) : isLoading ? (
            <ChartOfAccountFormSkeleton />
          ) : (
            <ChartOfAccountForm account={account} isLoading={false} />
          )}
        </div>
      </div>
    </div>
  );
}
