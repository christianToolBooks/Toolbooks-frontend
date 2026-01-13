import { fetchChartOfAccounts } from '@/src/lib/services/chartOfAccount/AccountServices';
import { AccountWithCurrentBalanceAndSubAccounts } from '@/src/types/chart-of-accounts';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const UseChartOfAccount = () => {
  const [coa, setCoa] = useState<AccountWithCurrentBalanceAndSubAccounts[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getCoas = async (): Promise<void> => {
    setIsLoading(true);
    const response = await fetchChartOfAccounts();

    if ('message' in response) {
      setIsLoading(false);
      setErrorMessage(response.message);
      toast.warning(response.message);
      return;
    }

    if (response.length === 0) {
      setIsLoading(false);
      setErrorMessage("There are no accounts created yet.");
      return;
    }

    const sorted = response
      .map(account => ({
        ...account,
        subAccounts: account.subAccounts
          ? [...account.subAccounts].sort((a, b) =>
              a.account_code.localeCompare(b.account_code, undefined, { numeric: true })
            )
          : [],
      }))
      .sort((a, b) =>
        a.account_code.localeCompare(b.account_code, undefined, { numeric: true })
      );

    setCoa(sorted);
    setIsLoading(false);
  };

  useEffect(() => {
    getCoas();
  }, []);

  return {
    coa,
    isLoading,
    errorMessage,
    refetch: getCoas,
  };
};
