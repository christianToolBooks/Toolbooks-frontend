// app/(home)/income-expenses/error.tsx
'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/src/components/ui/card';

export default function IncomeExpenseError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('IncomeExpenseError:', error);
  }, [error]);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <CardTitle className="text-destructive">
            Oops! Something went wrong.
          </CardTitle>

          <CardDescription>
            An error occurred while loading income and expense information.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {error.message || 'The content could not be displayed.'}
          </p>

          <Button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
