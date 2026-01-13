import { useState } from "react";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { CancelSubscription } from "@/src/types/paymentMethods";
import { Button } from "../../ui/button";
import { getSupscriptionResponse } from "@/src/lib/services/methodsToPayService";
import { Textarea } from "../../ui/textarea";
import { AlertCircle } from "lucide-react";

export interface CancelSubscriptionModalProps {
  handleCancelSubscription: (
    subscriptionId: string,
    data: CancelSubscription
  ) => void;
  setModalIsOpen: (isOpen: boolean) => void;
  gettingSubscription: getSupscriptionResponse | null;
  loading: boolean;
  data: CancelSubscription;
}

export function CancelSubscriptionModal({
  handleCancelSubscription,
  gettingSubscription,
  setModalIsOpen,
  data,
  loading,
}: CancelSubscriptionModalProps) {
  const [reason, setReason] = useState(data.reason || "");

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Cancel Subscription</h2>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-5 rounded-lg border-amber-200 bg-amber-50 text-amber-900">
        <AlertCircle className="inline-block w-5 h-5 mr-2 mb-1" />
          Once you cancel your subscription, this action cannot be undone. The
          cancellation will take effect at the end of your current period.
        </div>
        <div className="flex flex-col gap-2">
          <p>Reason for cancellation:</p>
          <Textarea
            placeholder="To help us improve, can you tell us what led you to cancel?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      </CardContent>
      <div className="p-4 pt-0 flex justify-end">
        <Button
          variant="outline"
          onClick={() => setModalIsOpen(false)}
          className="mr-2"
        >
          Close
        </Button>
        <Button
          onClick={() => {
            const id = gettingSubscription?.data.id;
            if (id) {
              handleCancelSubscription(id, {
                ...data,
                reason,
                cancel_at_period_end: true,
              });
            }
          }}
          disabled={!gettingSubscription?.data.id || loading}
        >
          {loading ? "Cancelling..." : "Cancel Subscription"}
        </Button>
      </div>
    </Card>
  );
}
