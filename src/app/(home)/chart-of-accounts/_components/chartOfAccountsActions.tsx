'use client';

import Link from 'next/link';
import {
  CheckCircle,
  Edit,
  Eye,
  MoreHorizontal,
  PlusSquare,
  Trash2,
} from 'lucide-react';

import { AccountDetailsModal } from './coaDetailsModal';
import { AccountWithCurrentBalanceAndSubAccounts } from '@/src/types/chart-of-accounts';
import { Button } from '@/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { UseChartOfAccountActions } from '../hooks/useChartOfAccountActions';
import { ConfirmActionAccountModal } from './confirmChangeStatusAccountModal';

export interface ChartOfAccountActionsProps {
  account: AccountWithCurrentBalanceAndSubAccounts;
  refetch?: () => Promise<void>;
  isSubaccount?: boolean;
}

export function ChartOfAccountActions({
  account,
  refetch,
  isSubaccount = false,
}: ChartOfAccountActionsProps) {
  if (!refetch) return null;

  const {
    isLoading,
    isOpenDetailsModal,
    setIsOpenDetailsModal,

    isOpenConfirmChangeStatusCoaModal,
    setIsOpenConfirmChangeStatusCoaModal,

    type,
    setType,

    onConfirmDesactivate,
    onConfirmActivate,
  } = UseChartOfAccountActions(refetch, isSubaccount);

  const labelPrefix = isSubaccount ? 'Sub-account' : 'Account';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => navigator.clipboard.writeText(account.account_code)}
          >
            Copy Account Code
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setIsOpenDetailsModal(true)}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" /> View {labelPrefix} details
          </DropdownMenuItem>

          {account.status && (
            <Link
              href={
                !isSubaccount
                  ? `/chart-of-accounts/${account.id}/edit`
                  : `/chart-of-accounts/sub-account/${account.id}/${account.account_type}/edit`
              }
              passHref
            >
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit {labelPrefix} details
              </DropdownMenuItem>
            </Link>
          )}

          {!isSubaccount && account.status && (
            <Link
              href={`/chart-of-accounts/sub-account/${account.id}/${account.account_type}/create`}
            >
              <DropdownMenuItem className="cursor-pointer">
                <PlusSquare className="mr-2 h-4 w-4" /> Add sub-account
              </DropdownMenuItem>
            </Link>
          )}

          <DropdownMenuItem
            onClick={() => {
              setType(account.status ? 'disable' : 'active');
              setIsOpenConfirmChangeStatusCoaModal(true);
            }}
            className={
              account.status
                ? `text-red-600 focus:text-red-600 cursor-pointer`
                : `text-green-600 focus:text-green-600 cursor-pointer`
            }
          >
            {account.status ? (
              <Trash2 className="mr-2 h-4 w-4" />
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            {account.status
              ? `Disable this ${isSubaccount ? 'sub-account' : 'account'}`
              : `Activate this ${isSubaccount ? 'sub-account' : 'account'}`}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AccountDetailsModal
        key={account.id}
        isOpen={isOpenDetailsModal}
        onClose={() => setIsOpenDetailsModal(false)}
        account={account}
      />

      <ConfirmActionAccountModal
        account={account}
        isOpen={isOpenConfirmChangeStatusCoaModal}
        onClose={() => setIsOpenConfirmChangeStatusCoaModal(false)}
        isLoading={isLoading}
        onConfirmActive={onConfirmActivate}
        onConfirmDisable={onConfirmDesactivate}
        type={type}
      />
    </>
  );
}
