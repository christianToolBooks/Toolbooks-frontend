import { Card, CardContent } from "@/src/components/ui/card"
import { Sparkles, Settings, CreditCard, Package, FileText, Wallet } from "lucide-react"
import { useSubscription } from "../_hooks/useSubscription"

export function ServicesIntroScreen() {
  return (
    <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
      <CardContent className="pt-8 pb-8 px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
            <Sparkles className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Customize Your Subscription</h2>
          <div className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete the following steps to finalize your subscription
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <div className="text-center p-4 rounded-lg bg-white shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 mb-3">
              <Settings className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">Step 4: Service Tier</h3>
            <div className="text-xs text-gray-600">Review your service level</div>
          </div>

          <div className="text-center p-4 rounded-lg bg-white shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 mb-3">
              <Package className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">Step 5: Add-ons</h3>
            <div className="text-xs text-gray-600">Select additional services</div>
          </div>

          <div className="text-center p-4 rounded-lg bg-white shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 mb-3">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">Step 6: Preview</h3>
            <div className="text-xs text-gray-600">Review your quote summary</div>
          </div>

          <div className="text-center p-4 rounded-lg bg-white shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 mb-3">
              <Wallet className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">Step 7: Payment</h3>
            <div className="text-xs text-gray-600">Enter payment information</div>
          </div>

          <div className="text-center p-4 rounded-lg bg-white shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 mb-3">
              <CreditCard className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">Step 8: Confirm</h3>
            <div className="text-xs text-gray-600">Complete your subscription</div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <div className="text-sm text-indigo-900 text-center">
            <span className="font-semibold">✨ Customized for you:</span> Based on the information you shared, we&lsquo;ll
            recommend the most suitable services for your business
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
