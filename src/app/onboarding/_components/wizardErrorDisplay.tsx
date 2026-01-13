"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import type { ValidationIssue } from "../hooks/use-onboarding-validate";

interface WizardErrorDisplayProps {
  errors: ValidationIssue[];
}

export function WizardErrorDisplay({ errors }: WizardErrorDisplayProps) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4 border-destructive">
      <CardContent className="p-4">
        <h4 className="text-sm font-medium text-destructive mb-2">
          Please fix the following errors:
        </h4>
        <ul className="text-sm text-destructive space-y-1">
          {errors.map((error, index) => (
            <li key={index}>• {error.message}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}