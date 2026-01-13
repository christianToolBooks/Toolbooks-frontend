"use client";

import { useParams, useRouter } from "next/navigation";
import { useReconciliationSession } from "../../_hooks/sessions/useGetSessions";
import {
  SessionsTable,
  SessionsTableHeader,
  SessionsTableSkeleton,
  SessionsTableError,
} from "../../_components/sessionsTable";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ReconciliationSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const {
    items: session,
    total,
    isLoading,
    isError,
  } = useReconciliationSession({
    sessionId,
    page: 1,
    limit: 10,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <SessionsTableSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-6">
        <SessionsTableError />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <SessionsTableHeader total={total} sessionId={sessionId} />
      <SessionsTable items={session} />
      <div>
        <Button className="cursor-pointer" variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    </div>
  );
}
