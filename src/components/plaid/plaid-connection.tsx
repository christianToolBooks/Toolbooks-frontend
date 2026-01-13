import Link from 'next/link';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { Landmark } from 'lucide-react';

export default function PlaidButton() {
  const isInitialized = useSelector((state: RootState) => state.plaid.isInitialized);
  

  if (!isInitialized) {
    return null;
  }


  return (
    <div className="w-full">
      <Link href="/plaid" passHref>
        <Button className="w-full">Connect with your Bank
          <Landmark/>
        </Button>
        
      </Link>
    </div>
  );
}