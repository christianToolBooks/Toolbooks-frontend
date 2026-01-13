/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import {
  BookkeepingStatus,
  BusinessType,
  ContactMethod,
  SalesRevenueType,
  AvgAnnualRevenueBracket,
  LifeCyclePhase,
  AccountingBasisEnum,
  CreationTrackingMethod,
  CustomerListFormat,
  InvoiceFrequency,
  DeliveryMethod,
  VendorListFormat,
  BillPaymentFrequency,
  AgingTracking,
  EmployeeListFormat,
  NumEmployeesBand,
  PayFrequency,
  SalaryType,
  YesNoNotSure,
  BookkeepingService,
  InhouseHandler,
  BookkeepingFrequency,
  BookkeepingSoftware,
  ReconcileFrequency,
  BookkeepingUtilization,
  BookkeepingBenefit,
  ReportsReviewed,
  ImprovementsWanted,
  FinancialObjective,
  BusinessTaxForm,
  BillReceptionChannel,
} from "@/src/types/questionnaire";

const digitsOnly = (s: string) => s.replace(/\D+/g, "");

const optionalString = () =>
  z
    .string()
    .trim()
    .transform((v) => (v === "" ? undefined : v))
    .optional();
    

const optionalStringWithValidation = (validation: RegExp, message: string) =>
  z
    .string()
    .transform((v) => v?.trim() ?? "")
    .refine((v) => v === "" || validation.test(v), { message });

const pushIssues = (
  ctx: z.RefinementCtx,
  base: (string | number)[],
  issues: z.ZodIssue[]
) => {
  for (const i of issues) ctx.addIssue({ ...i, path: [...base, ...i.path] });
};

const getBusinessFlags = (data: any) => {
  const profile = data?.businessProfile;
  return {
    hasPayroll: profile?.hasPayroll === true,
    hasInvoices: profile?.hasInvoices === true,
    hasBills: profile?.hasBills === true,
    hasTaxReturnPreparation: profile?.hasTaxReturnPreparation === true,
  };
};

export const EmailSchema = z.string().trim().email({ message: "Invalid email" });

export const OptionalEmailSchema = z
  .string()
  .transform((v) => v?.trim() ?? "")
  .refine((v) => v === "" || z.string().email().safeParse(v).success, {
    message: "Invalid email",
  });

export const PhoneSchema = z
  .string()
  .transform((v) => v ?? "")
  .superRefine((raw, ctx) => {
    if (/[A-Za-z]/.test(raw)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Phone must contain only digits",
        path: [],
      });
    }
  })
  .transform((v) => digitsOnly(v))
  .refine((v) => v === "" || /^\d{7,15}$/.test(v), {
    message: "Phone must contain only digits (7-15)",
  });

