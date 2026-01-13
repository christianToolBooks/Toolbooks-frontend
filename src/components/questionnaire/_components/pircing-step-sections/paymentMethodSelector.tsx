import { Label } from "@/src/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { CreditCard, Building2 } from "lucide-react";
import { cn } from "@/src/lib/utils/utils";
import { typePayMethod } from "@/src/types/paymentMethods";
import { useSubscriptionFlow } from "../../_hooks/useSubscriptionFlow";

export function PaymentMethodSelector({ subscriptionFlow }: { subscriptionFlow: ReturnType<typeof useSubscriptionFlow> }) {
  const s = subscriptionFlow;
  return (
    <div className="space-y-4">
      <h3 className="text-md font-semibold text-[#1E3A8A] flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-[#1E3A8A]" />
        Select Payment Method
      </h3>

      <RadioGroup
        value={s.paymentType}
        onValueChange={(val) => s.setPaymentType(val as typePayMethod)}
        className="grid grid-cols-2 gap-4"
      >
        <div>
          <RadioGroupItem id="card" value={typePayMethod.CARD} className="peer sr-only" />
          <Label
            htmlFor="card"
            className={cn(
              "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all",
              "hover:bg-[#F0F6FE] hover:border-[#5C769D]",
              "peer-data-[state=checked]:bg-[#F0F6FE] peer-data-[state=checked]:border-chart-1/30 peer-data-[state=checked]:shadow-sm"
            )}
          >
            <CreditCard className="h-6 w-6 text-[#5C769D]" />
            <span className="font-medium text-sm text-[#1E3A8A]">Credit / Debit Card</span>
          </Label>
        </div>

        <div>
          <RadioGroupItem id="bank" value={typePayMethod.ACH} className="peer sr-only" />
          <Label
            htmlFor="bank"
            className={cn(
              "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all",
              "hover:bg-[#F0F6FE] hover:border-[#5C769D]",
              "peer-data-[state=checked]:bg-[#F0F6FE] peer-data-[state=checked]:border-[#1E3A8A] peer-data-[state=checked]:shadow-sm"
            )}
          >
            <Building2 className="h-6 w-6 text-[#5C769D]" />
            <span className="font-medium text-sm text-[#1E3A8A]">ACH / Bank Transfer</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
