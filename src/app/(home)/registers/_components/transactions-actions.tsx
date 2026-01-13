import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Eye } from "lucide-react";
import { useState } from "react";
import { GeneralLedgerLine } from "@/src/types/generaldLedgerTypes";
import { TransactionDetailModal } from "./transactionByAccount/viewDetails-modal/details-modal";

type Props = { transaction: GeneralLedgerLine };

export function TransactionsActions({ transaction }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button onClick={() => setIsOpen(true)} variant="outline" className="cursor-pointer">
            <Eye className="h-4 w-4" />
            View Details
          </Button>
        </DropdownMenuTrigger>
      </DropdownMenu>

      <TransactionDetailModal isOpen={isOpen} onClose={() => setIsOpen(false)} transaction={transaction} />
    </div>
  );
}
