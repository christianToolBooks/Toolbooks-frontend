"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { ProgressBar } from "./progress-bar";
import { BookkeepingStep } from "./bookkeeping-step";
import { useQuestionnaireLogic } from "../_hooks/useQuestionnaireLogic";
import {
  BookkeepingSettings,
  BusinessProfile,
  CompanyProfile,
  FinancialOverview,
} from "@/src/types/questionnaire";
import { useSubscriptionFlow } from "../_hooks/useSubscriptionFlow";
import { PreviewSubscriptionResponse } from "@/src/types/paymentMethods";
import { ServicesAddonsStep } from "./services-addons-step";
import { PreviewSummaryStep } from "./preview-summary-step";
import { PaymentInformationStep } from "./payment-information-step";
import { SubscriptionSuccessCard } from "./subscription-success-card";
import { useRouter } from "next/navigation";
import { BusinessInfoStep } from "./business-info-step/business-info-step";
import Image from "next/image";

export default function QuestionnaireForm() {
  const c = useQuestionnaireLogic(async () => {
    await subscriptionFlow.getPreview();
  });
  const router = useRouter();
  const effectiveExpense =
    c.businessFinancialOverview.avg_monthly_expenses || "0";
  const subscriptionFlow = useSubscriptionFlow(effectiveExpense);
  const { preview, loading } = subscriptionFlow;

  if (c.loading && !c.hasExistingProfile && c.currentStep === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Loading your information...</p>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (c.currentStep) {
      case 0:
        return (
          <BusinessInfoStep
            data={{
              businessProfile: c.businessProfile,
              businessAddress: c.businessAddresses,
              contacts: c.contacts,
            }}
            onBusinessProfileChange={c.onBusinessInfoChange}
            onAddressChange={c.onAddressChange}
            onContactChange={c.onContactChange}
            onAddAddress={c.onAddAddress}
            onRemoveAddress={c.onRemoveAddress}
            getFieldError={c.getFieldError}
            setValue={c.setValue}
            register={c.register}
            watch={c.watch}
            errors={c.errors ?? {}}
            index={0}
          />
        );
      case 1:
        return (
          <BookkeepingStep
            data={{
              bookkeepingSettings: c.bookkeepingSettings,
              companyProfile: c.companyProfile,
              businessFinancialOverview: c.businessFinancialOverview,
            }}
            onChange={(field, value, section) =>
              c.onBookkeepingChange(
                field as
                  | keyof BookkeepingSettings
                  | keyof CompanyProfile
                  | keyof FinancialOverview,
                value,
                section
              )
            }
            getFieldError={c.getFieldError}
          />
        );
      case 2:
        return (
          <ServicesAddonsStep
            data={{
              businessProfile: c.businessProfile,
              businessFinancialOverview: c.businessFinancialOverview,
            }}
            onChange={(field, value, section) => {
              if (section === "businessFinancialOverview") {
                c.onBookkeepingChange(
                  field as keyof FinancialOverview,
                  value,
                  section
                );
              } else {
                c.onBusinessInfoChange(
                  field as keyof BusinessProfile,
                  value,
                  section
                );
              }
            }}
            subscriptionFlow={subscriptionFlow}
          />
        );
      case 3:
        return preview ? (
          <PreviewSummaryStep
            subscription={preview as PreviewSubscriptionResponse}
            catchUpRequired={c.catchUpRequired}
          />
        ) : (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground">Loading your quote preview...</p>
            </div>
          </Card>
        );
      case 4:
        return preview ? (
          <PaymentInformationStep
            subscription={preview as PreviewSubscriptionResponse}
            subscriptionFlow={subscriptionFlow}
          />
        ) : (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground">Please get your quote first...</p>
            </div>
          </Card>
        );
      case 5:
        return <SubscriptionSuccessCard />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center">
      <span>Welcome to T</span>

      <Image
        src="/logo-toolBooks.svg"
        alt="ToolBooks"
        width={50}
        height={40}
        className="inline-block p-0 m-0"
        priority
      />

      <span>olBooks</span>
    </h1>
          <p className="text-lg text-gray-600">
            Let&apos;s get your bookkeeping set up in just a few steps
          </p>
        </div>



        <ProgressBar
          currentStep={c.currentStep}
          totalSteps={c.TOTAL_STEPS_TO_REVIEW}
        />

        <form
          onSubmit={(e) => e.preventDefault()}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        >
          <div className="mb-8">{renderStep()}</div>

          <Card className="pt-6">
            <CardContent className="space-y-6">
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={c.prev}
                  disabled={c.isFirstStep || c.loading}
                  className="px-8 bg-transparent"
                >
                  Previous
                </Button>

                {c.currentStep === 3 ? (
                  c.hasExistingProfile ? (
                    <Button
                      type="button"
                      onClick={async () => {
                        const success = await subscriptionFlow.getPreview();
                        if (success) {
                          c.next();
                        }
                      }}
                      disabled={c.loading || loading}
                      className="px-8 bg-chart-1 hover:bg-chart-1/90"
                    >
                      {c.loading || loading ? "Loading..." : "Get Quote"}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={async () => {
                        await c.handleSubmitAndGetQuote();
                      }}
                      disabled={c.loading || loading}
                      className="px-8 bg-chart-1 hover:bg-chart-1/90"
                    >
                      {c.loading || loading
                        ? "Submitting..."
                        : "Send My Info & Get Quote"}
                    </Button>
                  )
                ) : c.isLastStepToReview ? (
                  <Button
                    type="button"
                    onClick={async () => {
                      const result =
                        await subscriptionFlow.createSubscription();
                      if (result) {
                        c.handleSubscriptionSuccess();
                      }
                    }}
                    disabled={loading || !preview}
                    className="px-8 bg-chart-1 hover:bg-chart-1/90"
                  >
                    {loading ? "Processing..." : "Complete Subscription"}
                  </Button>
                ) : c.currentStep === 6 ? (
                  <Button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="px-8 bg-chart-1 hover:bg-chart-1/90"
                  >
                    Go To Dashboard
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={c.next}
                    disabled={(c.currentStep === 4 || c.currentStep === 5) && !preview}
                    className="px-8 bg-chart-1 hover:bg-chart-1/90"
                  >
                    Next
                  </Button>
                )}
              </div>
              {(loading || c.loading) && (
                <div
                  role="status"
                  aria-live="polite"
                  className="text-center text-sm text-gray-500"
                >
                  {c.loading
                    ? "Submitting your information..."
                    : "Processing your subscription quote..."}
                </div>
              )}
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
