import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function MissingOnBoardingCard() {
  return (
    <Card className="relative overflow-hidden border-primary/20 shadow-sm transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl" />

      <CardHeader className="relative pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <Badge
                variant="secondary"
                className="mb-2 bg-amber-100 text-amber-800 border-amber-200"
              >
                Action Required
              </Badge>
              <div className="text-lg font-semibold text-foreground">
                Complete your onboarding
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="space-y-3">
          <p className="text-lg font-bold text-balance leading-tight">
            You&apos;re just a few steps away from managing your bookkeeping
            seamlessly.
          </p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Unlock all ToolBooks features</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Access advanced reporting tools</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Connect your financial accounts</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="text-sm text-muted-foreground">
            Takes less than 5 minutes
          </div>
          <Link href="/onboarding">
            <Button className="bg-primary text-sm hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 group">
              Complete Setup
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
