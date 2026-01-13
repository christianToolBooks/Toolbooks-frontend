/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AccountFormValues } from '@/src/lib/schemas/coa';
import {
  fetchAccountById,
  updateAccountOfCoa,
} from '@/src/lib/services/chartOfAccount/AccountServices';
import { Account } from '@/src/types/chart-of-accounts';

export function UseUpdatedCoa({ accountId }: { accountId?: string }) {
  const [account, setAccount] = useState<Account>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSendData, setIsSendData] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const router = useRouter();

  const fetchAccountInfo = async () => {
    if (!accountId) return;
    setIsLoading(true);

    const res = await fetchAccountById(accountId);
    if ('message' in res) {
      toast.warning(res.message);
      setErrorMessage(res.message);
      setIsLoading(false);
      return;
    }

    setAccount(res);
    setIsLoading(false);
  };

  const updatedAccount = async (data: AccountFormValues, id?: string) => {
    if (!id) return;
    setIsSendData(true);

    const res = await updateAccountOfCoa(data, id);

    if ('message' in res) {
      toast.warning(res.message);
      setIsSendData(false);
      return;
    }

    toast.success('Account updated successfully');
    router.push('/chart-of-accounts');
    setIsSendData(false);
  };

  useEffect(() => {
    fetchAccountInfo();
  }, []);

  return { account, isLoading, errorMessage, updatedAccount, isSendData };
}
