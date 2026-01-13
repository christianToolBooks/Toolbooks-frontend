import { Badge } from "@/src/components/ui/badge";
import { CheckCircle2, DollarSign, Lock } from "lucide-react";
import { getServiceLevelFromAmount } from "../../_utils/questionnaire-logic";
import { se } from "date-fns/locale";

interface ServiceTiersSectionProps {
  expenseRange: string;
}

const allServiceTiers = [
  {
    name: "Essential",
    price: 149,
    maxExpense: 10000,
    features: [
      "Core bookkeeping via automated bank integrations",
      "Weekly account maintenance",
      "Monthly financial statements (P&L, Balance Sheet, SCF)",
      "Standard reporting (GL, Trial Balance, Bank Rec)",
      "Personalized Dashboard with Portal and Key Metrics",
      "Up to $10K monthly expenses",
    ],
  },
  {
    name: "Professional",
    price: 299,
    maxExpense: 25000,
    features: [
      "Everything in Essential",
      "Business tax return preparation (annual) - INCLUDED",
      "Enhanced reporting suite",
      "Up to $25K monthly expenses",
    ],
  },
  {
    name: "Premium 1",
    price: 449,
    maxExpense: 50000,
    features: [
      "Everything in Professional",
      "Individual tax return service (for business owner) - INCLUDED",
      // "Mi Casa Personal Financial Services - INCLUDED",
      "$25,001 - $50,000 monthly expenses",
    ],
  },
  {
    name: "Premium 2",
    price: 549,
    maxExpense: 125000,
    features: [
      "Everything in Premium 1",
      "$50,001 - $125,000 monthly expenses",
    ],
  },
  {
    name: "Premium 3",
    price: 649,
    maxExpense: 200000,
    features: [
      "Everything in Premium 2",
      "$125,001 - $200,000 monthly expenses",
    ],
  },
  {
    name: "Enterprise",
    price: null,
    maxExpense: Number.POSITIVE_INFINITY,
    features: [
      "Everything in Premium 3",
      "Over $200,000 monthly expenses",
      "Custom solutions for complex business needs",
      "Dedicated account management",
    ],
  },
];

export function ServiceTiersSection({ expenseRange }: ServiceTiersSectionProps) {
  const serviceLevel = getServiceLevelFromAmount(parseFloat(expenseRange ?? "0"));
  const currentTierIndex = allServiceTiers.findIndex(
    (tier) => tier.name === serviceLevel.name
  );
  const isServiceAvailable = (tierIndex: number) => tierIndex <= currentTierIndex;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-primary">All Service Tiers</h3>
        <Badge variant="outline" className="text-xs">
          Scroll to see all options
        </Badge>
      </div>

      <div className="grid gap-4">
        {allServiceTiers.map((tier, index) => {
          const isCurrentTier = tier.name === serviceLevel.name;
          const isAvailable = isServiceAvailable(index);
          const isLocked = !isAvailable;

          return (
            <div
              key={tier.name}
              className={`p-4 rounded-lg border-2 transition-all ${
                isCurrentTier
                  ? "border-blue-500 bg-blue-50/50"
                  : isLocked
                    ? "border-gray-200 bg-gray-50/50 opacity-60"
                    : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold">{tier.name}</h4>
                  {isCurrentTier && (
                    <Badge variant="default" className="bg-blue-600">
                      Current Plan
                    </Badge>
                  )}
                  {isLocked && (
                    <Badge
                      variant="outline"
                      className="text-gray-500 border-gray-400"
                    >
                      <Lock className="h-3 w-3 mr-1" />
                      Locked
                    </Badge>
                  )}
                </div>
                <Badge
                  variant={isLocked ? "outline" : "secondary"}
                  className="text-base px-3 py-1"
                >
                  {tier.price ? `$${tier.price}/month` : "Contact Us"}
                </Badge>
              </div>

              <ul className="space-y-2 mb-3">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2
                      className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                        isLocked ? "text-gray-400" : "text-green-600"
                      }`}
                    />
                    <span className={isLocked ? "text-gray-600" : ""}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {isLocked && (
                <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                  <DollarSign className="h-3 w-3 inline mr-1" />
                  Increase monthly expenses to $
                  {tier.maxExpense.toLocaleString()} to unlock this tier
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}