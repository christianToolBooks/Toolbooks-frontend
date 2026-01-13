'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SubAccountForm } from '../../../../_components/formSubAccount';
import { UseSubAccount } from '../../../../hooks/useSubAccount';
import { ChartOfAccountFormSkeleton } from '../../../../_components/loaders/coaLoaderForm';

export default function EditSubAccount() {
  const params = useParams();
  const subaAccountId = params?.id as string;

  const { subAccount, isLoading } = UseSubAccount({
    subAccountId: subaAccountId,
  });

  if (!subAccount) return;

  return (
    <div>
      <div className="max-w-7xl mx-auto  sm:px-6 lg:px-8">
        <div className=" border-b border-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="py-2">
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
                Update sub account details
              </p>
            </div>
          </div>
        </div>

        <div className="py-8">
          {isLoading ? (
            <ChartOfAccountFormSkeleton />
          ) : (
            <SubAccountForm
              subAccount={subAccount}
              accountType={subAccount?.account_type}
            />
          )}
        </div>
      </div>
    </div>
  );
}
