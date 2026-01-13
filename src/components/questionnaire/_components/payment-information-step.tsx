"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Label } from "@/src/components/ui/label";
import { useSubscriptionFlow } from "../_hooks/useSubscriptionFlow";
import {
  PreviewSubscriptionResponse,
  typePayMethod,
} from "@/src/types/paymentMethods";
import { PaymentMethodSelector } from "./pircing-step-sections/paymentMethodSelector";
import { CustomerSection } from "./pircing-step-sections/customerSection";
import { SummaryDiscountNote } from "./pircing-step-sections/summaryDiscountNote";
import { TypeBankSelector } from "./pircing-step-sections/typeBankSelector";
import { useCreateMethodPayForm } from "../_hooks/useCreateMethodPayForm";
import { useEffect } from "react";
import { toast } from "sonner";

interface PaymentInformationStepProps {
  subscription: PreviewSubscriptionResponse;
  subscriptionFlow: ReturnType<typeof useSubscriptionFlow>;
}

export function PaymentInformationStep({
  subscription,
  subscriptionFlow,
}: PaymentInformationStepProps) {
  const { paymentType, typeBankACH, setTypeBankACH, isTrial, setIsTrial } =
    subscriptionFlow;
  const discount = subscription.discount_percent ?? 0;

  const customerForm = useCreateMethodPayForm({
    onSuccess: (_) => {
      toast.success("Customer created successfully!");
    },
  });

  useEffect(() => {
    customerForm.checkExistingCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="overflow-hidden border-2 border-[#5C769D]/30">
      <CardContent className="p-6 space-y-10">
        <h3 className="text-xl justify-center font-semibold text-[#1E3A8A] flex items-center gap-2">
          Payment Information
        </h3>
        <PaymentMethodSelector subscriptionFlow={subscriptionFlow} />
        <CustomerSection
          subscriptionFlow={subscriptionFlow}
          customerForm={customerForm}
          paymentType={paymentType}
        />
        {paymentType === typePayMethod.ACH && (
          <TypeBankSelector value={typeBankACH} onChange={setTypeBankACH} />
        )}
        <div className="space-y-2">

        {discount > 0 && <SummaryDiscountNote subscription={subscription} />}
        </div>
        {paymentType === typePayMethod.CARD && (
          <div className="flex items-center space-x-2 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <Checkbox
              id="trial"
              checked={isTrial}
              onCheckedChange={(checked) => setIsTrial(!!checked)}
              className="border-chart-1"
            />
            <Label
              htmlFor="trial"
              className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Start with a 7-day free trial
            </Label>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