export const WebsiteSchema = z
  .string()
  .transform((v) => v?.trim() ?? "")
  .refine(
    (v) =>
      v === "" ||
      /^https?:\/\/.+/i.test(v) ||
      /^[\p{L}\d.-]+\.[\p{L}]{2,}.*$/iu.test(v),
    { message: "Invalid website" }
  )
  .transform((v) => {
    if (!v || v === "") return "";
    if (/^https?:\/\//i.test(v)) return v;
    return `https://${v}`;
  });

export const AddressSchema = z.object({
  line1: optionalString(),
  line2: optionalString(),
  city: optionalString(),
  state: optionalStringWithValidation(
    /^[A-Za-z]{2,}$/i,
    "State must be a code or name"
  ),
  country: optionalString(),
  postalCode: optionalStringWithValidation(
    /^[0-9]{5}(?:-[0-9]{4})?$|^\d{4,10}$/,
    "Invalid postal/ZIP code"
  ),
});

export const AddressesSchema = z
  .array(AddressSchema)
  .min(1, "At least one address is required")
  .superRefine((addresses, ctx) => {
    addresses.forEach((addr, idx) => {
      const anyFilled = Boolean(
        addr.line1?.trim() ||
          addr.city?.trim() ||
          addr.state?.trim() ||
          addr.country?.trim() ||
          addr.postalCode?.trim()
      );

      if (anyFilled) {
        const base = idx === 0 ? "primary address" : "address";
        if (!addr.line1?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Address line 1 is required for ${base}`,
            path: [idx, "line1"],
          });
        }
        if (!addr.city?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              idx === 0
                ? "City is required for primary address"
                : "City is required when address is provided",
            path: [idx, "city"],
          });
        }
        if (!addr.state?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              idx === 0
                ? "State is required for primary address"
                : "State is required when address is provided",
            path: [idx, "state"],
          });
        }
        if (!addr.country?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              idx === 0
                ? "Country is required for primary address"
                : "Country is required when address is provided",
            path: [idx, "country"],
          });
        }
      }
    });
  });

export const BusinessProfileSchema = z.object({
  business_name: z.string().trim().min(1, "Business name is required"),
  dba: optionalString().optional(),
  website: WebsiteSchema.optional(),
  hasInvoices: z.boolean().default(false),
  hasBills: z.boolean().default(false),
  hasPayroll: z.boolean().default(false),
  hasTaxReturnPreparation: z.boolean().default(false),
  logo_url: z
    .union([z.string().url(), z.null(), z.literal("")])
    .optional()
    .nullable(),
  phone_number: PhoneSchema.optional(),
  email: EmailSchema,
});

export const CompanyProfileSchema = z.object({
  business_type: z.nativeEnum(BusinessType, {
    required_error: "Business type is required",
  }),
  industry: optionalString(),
  ein: z
    .string()
    .transform((v) => v?.trim() ?? "")
    .transform((v) => (v ? digitsOnly(v) : ""))
    .refine((v) => v === "" || v.length === 9, {
      message: "EIN must have 9 digits",
    }),
  naics_code: optionalStringWithValidation(
    /^\d{2,6}$/,
    "NAICS code must be 2–6 digits"
  ),
  start_date: optionalString(),
  s_corp_election_date: optionalString(),
  year_end_mmdd: optionalString(),
  state_of_incorporation: optionalString(),
  state_id_number: optionalString(),
})
  .refine(
    (data) => {
      if (!data.start_date || !data.s_corp_election_date) return true;

      const start = new Date(data.start_date);
      const election = new Date(data.s_corp_election_date);

      return election >= start;
    },
    {
      path: ["s_corp_election_date"],
      message: "S Corp Election Date cannot be earlier than Business Start Date",
    }
  );

const ContactEmailsSchema = z.object({
  work: OptionalEmailSchema.optional(),
  personal: OptionalEmailSchema.optional(),
  other: OptionalEmailSchema.optional(),
});

const ContactPhonesSchema = z.object({
  main: PhoneSchema.optional(),
  mobile: PhoneSchema.optional(),
  work: PhoneSchema.optional(),
  fax: PhoneSchema.optional(),
});

export const ContactSchema = z
  .object({
    business_profile_id: optionalString().optional(),
    first_name: optionalString().optional(),
    last_name: optionalString().optional(),
    title: optionalString().optional(),
    isPrimary: z.boolean(),
    isAuthorized: z.boolean(),
    preferred_contact_method: z.nativeEnum(ContactMethod).optional(),
    phones: ContactPhonesSchema.default({}),
    emails: ContactEmailsSchema.default({}),
  })
  .superRefine((val, ctx) => {
    const hasAnyEmail =
      !!val.emails.work?.trim() ||
      !!val.emails.personal?.trim() ||
      !!val.emails.other?.trim();

    const hasAnyPhone =
      !!val.phones.main?.trim() ||
      !!val.phones.mobile?.trim() ||
      !!val.phones.work?.trim() ||
      !!val.phones.fax?.trim();

    const anyFieldFilled =
      !!val.first_name?.trim() ||
      !!val.last_name?.trim() ||
      !!val.title?.trim() ||
      hasAnyEmail ||
      hasAnyPhone;

    if (val.isPrimary) {
      if (!val.first_name?.trim()) {
        ctx.addIssue({
          path: ["first_name"],
          code: z.ZodIssueCode.custom,
          message: "First name is required for primary contact",
        });
      }
      if (!val.last_name?.trim()) {
        ctx.addIssue({
          path: ["last_name"],
          code: z.ZodIssueCode.custom,
          message: "Last name is required for primary contact",
        });
      }
      if (!val.phones.mobile?.trim()) {
        ctx.addIssue({
          path: ["phones", "mobile"],
          code: z.ZodIssueCode.custom,
          message: "Mobile phone is required for primary contact",
        });
      }
      if (!val.emails.work?.trim()) {
        ctx.addIssue({
          path: ["emails", "work"],
          code: z.ZodIssueCode.custom,
          message: "Work email is required for primary contact",
        });
      }
    }

    if (!val.isPrimary && anyFieldFilled) {
      if (!val.first_name?.trim()) {
        ctx.addIssue({
          path: ["first_name"],
          code: z.ZodIssueCode.custom,
          message: "First name is required for additional contact",
        });
      }
      if (!val.last_name?.trim()) {
        ctx.addIssue({
          path: ["last_name"],
          code: z.ZodIssueCode.custom,
          message: "Last name is required for additional contact",
        });
      }
      if (!val.emails.work?.trim()) {
        ctx.addIssue({
          path: ["emails", "work"],
          code: z.ZodIssueCode.custom,
          message: "Email address is required for additional contact",
        });
      }
      if (!val.phones.mobile?.trim()) {
        ctx.addIssue({
          path: ["phones", "mobile"],
          code: z.ZodIssueCode.custom,
          message: "Mobile phone is required for additional contact",
        });
      }
    }

    const hasName = !!val.first_name?.trim() || !!val.last_name?.trim();
    const anyEmail =
      !!val.emails.work?.trim() ||
      !!val.emails.personal?.trim() ||
      !!val.emails.other?.trim();
    const anyPhone =
      !!val.phones.main?.trim() ||
      !!val.phones.mobile?.trim() ||
      !!val.phones.work?.trim() ||
      !!val.phones.fax?.trim();

    if (hasName && !(anyEmail || anyPhone)) {
      ctx.addIssue({
        path: ["emails", "work"],
        code: z.ZodIssueCode.custom,
        message: "Provide at least one email or phone when name is provided",
      });
    }
  });

export const ContactsSchema = z
  .array(ContactSchema)
  .min(1, "Primary contact is required");

export const EmergencySchema = z.object({
  first_name: optionalString().optional(),
  last_name: optionalString().optional(),
  relationship_or_position: optionalString().optional(),
  phone: PhoneSchema.optional(),
  email: OptionalEmailSchema.optional(),
});

export const FinancialOverviewSchema = z
  .object({
    sales_revenue_type: z.nativeEnum(SalesRevenueType, { message: "Sales Revenue Type is required" }),
    avg_annual_revenue_bracket: z.nativeEnum(AvgAnnualRevenueBracket, { message: "Average Annual Revenue Bracket is required" }),
    avg_monthly_expenses: z
      .union([z.string(), z.number()])
      .transform((v) => (typeof v === "string" ? v.replace(/[,$\s]/g, "") : v))
      .refine((v) => v === "" || !isNaN(Number(v)), { message: "Must be a number" })
      .transform((v) => (v === "" ? undefined : Number(v))),
    life_cycle_phase: z.nativeEnum(LifeCyclePhase, { required_error: "Life Cycle Phase is required" }),
    accounting_basis: z.nativeEnum(AccountingBasisEnum, { required_error: "Accounting Basis is required" }),

    objectives: z.array(z.nativeEnum(FinancialObjective)).optional().default([]),

    objective_other_text: optionalString().nullable().optional(),

    business_challenges: optionalString().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.objectives?.includes(FinancialObjective.OTHER)) {
      if (!data.objective_other_text || data.objective_other_text.trim() === "") {
        ctx.addIssue({
          path: ["objective_other_text"],
          code: z.ZodIssueCode.custom,
          message: "Please specify your other financial objective",
        });
      }
    } else {
      data.objective_other_text = "";
    }
  });

export const TaxReturnSchema = z.object({
  business: z
    .object({
      biz_last_filed_year: z
        .union([z.number(), z.string(), z.null(), z.undefined()])
        .transform((v) => {
          if (v === null || v === undefined || v === "") return undefined;
          const num = typeof v === "string" ? parseInt(v, 10) : v;
          return isNaN(num) ? undefined : num;
        })
        .refine((v) => v !== undefined, {
          message: "Please select the year your business tax return was last filed",
        })
        .refine((v) => v === undefined || Number.isInteger(v), {
          message: "Year must be a whole number",
        }),
      biz_num_states_filed: z
        .union([z.number(), z.string(), z.null(), z.undefined()])
        .transform((v) => {
          if (v === null || v === undefined || v === "") return undefined;
          const num = typeof v === "string" ? parseInt(v, 10) : v;
          return isNaN(num) ? undefined : num;
        })
        .refine((v) => v === undefined || Number.isInteger(v), {
          message: "Number of states must be a whole number",
        })
        .refine((v) => v === undefined || v >= 0, {
          message: "Number of states cannot be less than 0",
        })
        .refine((v) => v === undefined || v <= 60, {
          message: "Number of states cannot be greater than 60",
        })
        .optional(),
      business_form_filed: z.nativeEnum(BusinessTaxForm, {
        required_error: "Please select the tax form filed for your business",
        invalid_type_error: "Please select a valid business tax form",
      }),
      biz_tax_states: z.array(z.string()).optional().default([]),
    })
    .required(),
  individual: z
    .object({
      ind_last_filed_year: z
        .union([z.number(), z.string(), z.null(), z.undefined()])
        .transform((v) => {
          if (v === null || v === undefined || v === "") return undefined;
          const num = typeof v === "string" ? parseInt(v, 10) : v;
          return isNaN(num) ? undefined : num;
        })
        .refine((v) => v !== undefined, {
          message: "Please select the year your individual tax return was last filed",
        })
        .refine((v) => v === undefined || Number.isInteger(v), {
          message: "Year must be a whole number",
        }),
      ind_num_states_filed: z
        .union([z.number(), z.string(), z.null(), z.undefined()])
        .transform((v) => {
          if (v === null || v === undefined || v === "") return undefined;
          const num = typeof v === "string" ? parseInt(v, 10) : v;
          return isNaN(num) ? undefined : num;
        })
        .refine((v) => v === undefined || Number.isInteger(v), {
          message: "Number of states must be a whole number",
        })
        .refine((v) => v === undefined || v >= 0, {
          message: "Number of states cannot be less than 0",
        })
        .refine((v) => v === undefined || v <= 60, {
          message: "Number of states cannot be greater than 60",
        })
        .optional(),
      ind_tax_states: z.array(z.string()).optional().default([]),
    })
    .required(),
});

export const BookkeepingSettingsSchema = z.object({
  status: z.nativeEnum(BookkeepingStatus, { 
    required_error: "Please select your current bookkeeping status" 
  }),
  service: z.nativeEnum(BookkeepingService).optional(),
  inhouse_handlers: z.array(z.nativeEnum(InhouseHandler)).optional().default([]),
  frequency: z.nativeEnum(BookkeepingFrequency).optional(),
  tools_software: z.boolean().optional().default(false),
  tools_software_used: z.nativeEnum(BookkeepingSoftware).optional(),
  tools_spreadsheets: z.boolean().optional().default(false),
  tools_other: z.boolean().optional().default(false),
  tools_none: z.boolean().optional().default(false),
  tools_other_text: optionalString().optional(),
  reconcile_frequency: z.nativeEnum(ReconcileFrequency).optional(),
  challenges_current_setup: optionalString().optional(),
  utilization: z.array(z.nativeEnum(BookkeepingUtilization)).min(1, "Please select at least one utilization option").optional(),
  benefits: z.array(z.nativeEnum(BookkeepingBenefit)).min(1, "Please select at least one benefit option").optional(),
  reports_reviewed: z.array(z.nativeEnum(ReportsReviewed)).min(1, "Please select at least one report type").optional(),
  report_other_text: optionalString().optional(),
  improvements_wanted: z.array(z.nativeEnum(ImprovementsWanted)).min(1, "Please select at least one improvement area").optional(),
});

export const InvoicingSettingsSchema = z.object({
  creation_tracking_method: z.nativeEnum(CreationTrackingMethod, { 
    required_error: "Please select how invoices are created and tracked" 
  }),
  customer_list_format: z.nativeEnum(CustomerListFormat, { 
    required_error: "Please select your customer list format" 
  }),
  invoice_frequency: z.nativeEnum(InvoiceFrequency, { 
    required_error: "Please select your typical invoice frequency" 
  }),
  customizations_applied: z.boolean().optional().default(false),
  customization_specify: optionalString().optional(),
  delivery_method: z.nativeEnum(DeliveryMethod, { 
    required_error: "Please select your invoice delivery method" 
  }),
});

export const BillPaySettingsSchema = z.object({
  vendor_list_format: z.nativeEnum(VendorListFormat, { 
    required_error: "Please select your vendor list format" 
  }),
  bill_reception_channels: z.array(z.nativeEnum(BillReceptionChannel)).min(1, "Please select at least one bill reception channel"),
  scan_extract_auto: z.boolean().optional().default(false),
  payment_frequency: z.nativeEnum(BillPaymentFrequency, { 
    required_error: "Please select your bill payment frequency" 
  }),
  approval_workflow: z.boolean().optional().default(false),
  approval_specify: optionalString().optional(),
  aging_tracking: z.nativeEnum(AgingTracking, { 
    required_error: "Please select how you track aging or overdue bills" 
  }),
});

export const PayrollSettingsSchema = z.object({
  employee_list_format: z.nativeEnum(EmployeeListFormat, { 
    required_error: "Please select your employee list format" 
  }),
  num_employees_band: z.nativeEnum(NumEmployeesBand, { 
    required_error: "Please select your number of employees" 
  }),
  pay_frequency: z.nativeEnum(PayFrequency, { 
    required_error: "Please select your pay frequency" 
  }),
  salary_type: z.nativeEnum(SalaryType, { 
    required_error: "Please select how you track compensation" 
  }),
  benefits_or_deductions: z.boolean().optional().default(false),
  benefits_specify: optionalString().optional(),
  tax_compliance_support: z.nativeEnum(YesNoNotSure, { 
    required_error: "Please indicate if you need tax compliance support" 
  }),
});

export const StepBusinessInfoSchema = z.object({
  businessProfile: BusinessProfileSchema,
  businessAddresses: AddressesSchema,
  businessContacts: ContactsSchema,
  businessEmergencyContact: EmergencySchema,
});

export const StepBusinessDetailsSchema = z.object({
  businessCompanyProfile: CompanyProfileSchema,
  businessFinancialOverview: FinancialOverviewSchema,
});


export const StepBookkeepingSchema = z
  .object({
    bookkeepingSettings: BookkeepingSettingsSchema,
    taxReturnPreparation: TaxReturnSchema.optional(),
    businessProfile: BusinessProfileSchema.optional(),
  })
  .passthrough()
  .superRefine((val, ctx) => {
    const { hasTaxReturnPreparation } = getBusinessFlags(val);
    
    if (hasTaxReturnPreparation) {
      if (!val.taxReturnPreparation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["taxReturnPreparation"],
          message: "Tax return preparation information is required",
        });
        return;
      }

      if (!val.taxReturnPreparation.business) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["taxReturnPreparation", "business"],
          message: "Business tax information is required",
        });
      }

      if (!val.taxReturnPreparation.individual) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["taxReturnPreparation", "individual"],
          message: "Individual tax information is required",
        });
      }

      const res = TaxReturnSchema.safeParse(val.taxReturnPreparation);
      if (!res.success) pushIssues(ctx, ["taxReturnPreparation"], res.error.issues);
    }
  });

export const StepModulesSchema = z
  .object({
    payrrollSettings: PayrollSettingsSchema.optional(),
    invoicingSettings: InvoicingSettingsSchema.optional(),
    billPaySettings: BillPaySettingsSchema.optional(),
    businessProfile: BusinessProfileSchema.optional(),

  })
  .passthrough()
  .superRefine((val, ctx) => {
    const { hasPayroll, hasInvoices, hasBills } = getBusinessFlags(val);

    if (hasPayroll) {
      if (!val.payrrollSettings) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["payrrollSettings"],
          message: "Required when payroll is enabled",
        });
      } else {
        const r = PayrollSettingsSchema.safeParse(val.payrrollSettings);
        if (!r.success) pushIssues(ctx, ["payrrollSettings"], r.error.issues);
      }
    }

    if (hasInvoices) {
      if (!val.invoicingSettings) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["invoicingSettings"],
          message: "Required when invoicing is enabled",
        });
      } else {
        const r = InvoicingSettingsSchema.safeParse(val.invoicingSettings);
        if (!r.success) pushIssues(ctx, ["invoicingSettings"], r.error.issues);
      }
    }

    if (hasBills) {
      if (!val.billPaySettings) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["billPaySettings"],
          message: "Required when bill pay is enabled",
        });
      } else {
        const r = BillPaySettingsSchema.safeParse(val.billPaySettings);
        if (!r.success) pushIssues(ctx, ["billPaySettings"], r.error.issues);
      }
    }
  });

export const OnboardingSchema = z
  .object({
    ...StepBusinessInfoSchema.shape,
    ...StepBusinessDetailsSchema.shape,
    bookkeepingSettings: BookkeepingSettingsSchema,
    taxReturnPreparation: TaxReturnSchema.optional(),
    payrrollSettings: PayrollSettingsSchema.optional(),
    invoicingSettings: InvoicingSettingsSchema.optional(),
    billPaySettings: BillPaySettingsSchema.optional(),
  })
  .passthrough()
  .superRefine((root, ctx) => {
    const { hasTaxReturnPreparation, hasPayroll, hasInvoices, hasBills } = getBusinessFlags(root);

    if (hasTaxReturnPreparation && !root.taxReturnPreparation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["taxReturnPreparation"],
        message: "Required when tax return preparation is enabled",
      });
    } else if (hasTaxReturnPreparation && root.taxReturnPreparation) {
      const r = TaxReturnSchema.safeParse(root.taxReturnPreparation);
      if (!r.success) pushIssues(ctx, ["taxReturnPreparation"], r.error.issues);
    }

    if (hasPayroll && !root.payrrollSettings) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["payrrollSettings"],
        message: "Required when payroll is enabled",
      });
    } else if (hasPayroll && root.payrrollSettings) {
      const r = PayrollSettingsSchema.safeParse(root.payrrollSettings);
      if (!r.success) pushIssues(ctx, ["payrrollSettings"], r.error.issues);
    }

    if (hasInvoices && !root.invoicingSettings) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["invoicingSettings"],
        message: "Required when invoicing is enabled",
      });
    } else if (hasInvoices && root.invoicingSettings) {
      const r = InvoicingSettingsSchema.safeParse(root.invoicingSettings);
      if (!r.success) pushIssues(ctx, ["invoicingSettings"], r.error.issues);
    }

    if (hasBills && !root.billPaySettings) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["billPaySettings"],
        message: "Required when bill pay is enabled",
      });
    } else if (hasBills && root.billPaySettings) {
      const r = BillPaySettingsSchema.safeParse(root.billPaySettings);
      if (!r.success) pushIssues(ctx, ["billPaySettings"], r.error.issues);
    }
  });

export type OnboardingZod = z.infer<typeof OnboardingSchema>;