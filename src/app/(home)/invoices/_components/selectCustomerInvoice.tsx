import { Button } from '@/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { UseInvoiceContex } from '../context/invoiceProvider';
import { CustomerInfoInterface } from '../hooks/useInvoiceForm';
import { useMemo } from 'react';
import { Skeleton } from '@/src/components/ui/skeleton';

interface SelectCustomerProps {
  setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerInfoInterface>>;
  customerName: string | null;
  customerInfo: CustomerInfoInterface;
  isLoading: boolean;
}

export default function SelectCustomerInvoice({
  setCustomerInfo,
  customerName,
  customerInfo,
  isLoading,
}: SelectCustomerProps) {
  const { customers } = UseInvoiceContex();
  const allCustomers = useMemo(() => {
    if (customerInfo.id && !customers.some(c => c.id === customerInfo.id)) {
      return [...customers, { id: customerInfo.id, name: customerInfo.name }];
    }
    return customers;
  }, [customers, customerInfo]);

  return (
    <div className="flex flex-col w-full justify-between gap-3">
      {isLoading ? (
        <Skeleton className="h-10 w-[250px]" />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-[250px] px-4 justify-between bg-chart-1 text-white cursor-pointer"
            >
              {customerName ? customerName : 'Select a Customers'}
              <ChevronDown className="ml-4 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[250px]">
            {allCustomers.map(customer => (
              <DropdownMenuItem
                key={customer.id}
                onClick={() =>
                  setCustomerInfo({ id: customer.id, name: customer.name })
                }
              >
                <span className="font-semibold">{customer.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
