// app/(home)/invoices/error.tsx
'use client'; // Los componentes de error deben ser Client Components

import { useEffect } from 'react';
import { Button } from '@/src/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function InvoicesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Opcional: Registrar el error en un servicio de monitoreo
    console.error(error);
  }, [error]);

  return (
    <div className="@container/main px-4 lg:px-6">
      <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-8 max-w-lg mx-auto">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />

        <h2 className="mt-6 text-2xl font-semibold text-destructive">
          Oops! Something went wrong.
        </h2>

        <p className="mt-2 text-destructive/80">
          We were unable to load invoices at this time. Please try again.
        </p>

        <p className="mt-4 text-xs text-muted-foreground">
          {error.message || 'Error desconocido'}
        </p>

        <Button
          onClick={
            // Intenta recuperar el segmento re-renderizando
            () => reset()
          }
          className="mt-6"
          variant="destructive"
        >
          Retry
        </Button>
      </div>
    </div>
  );
}
