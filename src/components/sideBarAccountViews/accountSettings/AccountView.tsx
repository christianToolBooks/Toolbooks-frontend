"use client";

import { useAuth } from "@/src/app/auth/hooks/redux";
import { AccountInformationCard } from "./accountInformationCard";
import { useSubscription } from "../../questionnaire/_hooks/useSubscription";
import { SubscriptionInformationCard } from "./suspcriptionInformationCard";
import { SubscriptionExpiredCard } from "./subscriptionExpiredCard";
import { useSubscriptionFlow } from "../../questionnaire/_hooks/useSubscriptionFlow";
import { CancelSubscriptionModal } from "./cancelSubscriptionModal";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useEffect, useState } from "react";

function AccountViewSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <Skeleton className="h-24 w-full rounded-lg mb-4" />
      <Skeleton className="h-40 w-full rounded-lg mb-4" />
      <Skeleton className="h-12 w-1/2 rounded-lg mb-4" />
      <Skeleton className="h-12 w-1/3 rounded-lg mb-4" />
    </div>
  );
}

export function AccountView() {
  const { user } = useAuth();
  const {
    gettingSubscription,
    handleRenewSubscription,
    handleCancelSubscription,
    loading,
    setModalIsOpen,
    modalIsOpen,
    setRenewalModalIsOpen,
  } = useSubscription();
  const [isNearExpiration, setIsNearExpiration] = useState(false);

  useEffect(() => {
    if (!gettingSubscription) return;

    if (
      gettingSubscription.data.status === "trialing" ||
      gettingSubscription.data.status === "active"
    ) {
      const currentPeriodEnd = new Date(
        gettingSubscription.data.current_period_end
      );

      const now = new Date();

      const timeDifference = currentPeriodEnd.getTime() - now.getTime();
      const daysDifference = timeDifference / (1000 * 3600 * 24);

      if (daysDifference <= 20 && daysDifference >= 0) {
        setIsNearExpiration(true);
      }
    }
  }, [gettingSubscription]);

  const effectiveExpense = gettingSubscription?.data.monthly_total_cents || "0";
  const subscriptionFlow = useSubscriptionFlow(effectiveExpense);
  const isPastDue = gettingSubscription?.data.status === "past_due";

  if (loading) {
    return <AccountViewSkeleton />;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      {(isPastDue) ? (
        <SubscriptionExpiredCard
          subscriptionData={gettingSubscription}
          loading={loading}
          onRenew={handleRenewSubscription}
          subscriptionFlow={subscriptionFlow}
        />
      ) : (
        <>
          <AccountInformationCard user={user} />
          <SubscriptionInformationCard
            subscriptionData={gettingSubscription}
            setCancelSubsModalIsOpen={setModalIsOpen}
            setRenewalModalIsOpen={setRenewalModalIsOpen}
            isNearCurrentPeriodEnd={isNearExpiration}
          />
        </>
      )}

      {!isPastDue && (
        <div className="text-sm text-muted-foreground">
          <p>Created: {user?.createdAt}</p>
          <p>Last Updated: {user?.updatedAt}</p>
        </div>
      )}

      {modalIsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <CancelSubscriptionModal
            data={{ reason: "", cancel_at_period_end: true }}
            gettingSubscription={gettingSubscription}
            handleCancelSubscription={handleCancelSubscription}
            setModalIsOpen={setModalIsOpen}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}
