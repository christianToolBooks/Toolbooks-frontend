/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  createSubAccountOfCoa,
  fetchSubAccountById,
  updateSubAccountOfCoa,
} from '@/src/lib/services/chartOfAccount/subAccount.services';
import { SubAccount } from '@/src/types/chart-of-accounts';
import { SubAccountFormValues } from '@/src/lib/schemas/subAccount';

interface UseSubAccountProps {
  accountId?: string;
  subAccountId?: string;
}

export function UseSubAccount({ accountId, subAccountId }: UseSubAccountProps) {
  const [subAccount, setSubAccount] = useState<SubAccount>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const getSubAccount = async () => {
    if (!subAccountId) return;
    setIsLoading(true);

    const res = await fetchSubAccountById(subAccountId);

    if ('message' in res) {
      toast.warning(res.message);
      setIsLoading(false);
      return;
    }

    setSubAccount(res);
    setIsLoading(false);
  };

  const createSubAccount = async (data: SubAccountFormValues) => {
    if (!accountId) return;
    if (!data) {
      toast.warning('Complete the fields to create a Sub Account');
      return;
    }

    setIsLoading(true);
    const res = await createSubAccountOfCoa(accountId, data);

    if ('message' in res) {
      toast.warning(res.message);
      setIsLoading(false);
      return;
    }

    toast.success('Sub Account successfully created');
    router.push('/chart-of-accounts');
    setIsLoading(false);
  };

  const updatedSubAccount = async (
    subAccountId: string,
    data: SubAccountFormValues
  ) => {
    if (!subAccountId || !data) {
      toast.warning('Complete the fields to update a Sub Account');
      return;
    }

    setIsLoading(true);
    const res = await updateSubAccountOfCoa(subAccountId, data);

    if ('message' in res) {
      toast.warning(res.message);
      setIsLoading(false);
      return;
    }

    toast.success('Sub Account successfully updated');
    router.push('/chart-of-accounts');
    setIsLoading(false);
  };

  useEffect(() => {
    if (subAccountId) getSubAccount();
  }, [subAccountId]);

  return {
    isLoading,
    subAccount,
    createSubAccount,
    updatedSubAccount,
  };
}
