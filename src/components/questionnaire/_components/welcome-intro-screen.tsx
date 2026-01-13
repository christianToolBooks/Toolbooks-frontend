import { Card, CardContent } from "@/src/components/ui/card"

export function WelcomeIntroScreen() {
  return (
    <Card className="border-2 border-blue-200 bg-linear-to-br from-blue-50 to-white">
      <CardContent className="pt-8 pb-8 px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Take a Few Minutes to Tell Us About Your Business and Bookkeeping Requirements
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            And Get Your Personalized ToolBooks Service Profile and Monthly Fee Proposal
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
