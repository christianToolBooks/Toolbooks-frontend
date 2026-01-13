"use client";
import { useParams } from "next/navigation";
import { SubscriptionExpiredCard } from "@/src/components/sideBarAccountViews/accountSettings/subscriptionExpiredCard";
import { useSubscription } from "@/src/components/questionnaire/_hooks/useSubscription";
import { useSubscriptionFlow } from "@/src/components/questionnaire/_hooks/useSubscriptionFlow";
import LoadingGeneral from "@/src/components/auth/loadingPage/loadingPage";


export default function RenewalSubscriptionPage() {
  const { id } = useParams<{ id: string }>();
  const { gettingSubscription, handleRenewSubscription, loading } =
    useSubscription();

  const effectiveExpense = gettingSubscription?.data.monthly_total_cents || "0";
  const subscriptionFlow = useSubscriptionFlow(effectiveExpense);

  if (loading || !gettingSubscription) {
    return (
      <div className="container mx-auto py-10">
        <LoadingGeneral/>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-30">
      <SubscriptionExpiredCard
        subscriptionData={gettingSubscription}
        loading={loading}
        onRenew={handleRenewSubscription}
        subscriptionFlow={subscriptionFlow}
      />
    </div>
  );
}
