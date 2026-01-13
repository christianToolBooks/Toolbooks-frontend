import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { CheckCircle, CreditCard, Building2, Plus } from 'lucide-react';
import Link from 'next/link';
import { PlaidItems } from '@/src/types/authInterfaces';
import { PlaidAccount } from 'react-plaid-link';

interface StatusSuccesClientProps {
  accesssToken?: boolean;
  accounts: PlaidAccount[];
}

export default function StatusSuccesClient({
  accesssToken,
  accounts,
}: StatusSuccesClientProps) {
  return (
    <div className="container mx-auto px-4 py-12 mt-13">
      <div className="mx-auto max-w-2xl space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Successful Connection!</CardTitle>
            <CardDescription>
             Your bank account has been securely connected.
            
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Mostrar información de las conexiones de Plaid */}
            {accesssToken && accounts.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Connected Accounts:</h3>
                  <Badge variant="secondary">{accounts.length} account{accounts.length !== 1 ? 's' : ''}</Badge>
                </div>
              </div>
            )}

            {/* Mostrar información de las cuentas si está disponible */}
            {accounts && accounts.length > 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  {accounts.map((account: PlaidAccount) => (
                    <div key={account.id} className="rounded-lg border border-gray-200 bg-white p-3">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{account.name}</p>
                          <p className="text-sm text-gray-600">
                            {account.type} - {account.subtype} - Mask: {account.mask}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col space-y-3 pt-4">
              <Link passHref href="/dashboard">
                <Button className="w-full" size="lg">
                  Continue to Dashboard
                </Button>
              </Link>
              
              {/* Botón para agregar más cuentas - opcional */}
              <Button 
                variant="outline" 
                className="w-full cursor-pointer"
                onClick={() => window.location.reload()} // O implementar lógica para agregar más cuentas
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Another Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}