import { Card, CardContent } from "@/src/components/ui/card"
import { CheckCircle, Sparkles, Mail } from "lucide-react"

export function SubscriptionSuccessCard() {
  return (
    <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
      <CardContent className="pt-8 pb-8 px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Subscription Successful!</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your subscription has been activated and you&apos;re all set to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="text-center p-6 rounded-lg bg-white shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 mb-4">
              <Sparkles className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">What&apos;s Next</h3>
            <p className="text-sm text-gray-600">Access your personalized dashboard and start using your services</p>
          </div>

          <div className="text-center p-6 rounded-lg bg-white shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 mb-4">
              <Mail className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Confirmation Email</h3>
            <p className="text-sm text-gray-600">Check your inbox for subscription details and next steps</p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
          <p className="text-sm text-emerald-900 text-center">
            <span className="font-semibold">🎉 Welcome aboard!</span> Your account is now active and ready to use.
            We&apos;re excited to have you with us!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
