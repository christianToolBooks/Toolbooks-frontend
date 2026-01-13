'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { SubAccountForm } from '../../../../_components/formSubAccount';

export default function CreateSubAccount() {
  const params = useParams();
  const accountId = params?.id as string;
  const accountType = params.type as
    | 'asset'
    | 'liability'
    | 'equity'
    | 'income'
    | 'expense';

  if (!accountId || !accountType) return;
  return (
    <div>
      <div className="max-w-6xl mx-auto flex flex-col justify-center  sm:px-6 lg:px-8">
        <header className=" border-b border-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
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
              <h1 className="text-3xl font-bold text-blue-900">
                Create Sub Account
              </h1>
              <p className="mt-2 text-sm text-gray-600">Add new Sub Account</p>
            </div>
          </div>
        </header>

        <div className='py-8'>
          <SubAccountForm accountId={accountId} accountType={accountType} />
        </div>
      </div>
    </div>
  );
}
