import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { AlertCircle, CreditCard, Loader2, Shield, Plus } from "lucide-react";
import Link from "next/link";
import {
  PlaidLink,
  PlaidLinkError,
  PlaidLinkOnExitMetadata,
  PlaidLinkOnSuccessMetadata,
} from "react-plaid-link";

interface PlaidConnectionClientProps {
  isLoading: boolean;
  errorMessage: string | null;
  linkToken: string | undefined;
  handleOnSuccess: (
    public_token: string,
    metadata: PlaidLinkOnSuccessMetadata
  ) => void;
  handleOnExit: (
    error: PlaidLinkError | null,
    metadata: PlaidLinkOnExitMetadata
  ) => void;
  connectionStatus: string;
  existingConnections?: number;
  hasExistingConnections?: boolean;
}

export default function PlaidConnectionClient({
  connectionStatus,
  errorMessage,
  handleOnExit,
  handleOnSuccess,
  isLoading,
  linkToken,
}: PlaidConnectionClientProps) {

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <CreditCard className="h-8 w-8" />
        </div>
        <CardTitle className="text-2xl">Connect Bank Account</CardTitle>
        <CardDescription>
          Select your bank and authorize the connection securely
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <span className="text-gray-600">
              Preparing secure connection...
            </span>
          </div>
        )}

        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !errorMessage && linkToken && (
          <div className="space-y-4 flex flex-col justify-center items-center">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-start space-x-3">
                <Shield className="mt-0.5 h-5 w-5 text-green-600" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    Your information is protected
                  </p>
                  <p className="text-gray-600">
                    We do not store your banking credentials. The connection is
                    made directly with your bank through Plaid.
                  </p>
                </div>
              </div>
            </div>

            <PlaidLink
              token={linkToken}
              onSuccess={handleOnSuccess}
              onExit={handleOnExit}
              className="w-full border-none flex justify-center items-center gap-4"
              style={{
                border: "none",
                background: "none",
                padding: 0,
                outline: "none",
              }}
            >
              <Button
                asChild
                size="lg"
                className="w-full hover:from-blue-700 hover:to-indigo-700"
                disabled={connectionStatus === "connecting"}
              >
                {connectionStatus === "connecting" ? (
                  <div>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </div>
                ) : (
                  <div>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Connect Bank Account
                  </div>
                )}
              </Button>
            </PlaidLink>
              <Link href={"/dashboard"} className="w-full">
                <Button className="w-full hover:from-chart-2 bg-chart-4 text-chart-1 hover:text-chart-5 hover:to-indigo-700 p-5">
                  Cancel
                </Button>
              </Link>

            <p className="text-center text-xs text-gray-500">
              By continuing, you accept our terms of service and privacy policy.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
