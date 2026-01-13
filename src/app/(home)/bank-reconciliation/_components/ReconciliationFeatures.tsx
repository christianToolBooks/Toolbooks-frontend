"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { FileText, Download, Search } from "lucide-react";

export function ReconciliationFeatures() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="hover:border-primary/60 transition-colors cursor-pointer">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Export summary pack
          </CardTitle>
          <CardDescription>
            Generate a combined summary of all reconciliations for your auditor or banker.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="hover:border-primary/60 transition-colors cursor-pointer">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Schedule recurring exports
          </CardTitle>
          <CardDescription>
            Automatically generate and deliver reconciliation PDFs every month.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="hover:border-primary/60 transition-colors cursor-pointer">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Detailed variance review
          </CardTitle>
          <CardDescription>
            Drill into periods with differences to understand what changed.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
