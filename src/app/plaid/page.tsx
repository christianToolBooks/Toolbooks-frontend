'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Shield, Lock, Zap, Users } from 'lucide-react';
import UsePlaid from './hook/usePlaid';
import StatusSuccesClient from './_components/StatusSuccesClient';
import PlaidConnectionClient from './_components/PlaidConectionClient';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';

export default function PlaidImplementScreen() {
  const {
    linkToken,
    handleOnExit,
    handleOnSuccess,
    connectionStatus,
    PlaidAccessToken,
    accounts
  } = UsePlaid();

  const isLoadingPlaid = useSelector((state: RootState) => state.plaid.isLoading);
  const plaidError = useSelector((state: RootState) => state.plaid.error);



  // Si hay conexiones exitosas, mostrar el componente de éxito
  if (connectionStatus === 'success') {
    return (
      <StatusSuccesClient 
        accesssToken={PlaidAccessToken}
        accounts={accounts}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <Badge variant="secondary" className="mb-4">
            <Shield className="mr-1 h-3 w-3" />
            Secure Connection
          </Badge>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">
            Connect Your Bank Account
          </h1>
          <p className="mx-auto max-w-xl text-shadow-xs text-gray-600">
            Securely connect your bank account to access all the features of our
            platform. We use Plaid to ensure maximum security.
          </p>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="text-center">
              <Lock className="mx-auto h-8 w-8" />
              <CardTitle className="text-lg">Banking Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-sm">
                Bank-level encryption and compliance with security standards
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Zap className="mx-auto h-8 w-8" />
              <CardTitle className="text-lg">Quick Connection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-sm">
                Connect your account in seconds with over 11,000 financial
                institutions
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="text-center">
              <Users className="mx-auto h-8 w-8" />
              <CardTitle className="text-lg">Trust</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-sm">
                Used by millions of users and thousands of financial apps
              </p>
            </CardContent>
          </Card>
        </div>

        <PlaidConnectionClient
          connectionStatus={connectionStatus}
          errorMessage={plaidError} 
          linkToken={linkToken}
          handleOnExit={handleOnExit}
          handleOnSuccess={handleOnSuccess}
          isLoading={isLoadingPlaid}
        />
      </div>
    </div>
  );
}