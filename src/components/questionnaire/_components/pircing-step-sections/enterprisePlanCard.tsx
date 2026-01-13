import { Card, CardContent, CardDescription, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Sparkles, Building2, CheckCircle2 } from "lucide-react";
import { PreviewSubscriptionResponse } from "@/src/types/paymentMethods";

export function EnterprisePlanCard({ subscription }: { subscription: PreviewSubscriptionResponse }) {
  return (
    <Card className="overflow-hidden border-2 border-[#5C769D]/30">
      <div className="bg-[#F0F6FE] p-6 border-b border-[#A2A8AB]/30">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm border border-[#A2A8AB]/20">
            <Building2 className="h-6 w-6 text-[#1E3A8A]" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold text-[#1E3A8A] mb-1">Enterprise Pricing</CardTitle>
            <CardDescription className="text-[#5C769D]">
              Your business qualifies for our Enterprise level of service
            </CardDescription>
          </div>
          <Badge className="bg-[#1E3A8A] text-white border-0 px-3 py-1">Premium Tier</Badge>
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        <div className="p-5 bg-[#F0F6FE] rounded-xl border border-[#5C769D]/30">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-[#1E3A8A]" />
            <h3 className="font-semibold text-[#1E3A8A]">Enterprise Includes:</h3>
          </div>
          <ul className="space-y-3">
            {[
              "Everything in Premium 3",
              "Support for over $200,000 monthly expenses",
              "Business and individual tax return preparation included",
              "Custom solutions for complex business needs",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#1E3A8A] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
