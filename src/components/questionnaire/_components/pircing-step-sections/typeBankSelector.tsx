"use client";

import { Label } from "@/src/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { cn } from "@/src/lib/utils/utils";
import { BankToPayTypeEnum } from "@/src/types/paymentMethods";

interface TypeBankSelectorProps {
  value?: BankToPayTypeEnum;
  onChange: (value: BankToPayTypeEnum) => void;
}

export function TypeBankSelector({ value, onChange }: TypeBankSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-md font-semibold text-[#1E3A8A] flex items-center gap-2">
          Transaction Type
        </h3>
        <p
          className="text-sm text-gray-600 text-start mt-1"
        >
          Choose debit or credit for this transaction
        </p>
      </div>

      <RadioGroup
        value={value}
        onValueChange={(val) => onChange(val as BankToPayTypeEnum)}
        className="flex gap-3"
      >
        <div className="flex-1">
          <RadioGroupItem
            id="debit"
            value={BankToPayTypeEnum.DEBIT}
            className="peer sr-only"
          />
          <Label
            htmlFor="debit"
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer transition-all",
              "hover:bg-accent hover:border-foreground/30",
              "peer-data-[state=checked]:bg-chart-5 peer-data-[state=checked]:border-foreground/50"
            )}
          >
            <ArrowUpCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="flex justify-center items-center gap-2">
              <span className="text-sm font-medium text-foreground">Debit</span>
              <span className="text-sm text-muted-foreground">( Payment out )</span>
            </div>
          </Label>
        </div>

        <div className="flex-1">
          <RadioGroupItem
            id="credit"
            value={BankToPayTypeEnum.CREDIT}
            className="peer sr-only"
          />
          <Label
            htmlFor="credit"
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer transition-all",
              "hover:bg-accent hover:border-foreground/30",
              "peer-data-[state=checked]:bg-accent peer-data-[state=checked]:border-foreground/50"
            )}
          >
            <ArrowDownCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="flex justify-center items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                Credit
              </span>
              <span className="text-sm text-muted-foreground">( Deposit in )</span>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
