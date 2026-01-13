"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { PreviewSubscriptionResponse } from "@/src/types/paymentMethods";
import { PreviewSummary } from "./pircing-step-sections/previewSummary";
import { CatchUpNote } from "./pircing-step-sections/catchUpNote";

interface PreviewSummaryStepProps {
  subscription: PreviewSubscriptionResponse;
  catchUpRequired?: boolean;
}

export function PreviewSummaryStep({
  subscription,
  catchUpRequired,
}: PreviewSummaryStepProps) {
  return (
    <Card className="overflow-hidden border-2 border-[#5C769D]/30">
      <CardContent className="p-6 space-y-8">
        <PreviewSummary subscription={subscription} />
        {catchUpRequired && <CatchUpNote />}
      </CardContent>
    </Card>
  );
}
