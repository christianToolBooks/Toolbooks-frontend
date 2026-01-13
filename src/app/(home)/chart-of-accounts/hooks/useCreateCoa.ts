import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AccountFormValues } from '@/src/lib/schemas/coa';
import { createAccountOfCoa } from '@/src/lib/services/chartOfAccount/AccountServices';

export function UseCreateCoa() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const createCoa = async (data: AccountFormValues) => {
    if (!data) {
      toast.warning('Complete the fields to create an Account');
      return;
    }

    setIsLoading(true);
    const res = await createAccountOfCoa(data);

    if ('message' in res) {
      toast.warning(res.message);
      setIsLoading(false);
      return;
    }

    toast.success('Account created successfully');
    router.push('/chart-of-accounts');
    setIsLoading(false);
  };

  return { isLoading, createCoa };
}
