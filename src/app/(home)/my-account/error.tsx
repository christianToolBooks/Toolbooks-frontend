// app/(home)/account/error.tsx
'use client';

import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/src/components/ui/card';
import { useEffect } from 'react';

export default function BrandingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto py-10 px-4 flex items-center justify-center">
      <Card className="max-w-2xl w-full bg-destructive/10 border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">
            Something went wrong!
          </CardTitle>
          <CardDescription className="text-destructive-foreground">
            We couldn&#39;t load your Account details. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-destructive-foreground">
            Error: {error.message}
          </p>
          <Button
            onClick={
              // Intenta recuperarte re-renderizando el segmento
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
