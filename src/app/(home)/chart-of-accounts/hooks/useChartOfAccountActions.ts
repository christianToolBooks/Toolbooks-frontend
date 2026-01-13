import { useState } from 'react';
import { toast } from 'sonner';
import {
  activeAnAccountOfCoa,
  desactivateAnAccountOfCoa,
} from '@/src/lib/services/chartOfAccount/AccountServices';
import {
  activeSubAccount,
  desactivateSubAccount,
} from '@/src/lib/services/chartOfAccount/subAccount.services';

type AccountStatus = 'active' | 'disable';

export function UseChartOfAccountActions(
  reFetch: () => Promise<void>,
  isSubaccount: boolean
) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false);
  const [
    isOpenConfirmChangeStatusCoaModal,
    setIsOpenConfirmChangeStatusCoaModal,
  ] = useState(false);
  const [type, setType] = useState<AccountStatus>('active');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleResponse = (res: any, successMsg: string) => {
    if ('message' in res) {
      toast.warning(res.message);
      return false;
    }
    toast.success(successMsg);
    return true;
  };

  const onConfirmDesactivate = async (accountId: string) => {
    setIsLoading(true);
    const res = isSubaccount
      ? await desactivateSubAccount(accountId)
      : await desactivateAnAccountOfCoa(accountId);

    if (handleResponse(res, 'Account successfully deactivated')) {
      setIsOpenConfirmChangeStatusCoaModal(false);
      reFetch();
    }

    setIsLoading(false);
  };

  const onConfirmActivate = async (accountId: string) => {
    setIsLoading(true);
    const res = isSubaccount
      ? await activeSubAccount(accountId)
      : await activeAnAccountOfCoa(accountId);

    if (handleResponse(res, 'Account successfully activated')) {
      setIsOpenConfirmChangeStatusCoaModal(false);
      reFetch();
    }

    setIsLoading(false);
  };

  return {
    isLoading,
    isOpenDetailsModal,
    setIsOpenDetailsModal,
    isOpenConfirmChangeStatusCoaModal,
    setIsOpenConfirmChangeStatusCoaModal,
    type,
    setType,
    onConfirmActivate,
    onConfirmDesactivate,
  };
}
