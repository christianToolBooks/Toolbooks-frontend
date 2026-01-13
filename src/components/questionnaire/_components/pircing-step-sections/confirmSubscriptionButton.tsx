import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { useSubscriptionFlow } from "../../_hooks/useSubscriptionFlow";
import { AddonCode, typePayMethod } from "@/src/types/paymentMethods";
import { Label } from "@/src/components/ui/label";

export interface ConfirmSubscriptionButtonProps {
  loading: boolean;
  onConfirm: () => void;
  subscriptionFlow: ReturnType<typeof useSubscriptionFlow>;
}
export function ConfirmSubscriptionButton({
  loading,
  onConfirm,
  subscriptionFlow,
}: ConfirmSubscriptionButtonProps) {
  return (
    <>
      {subscriptionFlow.paymentType === typePayMethod.CARD && (
        <div>
          <div className="flex p-2">
            <Checkbox
              id="isTrial"
              className="bg-chart-5 border-chart-3"
              checked={subscriptionFlow.isTrial}
              onCheckedChange={(checked) => {
                subscriptionFlow.setIsTrial(!!checked);
              }}
            />
            <Label
              htmlFor="isTrial"
              className="ml-2 text-sm font-semibold text-chart-2"
            >
              Start with a 14-day free trial (no charge will be made until the
              trial ends)
            </Label>
          </div>
        </div>
      )}
    </>
  );
}
