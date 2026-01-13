'use client';

import React from 'react';
import { AlertTriangleIcon } from 'lucide-react';

import { Button } from '@/src/components/ui/button';

function Error() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 text-center">
      <AlertTriangleIcon className="size-12 text-destructive" />
      <h2 className="text-2xl font-semibold">Error Loading Dashboard Data</h2>

      <p className="text-muted-foreground">
        Failed to load dashboard data. Please try again later.
      </p>

      <Button onClick={() => window.location.reload()}>Retry</Button>
    </div>
  );
}

export default Error;
