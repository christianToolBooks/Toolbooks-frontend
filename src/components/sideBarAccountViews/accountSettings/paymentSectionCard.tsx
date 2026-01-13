"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import {
  typePayMethod,
} from "@/src/types/paymentMethods";
;
import { useEffect } from "react";
import { toast } from "sonner";
import { getSupscriptionResponse } from "@/src/lib/services/methodsToPayService";
import { useSubscriptionFlow } from "../../questionnaire/_hooks/useSubscriptionFlow";
import { useCreateMethodPayForm } from "../../questionnaire/_hooks/useCreateMethodPayForm";
import { PaymentMethodSelector } from "../../questionnaire/_components/pircing-step-sections/paymentMethodSelector";
import { CustomerSection } from "../../questionnaire/_components/pircing-step-sections/customerSection";
import { TypeBankSelector } from "../../questionnaire/_components/pircing-step-sections/typeBankSelector";

interface PaymentInformationStepProps {
  subscription: getSupscriptionResponse;
  subscriptionFlow: ReturnType<typeof useSubscriptionFlow>;
}

export function PaymentSectionToRenewCard({
  subscriptionFlow,
}: PaymentInformationStepProps) {
  const { paymentType, typeBankACH, setTypeBankACH } =
    subscriptionFlow;
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
        </div>
      </CardContent>
    </Card>
  );
}
