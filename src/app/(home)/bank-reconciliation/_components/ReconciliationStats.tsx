"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { CheckCircle2, FileText, TrendingUp } from "lucide-react";

interface ReconciliationStatsProps {
  totalReconciliations: number;
  completedReconciliations: number;
  matchRate: number;
}

export function ReconciliationStats({ 
  completedReconciliations, 
  totalReconciliations,
}: ReconciliationStatsProps) {
  const completionRate = totalReconciliations > 0 
    ? ((completedReconciliations / totalReconciliations) * 100).toFixed(1) 
    : "0";

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="text-xs text-muted-foreground flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Total Periods
          </CardDescription>
          <CardTitle className="text-3xl">{totalReconciliations}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            All reconciliation periods available
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardDescription className="text-xs text-muted-foreground flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Completed Reconciliations
          </CardDescription>
          <CardTitle className="text-3xl">{completedReconciliations}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={parseFloat(completionRate)} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {completionRate}% of total periods ({totalReconciliations})
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
