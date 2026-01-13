import { fetchLinkTokenPayroll } from "@/src/lib/services/plaid.services";
import {  RootState } from "@/src/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";



export default function useConnectPayroll() {
  const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
  const [linkToken, setLinkToken] = useState<string>();
  const [connectionStatus] = useState<
    'idle' | 'connecting' | 'success' | 'error'
  >('idle');
//   const [payrolls, setPayrolls] = useState<PlaidPayroll[]>([]);
  const getLinkToken = async () => {
  setError(null);
  setLoading(true);

      const res = await fetchLinkTokenPayroll();
      
      if ('message' in res) {
        setLoading(false)
        setError(res.message);
        return;
      }
  
      setLoading(false);
      setLinkToken(res.link_token);
      return;
    };

  useEffect(() => {
    getLinkToken();
  }, []);

  return{
    error,
    loading,
    linkToken,
    connectionStatus,
  }
}