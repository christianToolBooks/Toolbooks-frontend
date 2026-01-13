'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ChartOfAccountForm } from '../_components/formChartOfAccount';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { UseCreateCoa } from '../hooks/useCreateCoa';

export default function CreateNewAccount() {
  const { isLoading } = UseCreateCoa();

  const businessType = useSelector(
    (state: RootState) => state.auth.business_type
  );
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
              <h1 className="text-3xl font-bold text-blue-900">
                Create Account
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Add new Chart of Account
              </p>
            </div>
          </div>
        </div>

        <div className="py-8">
          <ChartOfAccountForm
            isLoading={isLoading}
            businessType={businessType}
          />
        </div>
      </div>
    </div>
  );
}
