import { useEffect, useState } from "react";
import { fetchAccountsById, fetchPlaidItems } from "../lib/services/plaid.services";
import { fetchAccountById } from "../lib/services/chartOfAccount/AccountServices";
import { BankAccount } from "../types/bank-account";

export interface InstitutionInterface{
  id: string;
  plaidInstitutionId: string;
  bank_name: string;
} 

export default function useInstitutions() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [institutions, setInstitutions] = useState<InstitutionInterface[]>([]);
  const [accountsById, setAccountsById] = useState<BankAccount[]>([])

  const fetchInstitutions = async () => {
    setError(null);
    setLoading(true);
    const res = await fetchPlaidItems();

    if ('message' in res) {
      setError(res.message);
      setLoading(false);
      return;
    }

    setInstitutions(res);
    setLoading(false);
    return;
  }

  useEffect(() => {
    fetchInstitutions();
  }, [])

const fetchBanksAccountsById = async (id: string) => {
    try {
      if (!id) {
        setError('No bank ID provided');
        return;
      }

      setError(null);
      setLoading(true);

      const res = await fetchAccountsById(id);

      if ('message' in res) {
        setError(res.message);
        return;
      }

      setAccountsById(res);
    } catch (err) {
      console.error(err);
      setError('Error fetching bank accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  return { institutions, loading, error, accountsById, fetchBanksAccountsById }
}