/* eslint-disable @typescript-eslint/no-explicit-any */
// app/onboarding/hooks/use-onboarding-validate.ts
"use client";

import { z } from "zod";
import type { OnboardingStep} from "@/src/types/questionnaire";
import {
  StepBusinessInfoSchema,
  StepBusinessDetailsSchema,
  StepBookkeepingSchema,
  StepModulesSchema,
  OnboardingSchema,
  BusinessProfileSchema,
  ContactSchema,
  AddressSchema,
  EmergencySchema,
  CompanyProfileSchema,
  BookkeepingSettingsSchema,
  TaxReturnSchema,
  PayrollSettingsSchema,
  InvoicingSettingsSchema,
  BillPaySettingsSchema,
  FinancialOverviewSchema,
} from "../schemas/onboarding-schema";

export type ValidationIssue = {
  field: string;
  path: (string | number)[];
  message: string;
  code: z.ZodIssueCode;
};

export type ValidationResult =
  | { ok: true; errors: [] }
  | { ok: false, errors: ValidationIssue[] };

const StepSchemas: Record<OnboardingStep, z.ZodTypeAny> = {
  "business-info": StepBusinessInfoSchema,
  "business-details": StepBusinessDetailsSchema,
  "bookkeeping-services": StepBookkeepingSchema,
  "toolbooks-modules": StepModulesSchema,
} as const;

const IndividualSchemas = {
  businessProfile: BusinessProfileSchema,
  businessContacts: z.array(ContactSchema),
  businessAddresses: z.array(AddressSchema),
  businessEmergencyContact: EmergencySchema,
  businessCompanyProfile: CompanyProfileSchema,
  businessFinancialOverview: FinancialOverviewSchema,
  bookkeepingSettings: BookkeepingSettingsSchema,
  taxReturnPreparation: TaxReturnSchema,
  payrrollSettings: PayrollSettingsSchema,
  invoicingSettings: InvoicingSettingsSchema,
  billPaySettings: BillPaySettingsSchema,
} as const;

function joinPath(parts: (string | number)[]): string {
  return parts
    .map((p) => (typeof p === "number" || /^\d+$/.test(String(p)) ? String(p) : String(p)))
    .join(".");
}

function normalizeIssues(issues: z.ZodIssue[]): ValidationIssue[] {
  return issues.map((i) => ({
    field: joinPath(i.path as (string | number)[]),
    path: i.path as (string | number)[],
    message: i.message,
    code: i.code,
  }));
}

