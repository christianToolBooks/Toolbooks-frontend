'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Separator } from '@/src/components/ui/separator';
import { Calendar, DollarSign, FileText, Building, Hash } from 'lucide-react';
import type { AccountWithCurrentBalanceAndSubAccounts } from '@/src/types/chart-of-accounts';
import {
  formatBusinessType,
  formatCurrency,
  formatDate,
} from '@/src/lib/utils/formatters';
import Link from 'next/link';

interface AccountDetailsModalProps {
  account: AccountWithCurrentBalanceAndSubAccounts | null;
  isOpen: boolean;
  onClose: () => void;
}

const getAccountTypeLabel = (type: string) => {
  const labels = {
    asset: 'Asset',
    liability: 'Liability',
    equity: 'Equity',
    income: 'Income',
    expense: 'Expense',
  };
  return labels[type as keyof typeof labels] || type;
};

export function AccountDetailsModal({
  account,
  isOpen,
  onClose,
}: AccountDetailsModalProps) {
  if (!account) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Account Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Account Header */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <Hash className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                <span className="text-base sm:text-lg font-semibold text-blue-900 dark:text-gray-100 break-all">
                  {account.account_code}
                </span>
              </div>
              <Badge className="border-0 self-start sm:self-center">
                {getAccountTypeLabel(account.account_type)}
              </Badge>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-100 mb-2 break-words">
              {account.account_name}
            </h3>
            {account.description && (
              <p className="text-sm sm:text-base text-blue-900 dark:text-blue-400 break-words">
                {account.description}
              </p>
            )}
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-gray-900 border rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Current Balance
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-gray-100 break-all">
                {formatCurrency(account.currentBalance)}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Normal Balance
                </span>
              </div>
              <Badge
                variant={
                  account.normal_balance === 'debit' ? 'default' : 'secondary'
                }
                className="text-xs sm:text-sm"
              >
                {account.normal_balance.charAt(0).toUpperCase() +
                  account.normal_balance.slice(1)}
              </Badge>
            </div>
          </div>

          <Separator className="my-4 sm:my-6" />

          {/* Account Information */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-gray-100">
              Account Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </label>
                <div>
                  <Badge
                    variant={account.status ? 'default' : 'destructive'}
                    className="text-xs sm:text-sm"
                  >
                    {account.status ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Business Type
                </label>
                <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 break-words">
                  {formatBusinessType(account.business_type)}
                </p>
              </div>
              {account.reporting_category && (
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                    Reporting Category
                  </label>
                  <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 break-words">
                    {account.reporting_category}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-4 sm:my-6" />

          {/* System Information */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-gray-100 flex items-center gap-2">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              System Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  Created Date
                </label>
                <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100">
                  {formatDate(account.createdAt)}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  Last Updated
                </label>
                <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100">
                  {formatDate(account.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto order-2 sm:order-1 bg-transparent"
            >
              Close
            </Button>
            <Link
              href={`/chart-of-accounts/${account.id}/edit`}
              passHref
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              <Button className="bg-primary hover:bg-blue-800 cursor-pointer w-full sm:w-auto">
                Edit Account
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
