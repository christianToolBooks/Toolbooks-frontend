/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { useSubscriptionFlow } from "../../_hooks/useSubscriptionFlow";
import { PreviewSubscriptionResponse } from "@/src/types/paymentMethods";
import { PreviewSummary } from "./previewSummary";
import { PaymentMethodSelector } from "./paymentMethodSelector";
import { CustomerSection } from "./customerSection";
import { SummaryDiscountNote } from "./summaryDiscountNote";
import { CatchUpNote } from "./catchUpNote";
import { ConfirmSubscriptionButton } from "./confirmSubscriptionButton";
import { useCreateMethodPayForm } from "../../_hooks/useCreateMethodPayForm";
import { useEffect } from "react";
import { TypeBankSelector } from "./typeBankSelector";
import { typePayMethod } from "@/src/types/paymentMethods";

interface RegularPlanCardProps {
  subscription: PreviewSubscriptionResponse;
  catchUpRequired?: boolean;
  subscriptionFlow: ReturnType<typeof useSubscriptionFlow>;
  customerForm: ReturnType<typeof useCreateMethodPayForm>;
}

export function RegularPlanCard({
  subscription,
  catchUpRequired,
  subscriptionFlow,
  customerForm,
}: RegularPlanCardProps) {
  const { loading, createSubscription, paymentType, typeBankACH, setTypeBankACH } = subscriptionFlow;
  const discount = subscription.discount_percent ?? 0;
  
  useEffect(() => {
    customerForm.checkExistingCustomer();
  }, []);

  // Validar que hay un método de pago seleccionado antes de confirmar
  useEffect(() => {
    if (!subscriptionFlow.selectedMethodId) {
      console.warn("No payment method selected");
    } 
  }, [subscriptionFlow.selectedMethodId]);

  return (
    <Card className="overflow-hidden border-2 border-[#5C769D]/30">
      <CardContent className="p-6 space-y-8">
        <PreviewSummary subscription={subscription} />
        <Card className="mt-6 border border-gray-200 shadow-sm">
          <CardContent className="space-y-6">
            <h3 className="text-xl justify-center font-semibold text-[#1E3A8A] flex items-center gap-2">
              Payment information
            </h3>
            <PaymentMethodSelector subscriptionFlow={subscriptionFlow} />
            <CustomerSection
              subscriptionFlow={subscriptionFlow}
              customerForm={customerForm}
              paymentType={paymentType}
            />
            {paymentType === typePayMethod.ACH && (
              <TypeBankSelector
                value={typeBankACH}
                onChange={setTypeBankACH}
              />
            )}
            {discount > 0 && (
              <SummaryDiscountNote subscription={subscription} />
            )}
            {catchUpRequired && <CatchUpNote />}
          </CardContent>
        </Card>
        <ConfirmSubscriptionButton
          subscriptionFlow={subscriptionFlow}
          loading={loading}
          onConfirm={createSubscription}
        />
      </CardContent>
    </Card>
  );
}
