// src/hooks/useAccount.ts
import { fetchBankAccounts } from '@/src/lib/services/bankAccountService';
import { GeneralLedgerLine } from '@/src/types/generaldLedgerTypes';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseAccountReturn {
  isLoading: boolean;
  accounts: GeneralLedgerLine[];
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  accountTypes: string[];
  filteredAccounts: GeneralLedgerLine[];
  refetch: () => Promise<void>;
}

export default function useAccount(): UseAccountReturn {
  const [bankAccountsFounded, setBankAccountsFounded] = useState<GeneralLedgerLine[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getAccounts = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      const res = await fetchBankAccounts();

      if (!res.success) {
        toast.warning(res.message);
        setBankAccountsFounded([]);
        return;
      }

      const accounts = Array.isArray(res.accounts) ? res.accounts : [];
      setBankAccountsFounded(accounts);
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      toast.error('Error fetching bank accounts');
      setBankAccountsFounded([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Deriva los tipos de cuenta únicos
   */
  const accountTypes = useMemo((): string[] => {
    if (!Array.isArray(bankAccountsFounded) || bankAccountsFounded.length === 0) {
      return [];
    }

    const types = bankAccountsFounded
      .map(account => account.transaction?.bankTransaction?.bankAccount?.type)
      .filter((type): type is string => Boolean(type));

    return [...new Set(types)].sort();
  }, [bankAccountsFounded]);

  /**
   * Filtra cuentas por tipo seleccionado
   */
  const filteredAccounts = useMemo((): GeneralLedgerLine[] => {
    if (!Array.isArray(bankAccountsFounded)) return [];

    if (!selectedType) return bankAccountsFounded;

    return bankAccountsFounded.filter(
      account => account.transaction?.bankTransaction?.bankAccount?.type === selectedType
    );
  }, [selectedType, bankAccountsFounded]);

  useEffect(() => {
    getAccounts();
  }, [getAccounts]);

  return {
    isLoading,
    accounts: bankAccountsFounded,
    selectedType,
    setSelectedType,
    accountTypes,
    filteredAccounts,
    refetch: getAccounts,
  };
}
