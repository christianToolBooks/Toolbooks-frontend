/* eslint-disable react-hooks/exhaustive-deps */
import {
  fetchLinkToken,
  sendPublicTokenToGetAccessTokenAndSave,
} from '@/src/lib/services/plaid.services';
import { setPlaidError, setPlaidLoading, syncPlaidTokenFromDB } from '@/src/store/plaidSlice';
import { AppDispatch, RootState } from '@/src/store/store';
import { PlaidAccount, PlaidLinkError, PlaidLinkOnSuccessMetadata } from 'react-plaid-link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function UsePlaid() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Selectors
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { isInitialized: plaidInitialized } = useSelector((state: RootState) => state.plaid);

  // Local states
  const [linkToken, setLinkToken] = useState<string>();
  const [connectionStatus, setConnectionStatus] = useState<
    'idle' | 'connecting' | 'success' | 'error'
  >('idle');
  const [accounts, setAccounts] = useState<PlaidAccount[]>([]);
  const [plaidAccessToken, setPlaidAccessToken] = useState<boolean>(false);

  /**
   * Genera un link token nuevo de Plaid
   */
  const getLinkToken = async () => {
    dispatch(setPlaidError(null));
    dispatch(setPlaidLoading(true));

    const res = await fetchLinkToken();

    if ('message' in res) {
      dispatch(setPlaidLoading(false));
      dispatch(setPlaidError(res.message));
      toast.warning(res.message);
      return;
    }

    setLinkToken(res.link_token);
    dispatch(setPlaidLoading(false));
  };

  /**
   * Callback ejecutado al conectar exitosamente con Plaid
   */
  const handleOnSuccess = async (
    public_token: string,
    metadata: PlaidLinkOnSuccessMetadata
  ) => {
    dispatch(setPlaidLoading(true));
    setConnectionStatus('connecting');

    const res = await sendPublicTokenToGetAccessTokenAndSave(
      public_token,
      metadata.institution?.name,
      metadata.institution?.institution_id
    );

    if ('message' in res) {
      dispatch(setPlaidLoading(false));
      setConnectionStatus('error');
      toast.warning(res.message);
      return;
    }

    if ('status' in res) {
      setPlaidAccessToken(true);
      setAccounts(metadata.accounts);
      setConnectionStatus('success');
      toast.success('Account successfully connected to Plaid!');
    } else {
      setConnectionStatus('error');
      toast.warning('Plaid did not return a valid access token.');
    }

    dispatch(setPlaidLoading(false));
  };

  /**
   * Callback ejecutado cuando el usuario sale del flujo de Plaid
   */
  const handleOnExit = (error: PlaidLinkError | null) => {
    if (error) {
      setConnectionStatus('error');
      dispatch(
        setPlaidError(
          error.display_message || error.error_message || 'Error when exiting Plaid Link.'
        )
      );
      toast.warning(error.display_message || 'Plaid connection cancelled.');
    } else {
      dispatch(setPlaidError(null));
    }
    setConnectionStatus('idle');
  };

  /**
   * Sincroniza token existente al iniciar sesión
   */
  useEffect(() => {
    if (accessToken && !plaidInitialized) {
      dispatch(syncPlaidTokenFromDB(accessToken));
    }
  }, [accessToken, plaidInitialized, dispatch]);

  /**
   * Obtiene un link token una vez inicializado Plaid
   */
  useEffect(() => {
    if (plaidInitialized) {
      getLinkToken();
    }
  }, [plaidInitialized]);

  return {
    linkToken,
    connectionStatus,
    handleOnSuccess,
    handleOnExit,
    plaidInitialized,
    accounts,
    plaidAccessToken,
  };
}
