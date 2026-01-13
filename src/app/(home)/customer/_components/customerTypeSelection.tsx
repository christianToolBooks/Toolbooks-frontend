"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { User, Building2 } from "lucide-react"
import { useRouter } from "next/navigation";

export function CustomerTypeSelection() {
  const router = useRouter();

  const handleIndividualCustomer = () => {
    router.push("/customer/create/select-type/new-customer/individual");
  };

  const handleBusinessCustomer = () => {
    router.push("/customer/create/select-type/new-customer/business");
  };

  return (
    <div className="container mx-auto px-4 py-30 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-foreground mb-4">Select Customer Type</h1>
        <p className="text-md text-muted-foreground max-w-2xl mx-auto">
          Before creating a new customer, please select the type of customer you want to register.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card className="h-full flex flex-col border-2 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex-1 text-center flex flex-col items-center justify-start">
            <div className="mb-4 p-4 bg-secondary rounded-full w-fit">
              <User className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl text-foreground mb-2">Individual Customer</CardTitle>
            <CardDescription className="text-muted-foreground text-base leading-relaxed">
              A single person acting as a customer, such as a freelancer, consultant, or independent worker.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              onClick={handleIndividualCustomer}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
              size="lg"
            >
              Continue as Individual
            </Button>
          </CardContent>
        </Card>

        <Card className="h-full flex flex-col border-2 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex-1 text-center flex flex-col items-center justify-start">
            <div className="mb-4 p-4 bg-secondary rounded-full w-fit">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl text-foreground mb-2">Business Customer</CardTitle>
            <CardDescription className="text-muted-foreground text-base leading-relaxed">
              A registered company or organization acting as a customer, such as a corporation, LLC, or partnership.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              onClick={handleBusinessCustomer}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
              size="lg"
            >
              Continue as Business
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground bg-accent/50 px-6 py-3 rounded-lg inline-block">
          You can manage both individuals and businesses under your customers list.
        </p>
      </div>
    </div>
  )
}
