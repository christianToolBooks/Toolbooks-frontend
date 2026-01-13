"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import {
  CalendarDays,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/src/lib/utils/utils";
import { getSupscriptionResponse } from "@/src/lib/services/methodsToPayService";
import { formatCurrency, formatDate } from "@/src/lib/utils/formatters";
import { Button } from "../../ui/button";
import { useRouter } from "next/navigation";

export interface SubscriptionInformationCardProps {
  subscriptionData: getSupscriptionResponse | null;
  setCancelSubsModalIsOpen: (isOpen: boolean) => void;
  setRenewalModalIsOpen: (renewalModalIsOpen: boolean) => void;
  isNearCurrentPeriodEnd?: boolean;
}

export function SubscriptionInformationCard({
  subscriptionData,
  setCancelSubsModalIsOpen,
  isNearCurrentPeriodEnd,
  setRenewalModalIsOpen,
}: SubscriptionInformationCardProps) {
  const router = useRouter();

  if (!subscriptionData) {
    return null;
  }

  const statusColor =
    {
      trialing: "bg-blue-100 text-blue-700",
      active: "bg-emerald-100 text-emerald-700",
      canceled: "bg-red-100 text-red-700",
      past_due: "bg-orange-100 text-orange-700",
      pending_payment: "bg-yellow-100 text-yellow-700",
      none: "bg-gray-100 text-gray-600",
    }[subscriptionData.data.status] || "bg-gray-100 text-gray-600";
  console.log("Is near:", isNearCurrentPeriodEnd);

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          Subscription Details
          <div>
            <Badge className={cn("text-xs", statusColor)}>
              {subscriptionData.data.status.toUpperCase()}
            </Badge>
            {subscriptionData.data.cancel_at_period_end === false && (
              <Button
                onClick={() => setCancelSubsModalIsOpen(true)}
                className="ml-4"
                size="sm"
              >
                Cancel Subscription
              </Button>
            )}
            {isNearCurrentPeriodEnd && (
              <Button
                onClick={() => {
                  const id = subscriptionData.data.id;
                  if (id) {
                    router.push(`/renewalSubscription/${id}`);
                  }
                }}
                className="ml-4 text-xs bg-chart-1 text-chart-5 hover:bg-chart-1/80"
              >
                Renewal Subscription
              </Button>
            )}
          </div>
        </CardTitle>
        <CardDescription>
          Information about your current billing & subscription status.
        </CardDescription>
        {subscriptionData.data.cancel_at_period_end && (
          <div className="mt-4 flex items-center gap-2 text-red-600 text-sm">
            <AlertTriangle className="h-4 w-4" />
            Subscription will cancel at the end of this period. At {formatDate(
              subscriptionData.data.current_period_end
            )}.
          </div>
        )}
      </CardHeader>

      <div className="p-6 space-y-6">
        {/* PLAN INFO */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground">Plan</h3>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-base font-medium capitalize">
              {subscriptionData.data.plan_code.replace("_", " ")}
            </span>
            <Badge variant="outline" className="capitalize">
              {subscriptionData.data.term}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* BILLING SUMMARY */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Billing Summary
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Plan Price</p>
              <p className="font-medium">
                {formatCurrency(subscriptionData.data.plan_month_cents)}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Addons</p>
              <p className="font-medium">
                {formatCurrency(subscriptionData.data.addons_month_cents)}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Monthly Total</p>
              <p className="font-semibold text-primary">
                {formatCurrency(subscriptionData.data.monthly_total_cents)}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Discount</p>
              <p className="font-medium">
                {subscriptionData.data.discount_percent}%
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Period Charge</p>
              <p className="font-medium">
                {formatCurrency(subscriptionData.data.period_total_cents)}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Billing Cycle</p>
              <p className="font-medium">
                {subscriptionData.data.months} month(s)
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* DATES */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Key Dates
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span>
                Started: {formatDate(subscriptionData.data.started_at)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span>
                Trial Ends: {formatDate(subscriptionData.data.trial_end_at)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span>
                Current Period Start:{" "}
                {formatDate(subscriptionData.data.current_period_start)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span>
                Current Period End:{" "}
                {formatDate(subscriptionData.data.current_period_end)}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* PAYMENT METHOD */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Payment Method
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="capitalize">
              {subscriptionData.data.type_pay_method}
            </span>
          </div>
        </div>

        <Separator />

        {/* ADDONS */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Addons
          </h3>
          <div className="flex flex-wrap gap-2">
            {subscriptionData.data.addons.map((addon) => (
              <Badge
                key={addon.id}
                variant="outline"
                className="capitalize px-3 py-1"
              >
                {addon.addon_code.replace("_", " ")}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* DUNNING STATUS */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Payment Status
          </h3>

          {subscriptionData.data.dunning_status === "none" ? (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded-md text-sm">
              <CheckCircle2 className="h-4 w-4" />
              No payment issues
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-2 rounded-md text-sm">
              <AlertTriangle className="h-4 w-4" />
              {subscriptionData.data.dunning_status} — retries:{" "}
              {subscriptionData.data.dunning_retry_count}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
