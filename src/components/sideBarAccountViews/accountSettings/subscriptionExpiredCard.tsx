"use client";

import { AlertTriangle, RefreshCw, CalendarX2, Clock, Zap, Check, ArrowBigLeft } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { getSupscriptionResponse } from "@/src/lib/services/methodsToPayService";
import { PaymentSectionToRenewCard } from "./paymentSectionCard";
import { useSubscriptionFlow } from "../../questionnaire/_hooks/useSubscriptionFlow";
import { formatCurrency, formatDate } from "@/src/lib/utils/formatters";
import { useRouter } from "next/navigation";

interface SubscriptionExpiredCardProps {
  onRenew: (subscription_id: string, method_id: string) => Promise<void>;
  subscriptionData: getSupscriptionResponse | null;
  loading?: boolean;
  subscriptionFlow: ReturnType<typeof useSubscriptionFlow>;
}

export function SubscriptionExpiredCard({
  subscriptionData,
  loading,
  onRenew,
  subscriptionFlow,
}: SubscriptionExpiredCardProps) {
  const subscription = subscriptionData?.data;
  const router = useRouter();


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 relative">
      <div className="lg:col-span-1 order-2 lg:order-1">
        <div className="sticky top-8">
          <Card className="border border-border/50 bg-card shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-5 sm:pb-6 border-b border-border">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <Zap className="w-6 h-6 text-primary flex-shrink-0" />
                Plan Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 sm:space-y-8 pt-6 sm:pt-2">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Plan Type</p>
                <p className="text-xl font-bold text-foreground mt-2.5 capitalize">
                  {subscription?.plan_code.replace("_", " ")} Plan
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Billing Cycle</p>
                <p className="text-xl font-semibold text-foreground mt-2.5 capitalize">
                  {subscription?.term}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Expired On</p>
                <div className="flex items-center gap-3 mt-2.5">
                  <CalendarX2 className="w-5 h-5 text-destructive flex-shrink-0" />
                  <span className="text-xl font-bold text-foreground">
                    {subscription?.current_period_end ? formatDate(subscription.current_period_end) : "N/A"}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/8 to-primary/3 border border-primary/30 rounded-xl sm:rounded-2xl p-5 sm:p-7 space-y-5 sm:space-y-6">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Cost Breakdown</p>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-semibold text-sm sm:text-base">Plan Cost</span>
                  <span className="font-bold text-foreground text-base sm:text-lg">
                    {formatCurrency(subscription?.plan_month_cents ?? 0)}
                  </span>
                </div>

                {(subscription?.addons_month_cents ?? 0) > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold text-sm sm:text-base">Add-ons</span>
                    <span className="font-bold text-foreground text-base sm:text-lg">
                      {formatCurrency(subscription?.addons_month_cents ?? 0)}
                    </span>
                  </div>
                )}

                <div className="h-px bg-gradient-to-r from-primary/30 via-primary/20 to-transparent" />

                <div className="flex justify-between items-center pt-1.5">
                  <span className="font-bold text-foreground text-base sm:text-lg">Total Due</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    {formatCurrency(subscription?.monthly_total_cents ?? 0)}
                  </span>
                </div>
              </div>

              {subscription?.addons && subscription.addons.length > 0 && (
                <div className="space-y-3.5 sm:space-y-4 pt-2.5 border-t border-border/40">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Included Modules
                  </p>
                  <ul className="space-y-2.5 sm:space-y-3">
                    {subscription.addons.map((addon) => (
                      <li key={addon.id} className="flex items-center gap-3 text-sm sm:text-base">
                        <Check className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 rounded-full bg-primary/10 p-0.5" />
                        <span className="capitalize font-medium text-foreground">
                          {addon.addon_code.replace(/_/g, " ")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-2 flex justify-end">
        <Button className="flex items-center p-7 w-42" onClick={() => router.back()}>
          <ArrowBigLeft className="mr-1" />
          Go back
        </Button>
      </div>
        </div>
      </div>

      <div className="lg:col-span-2 order-1 lg:order-2">
        <Card className="h-full border border-border/50 bg-card shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-6 sm:pb-8 border-b border-border">
            <CardTitle className="text-2xl font-bold">Renew Your Subscription</CardTitle>
            <CardDescription className="text-base sm:text-md mt-1">
              Complete your renewal to restore full access to your account and all features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 sm:space-y-10">
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl sm:rounded-2xl p-5 sm:p-7 flex flex-col sm:flex-row gap-4 sm:gap-5 shadow-sm">
              <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-blue-900 dark:text-blue-100 text-base sm:text-lg">
                  Immediate Access Restored
                </p>
                <p className="text-blue-700 dark:text-blue-300 text-sm sm:text-base mt-2 sm:mt-3 leading-relaxed">
                  Upon successful renewal, your subscription will be activated instantly, granting you immediate
                  access to all modules, features, and tools.
                </p>
              </div>
            </div>

            <div className="space-y-5 sm:space-y-6">
              <h3 className="font-bold text-lg sm:text-xl text-foreground">Renewal Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-5">
                <div className="bg-gradient-to-br from-muted/70 to-muted/40 rounded-xl p-5 sm:p-6 border border-border/50 shadow-sm hover:shadow-md transition-all">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 sm:mb-4">
                    Amount to Charge
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(subscription?.monthly_total_cents ?? 0)}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-muted/70 to-muted/40 rounded-xl p-5 sm:p-6 border border-border/50 shadow-sm hover:shadow-md transition-all">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 sm:mb-4">
                    Renewal Period
                  </p>
                  <p className="text-2xl font-bold text-foreground capitalize">{subscription?.term}</p>
                </div>
                <div className="bg-gradient-to-br from-muted/70 to-muted/40 rounded-xl p-5 sm:p-6 border border-border/50 shadow-sm hover:shadow-md transition-all">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 sm:mb-4">
                    Current Status
                  </p>
                  <p className="text-2xl font-bold text-foreground capitalize">{subscription?.status}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-50/60 dark:from-green-950/50 dark:to-green-950/30 rounded-xl p-5 sm:p-6 border border-green-200 dark:border-green-900/60 shadow-sm hover:shadow-md transition-all">
                  <p className="text-xs font-bold text-green-900 dark:text-green-300 uppercase tracking-widest mb-3 sm:mb-4">
                    Status After Renewal
                  </p>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">Active</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <PaymentSectionToRenewCard subscriptionFlow={subscriptionFlow} subscription={subscriptionData!} />
            </div>

            <Button
              onClick={() => onRenew(subscription?.id || "", subscriptionFlow.selectedMethodId ?? "")}
              disabled={loading}
              size="lg"
              className="w-full h-14 sm:h-16 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-3 h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
                  Processing Renewal...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                  Renew Subscription Now
                </>
              )}
            </Button>

            <p className="text-sm sm:text-base text-center text-muted-foreground leading-relaxed font-medium">
              Your payment information is secure and encrypted with industry-standard security. We never store your
              complete card details.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

        <div className="mt-12 sm:mt-16 lg:mt-20 p-6 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border/50 text-center shadow-sm">
          <p className="text-base sm:text-lg text-muted-foreground font-medium">
            Have questions about your subscription?{" "}
            <a
              href="#"
              className="text-primary font-bold hover:text-primary/90 underline underline-offset-2 transition-colors"
            >
              Contact Our Support Team
            </a>
          </p>
        </div>
      // </div>
//   )
// }
