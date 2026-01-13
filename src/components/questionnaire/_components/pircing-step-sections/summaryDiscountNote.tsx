import { Badge } from "@/src/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { PreviewSubscriptionResponse } from "@/src/types/paymentMethods";

export function SummaryDiscountNote({ subscription }: { subscription: PreviewSubscriptionResponse }) {
  const { months, discount_percent = 0 } = subscription;
  return (
    <div className="p-5 bg-[#F0F6FE] rounded-xl border border-[#5C769D]/30">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white rounded-lg shadow-sm border border-[#A2A8AB]/20">
          <TrendingUp className="h-5 w-5 text-[#1E3A8A]" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-[#1E3A8A] mb-1">
            {months === 12 ? "Annual Plan" : months === 24 ? "2-Year Plan" : "Monthly Plan"}
          </p>
          <p className="text-sm text-[#5C769D]">
            {"You're saving "}
            <span className="font-bold">{discount_percent}%</span>
            {" with your commitment"}
          </p>
        </div>
        <Badge className="bg-[#1E3A8A] text-white border-0">Save {discount_percent}%</Badge>
      </div>
    </div>
  );
}
