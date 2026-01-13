import PlaidButton from "@/src/components/plaid/plaid-connection";
import { CreditCard } from "lucide-react";

export default function NoBanksFoundedScreen() {
  return (
    <>
      <div>
        <div className="min-h-[80vh] bg-background flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="rounded-full bg-muted p-8 mb-8 inline-flex">
              <CreditCard className="h-16 w-16 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              No Bank Accounts Connected
            </h1>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              You don&apos;t have any bank accounts connected yet. Please
              connect your bank accounts to start managing your financial data
              and view transactions.
            </p>
            <PlaidButton />
          </div>
        </div>
      </div>
    </>
  );
}
