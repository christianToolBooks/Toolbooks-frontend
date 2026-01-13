// app/(home)/import-transactions/error.tsx
'use client';

import { Button } from '@/src/components/ui/button';
import { useEffect } from 'react';

export default function ErrorImportPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto py-8 text-center">
      <h2 className="text-2xl font-bold text-destructive mb-4">
        Oops! Something went wrong.
      </h2>

      <p className="mb-4">
        We were unable to load the transaction import page.
      </p>

      <p className="text-sm text-muted-foreground mb-6">
        Error: {error.message}
      </p>

      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try Again
      </Button>
    </div>
  );
}
