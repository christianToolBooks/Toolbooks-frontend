'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { AlertTriangle, Hash, DollarSign, CheckCircle } from 'lucide-react';
import type { AccountWithCurrentBalanceAndSubAccounts } from '@/src/types/chart-of-accounts';
import { formatCurrency } from '@/src/lib/utils/formatters';

interface DesactivateAccountModalProps {
  account: AccountWithCurrentBalanceAndSubAccounts | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmActive: (accountId: string) => void;
  onConfirmDisable: (accountId: string) => void;
  isLoading?: boolean;
  type: 'active' | 'disable';
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

export function ConfirmActionAccountModal({
  account,
  isOpen,
  onClose,
  onConfirmDisable,
  onConfirmActive,
  type,
  isLoading,
}: DesactivateAccountModalProps) {
  if (!account) return null;

  const handleConfirm = () => {
    if (type === 'disable') {
      onConfirmDisable(account.id);
      return;
    } else {
      onConfirmActive(account.id);
      return;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-blue-900 dark:text-blue-100">
            {type === 'disable' ? (
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            ) : (
              <CheckCircle className="h-5 w-5" />
            )}
            {type === 'disable' ? 'Deactivate Account' : 'Active Account'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {type === 'disable' && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Are you sure you want to deactivate this account?
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    This action will make the account inactive and it will no
                    longer appear in active account lists.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="font-semibold text-blue-900 dark:text-blue-100">
                  {account.account_code}
                </span>
              </div>
              <Badge className={`border-0`}>
                {getAccountTypeLabel(account.account_type)}
              </Badge>
            </div>

            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                {account.account_name}
              </h4>
              {account.description && (
                <p className="text-sm text-gray-600 dark:text-blue-400">
                  {account.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <DollarSign className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Current Balance:
              </span>
              <span className="font-semibold text-blue-900 dark:text-blue-100">
                {formatCurrency(account.currentBalance)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              What happens when you{' '}
              {type === 'disable' ? 'desactive ' : 'active'} this account:
            </h4>
            {type === 'disable' ? (
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>The account will be marked as inactive</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>It will not appear in active account lists</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>
                    Historical data and transactions will be preserved
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>You can reactivate it later if needed</span>
                </li>
              </ul>
            ) : (
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>
                    You will be able to assign transactions to this account
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>It will be visible in active account lists</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>You can deactivate it again later if needed</span>
                </li>
              </ul>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className={
              type === 'disable'
                ? 'bg-red-600 hover:bg-red-700 cursor-pointer'
                : 'bg-black hover:bg-gray-800 cursor-pointer'
            }
          >
            {isLoading
              ? type === 'disable'
                ? 'Deactivating...'
                : 'Activating...'
              : type === 'disable'
                ? 'Deactivate Account'
                : 'Activate Account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
