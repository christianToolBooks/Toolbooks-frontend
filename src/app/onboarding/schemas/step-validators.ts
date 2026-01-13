import {
  StepBusinessInfoSchema,
  StepBusinessDetailsSchema,
  StepBookkeepingSchema,
  StepModulesSchema,
} from "./onboarding-schema";
import type { OnboardingStep } from "@/src/types/questionnaire";

const StepSchemas = {
  "business-info": StepBusinessInfoSchema,
  "business-details": StepBusinessDetailsSchema,
  "bookkeeping-services": StepBookkeepingSchema,
  "toolbooks-modules": StepModulesSchema,
} as const;


export type ValidationIssue = { field: string; message: string };

export type ValidationResult =
  | { ok: true; errors: [] }
  | { ok: false; errors: ValidationIssue[] };

export function validateStepData<S extends OnboardingStep>(
  step: S,
  data: unknown
): ValidationResult {
  const schema = StepSchemas[step];
  const result = schema.safeParse(data);

  if (result.success) {
    return { ok: true, errors: [] };
  }

  const errors: ValidationIssue[] = result.error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));

  return { ok: false, errors };
}