export function useOnboardingValidate() {
  function validateStep(step: OnboardingStep, data: unknown): ValidationResult {
    const schema = StepSchemas[step];
    const res = schema.safeParse(data);
    if (res.success) return { ok: true, errors: [] };
    return { ok: false, errors: normalizeIssues(res.error.issues) };
  }

 function validateAll(data: unknown): ValidationResult {
    const res = OnboardingSchema.safeParse(data);
    if (res.success) return { ok: true, errors: [] };
    return { ok: false, errors: normalizeIssues(res.error.issues) };
  }

  function validateSection<TSection extends keyof typeof IndividualSchemas>(
    sectionName: TSection,
    sectionData: unknown,
    fullData?: unknown 
  ): ValidationIssue[] {
    const schema = IndividualSchemas[sectionName];
    if (!schema) return [];
    if (fullData && shouldSkipValidation(sectionName, fullData)) {
      return [];
    }

    
    const res = schema.safeParse(sectionData);
    if (res.success) return [];
    return normalizeIssues(res.error.issues).map((e) => ({
      ...e,
      field: `${String(sectionName)}.${e.field}`,
      path: [sectionName, ...e.path],
    }));
  }

  function getFieldError(fieldPath: string, allErrors: ValidationIssue[]): string | undefined {
    const exact = allErrors.find((e) => e.field === fieldPath);
    if (exact) return exact.message;

    const nested = allErrors.find(
      (e) => e.field.startsWith(fieldPath + ".") || fieldPath.startsWith(e.field + ".")
    );
    if (nested) return nested.message;

    const fp = fieldPath.split(".");
    const shaped = allErrors.find((e) => {
      const ep = e.field.split(".");
      if (ep.length !== fp.length) return false;
      return ep.every((seg, i) => {
        const a = seg;
        const b = fp[i];
        const aNum = !isNaN(Number(a));
        const bNum = !isNaN(Number(b));
        if (aNum && bNum) return true; 
        return a === b;
      });
    });
    return shaped?.message;
  }

  function isFieldRequired(fieldPath: string, data: unknown): boolean {
    const parts = fieldPath.split(".");
    const businessFlags = getBusinessFlags(data);

    if (parts[0] === "businessProfile") {
      return ["business_name", "email"].includes(parts[1]);
    }

    if (parts[0] === "businessContacts" && parts[1] === "0") {
      const required = ["first_name", "last_name", "emails.work"];
      const name = parts.slice(2).join(".");
      return required.includes(name);
    }

    if (parts[0] === "businessAddresses" && parts[1] === "0") {
      const obj = data as any;
      const primary = obj?.businessAddresses?.[0];
      if (primary?.line1?.trim?.()) {
        const req = ["city", "state", "postalCode", "country"];
        return req.includes(parts[2]);
      }
      return parts[2] === "line1";
    }

    if (parts[0] === "businessAddresses") {
      const idx = Number(parts[1]);
      if (!Number.isNaN(idx) && idx > 0) {
        const obj = data as any;
        const addr = obj?.businessAddresses?.[idx];
        if (addr?.line1?.trim?.()) {
          const req = ["city", "state", "postalCode", "country"];
          return req.includes(parts[2]);
        }
        return false;
      }
    }

    if (parts[0] === "payrrollSettings") {
      if (!businessFlags.hasPayroll) return false; 
      const requiredPayrollFields = [
        "employee_list_format",
        "num_employees_band", 
        "pay_frequency",
        "salary_type",
        "tax_compliance_support"
      ];
      return requiredPayrollFields.includes(parts[1]);
    }

    if (parts[0] === "invoicingSettings") {
      if (!businessFlags.hasInvoices) return false; 
      const requiredInvoicingFields = [
        "creation_tracking_method",
        "customer_list_format",
        "invoice_frequency", 
        "delivery_method"
      ];
      return requiredInvoicingFields.includes(parts[1]);
    }

    if (parts[0] === "billPaySettings") {
      if (!businessFlags.hasBills) return false;
      const requiredBillPayFields = [
        "vendor_list_format",
        "bill_reception_channels",
        "aging_tracking",
        "payment_frequency"
      ];
      return requiredBillPayFields.includes(parts[1]);
    }

    if (parts[0] === "taxReturnPreparation") {
      if (!businessFlags.hasTaxReturnPreparation) return false;

      // ✅ Campos requeridos en Business Tax
      if (parts[1] === "business") {
        const requiredBusinessFields = [
          "biz_last_filed_year",
          "business_form_filed",
          "biz_num_states_filed" // ⚠️ Ahora también es requerido para mostrar error si está fuera de rango
        ];
        return requiredBusinessFields.includes(parts[2]);
      }

      // ✅ Campos requeridos en Individual Tax
      if (parts[1] === "individual") {
        const requiredIndividualFields = [
          "ind_last_filed_year",
          "ind_num_states_filed" // ⚠️ Ahora también es requerido para mostrar error si está fuera de rango
        ];
        return requiredIndividualFields.includes(parts[2]);
      }

      return false;
    }

    return false;
  }

  function validateField<TSection extends keyof typeof IndividualSchemas>(
    sectionName: TSection,
    fieldPathInSection: string,
    _value: unknown,
    fullSectionData: unknown,
    fullFormData?: unknown
  ): string | undefined {
    if (fullFormData && shouldSkipValidation(sectionName, fullFormData)) {
      return undefined;
    }
    
    const errs = validateSection(sectionName, fullSectionData, fullFormData);
    const fullPath = `${String(sectionName)}.${fieldPathInSection}`;
    return getFieldError(fullPath, errs);
  }

  return {
    validateStep,
    validateAll,
    validateSection,
    validateField,
    getFieldError,
    isFieldRequired,
  };
}

function getBusinessFlags(data: unknown) {
  const profile = (data as any)?.businessProfile;
  return {
    hasPayroll: profile?.hasPayroll === true,
    hasInvoices: profile?.hasInvoices === true,
    hasBills: profile?.hasBills === true,
    hasTaxReturnPreparation: profile?.hasTaxReturnPreparation === true,
  };
}

function shouldSkipValidation(sectionName: string, fullData: unknown): boolean {
  const businessFlags = getBusinessFlags(fullData);
  
  switch (sectionName) {
    case 'payrrollSettings':
      return !businessFlags.hasPayroll;
    case 'invoicingSettings':
      return !businessFlags.hasInvoices;
    case 'billPaySettings':
      return !businessFlags.hasBills;
    case 'taxReturnPreparation':
      return !businessFlags.hasTaxReturnPreparation;
    default:
      return false;
  }
}