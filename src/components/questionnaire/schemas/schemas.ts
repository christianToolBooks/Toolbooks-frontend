import { z } from "zod";
import {
  BookkeepingStatus,
  BusinessType,
  ContactMethod,
  EmailKind,
  PhoneKind,
} from "@/src/types/questionnaire";
import { BankToPayTypeEnum, PayarcAccountType, PayarcSecCodeToACHForm } from "@/src/types/paymentMethods";

export const BookkeepingStatusEnum = z.nativeEnum(BookkeepingStatus);
export const BusinessTypeEnum = z.nativeEnum(BusinessType);
export const ContactMethodEnum = z.nativeEnum(ContactMethod);
export const EmailKindEnum = z.nativeEnum(EmailKind);
export const PhoneKindEnum = z.nativeEnum(PhoneKind);
export const PayarcAccountTypeEnum = z.nativeEnum(PayarcAccountType);
export const SecCodeEnum = z.nativeEnum(PayarcSecCodeToACHForm);
export const BanckToPayTypeEnum = z.nativeEnum(BankToPayTypeEnum);

/* =========================
 * Helpers
 * ========================= */
const onlyLettersRegex = /^[A-Za-zÀ-ÿ\s'-]+$/;
const zipRegex = /^[0-9]{4,10}$/;
const phoneRegex = /^[0-9+\-() ]{7,20}$/;
const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === "" ? undefined : v), schema.optional());

/* =========================
 * Entities
 * ========================= */

export const BusinessProfileSchema = z
  .object({
    business_name: z
      .string()
      .min(1, "Business name is required")
      .max(100, "Business name must be less than 100 characters"),
    dba: z.string().optional(),
    website: z.string().optional().or(z.literal("")),
    hasInvoices: z.boolean(),
    hasBills: z.boolean(),
    hasPayroll: z.boolean(),
    hasTaxReturnPreparation: z.boolean(),
    userId: z.string().uuid().optional(),
  })
  .strict();

export const CompanyProfileSchema = z
  .object({
    business_type: BusinessTypeEnum,
  })
  .strict();

export const BookkeepingSettingsSchema = z
  .object({
    status: BookkeepingStatusEnum,
  })
  .strict();

export const FinancialOverviewSchema = z
  .object({
    avg_monthly_expenses: z
      .string()
      .min(1, "Average Monthly Expenses is required")
      .optional()
      .or(z.literal("")),
  })
  .strict();

export const AddressSchema = z
  .object({
    line1: z.string().min(1, "Address line 1 is required"),
    line2: z.string().optional(),
    city: z
      .string()
      .min(1, "City is required")
      .regex(onlyLettersRegex, "City must contain only letters"),
    state: z
      .string()
      .min(1, "State is required")
      .regex(onlyLettersRegex, "State must contain only letters"),
    zip_code: z
      .string()
      .min(1, "Zip code is required")
      .regex(zipRegex, "Zip must be numeric (4–10 digits)"),
    business_profile_id: z.string().uuid().optional(),
    country: z.string().min(1, "Country is required"),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  })
  .strict();

export const ContactEmailsSchema = z
  .object({
    contact_id: z.string().optional(),
    work: z
      .string()
      .email("Invalid work email")
      .optional()
      .or(z.literal("")),
    personal: z
      .string()
      .email("Invalid personal email")
      .optional()
      .or(z.literal("")),
    other: z.string().email("Invalid other email").optional().or(z.literal("")),
  })
  .strict()
  .refine(
    (data) => {
      // Al menos un email debe estar lleno
      const hasWork = data.work && data.work.trim() !== "";
      const hasPersonal = data.personal && data.personal.trim() !== "";
      const hasOther = data.other && data.other.trim() !== "";
      return hasWork || hasPersonal || hasOther;
    },
    {
      message: "At least one email (Work, Personal, or Other) is required",
      path: ["work"], // Mostrar el error en el campo work
    }
  );

export const ContactPhonesSchema = z
  .object({
    contact_id: z.string().optional(),
    main: emptyToUndefined(
      z.string().regex(phoneRegex, "Invalid phone format")
    ),
    mobile: z
      .string()
      .min(1, "Mobile is required")
      .regex(phoneRegex, "Invalid mobile number"),
    work: emptyToUndefined(z.string().regex(phoneRegex, "Invalid work number")),
    fax: emptyToUndefined(z.string().regex(phoneRegex, "Invalid fax number")),
  })
  .strict();

export const ContactSchema = z
  .object({
    business_profile_id: z.string().optional(),
    first_name: z
      .string()
      .min(1, "First name is required")
      .regex(onlyLettersRegex, "First name must contain only letters"),
    last_name: z
      .string()
      .min(1, "Last name is required")
      .regex(onlyLettersRegex, "Last name must contain only letters"),
    title: z
      .string()
      .min(1, "Position/Title is required"),
    isPrimary: z.boolean(),
    isAuthorized: z.boolean(),
    preferred_contact_method: ContactMethodEnum,
    preferred_email_kind: EmailKindEnum.optional(),
    preferred_phone_kind: PhoneKindEnum.optional(),
    phones: ContactPhonesSchema,
    emails: ContactEmailsSchema,
  })
  .strict()
  .refine(
    (data) => {
      // Siempre se debe seleccionar un email preferido
      return data.preferred_email_kind !== undefined && data.preferred_email_kind !== null;
    },
    {
      message: "Please select a preferred email",
      path: ["preferred_email_kind"],
    }
  )
  .refine(
    (data) => {
      // Siempre se debe seleccionar un teléfono preferido
      return data.preferred_phone_kind !== undefined && data.preferred_phone_kind !== null;
    },
    {
      message: "Please select a preferred phone",
      path: ["preferred_phone_kind"],
    }
  );

export const CreateGetStartedOnboardingSchema = z
  .object({
    businessProfile: BusinessProfileSchema,
    businessCompanyProfile: CompanyProfileSchema,
    bookkeepingSettings: BookkeepingSettingsSchema,
    businessFinancialOverview: FinancialOverviewSchema,
    businessAddress: z.array(AddressSchema),
    contact: z.array(ContactSchema),
  })
  .strict();

export const customerFormToPaymentSchema = z.object({
  name: z
    .string()
    .min(2, { message: "The name must be at least 2 characters long." })
    .max(100, { message: "The name is too long." }),

  email: z
    .string()
    .email({ message: "Must be a valid email address." }),

  send_email_address: z
    .string()
    .email({ message: "Must be a valid email address." }),

  country: z
    .string()
    .length(2, {
      message: "The country must be a 2-letter ISO code (e.g., US, CO, MX).",
    })
    .toUpperCase(),

  address_line_1: z
    .string()
    .min(5, { message: "The address must be at least 5 characters long." }),

  city: z
    .string()
    .min(2, { message: "The city must be at least 2 characters long." }),

  state: z
    .string()
    .min(2, { message: "The state must be at least 2 characters long." }),

  zip_code: z
    .string()
    .regex(/^\d{4,10}$/, {
      message: "The zip code must be numeric and valid.",
    }),

  latitude: z.number().optional(),
  longitude: z.number().optional(),
  phone_number: z
    .string()
      .min(1, "Mobile is required")
      .regex(phoneRegex, "Invalid mobile number"),
});

export const createCardToPaySchema = z.object({
  payarc_card_source: z.literal("internet"),
  card_number: z
    .string()
    .regex(/^\d{13,19}$/, "Invalid card number")
    .min(13, "Card number too short"),
  exp_month: z.string().regex(/^(0[1-9]|1[0-2])$/, "Invalid month (01-12)"),
  exp_year: z.string().regex(/^\d{2}$/, "Invalid year (last two digits)"),
  cvv: z.string().regex(/^\d{3,4}$/, "Invalid CVV"),
  card_holder_name: z.string().min(3, "Cardholder name required"),
  is_default: z.boolean().default(true),
});

export const createACHToPaySchema = z.object({
  account_number: z
    .string()
    .min(4, "Account number must be at least 4 digits")
    .max(17, "Account number must be at most 17 digits")
    .regex(/^\d+$/, "Account number must be numeric"),
  routing_number: z
    .string()
    .length(9, "Routing number must be 9 digits")
    .regex(/^\d+$/, "Routing number must be numeric"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  account_type: PayarcAccountTypeEnum,
  company_name: z.string().optional().or(z.literal("")),
  customer_id: z.string(),
}).refine(
  (data) => {
    const isBusinessAccount = 
      data.account_type === PayarcAccountType.BUSINESS_CHECKING ||
      data.account_type === PayarcAccountType.BUSINESS_SAVINGS;
    
    if (isBusinessAccount && (!data.company_name || data.company_name.trim() === "")) {
      return false;
    }
    return true;
  },
  {
    message: "Company name is required for business accounts",
    path: ["company_name"],
  }
);

/* =========================
 * Types
 * ========================= */
export type BusinessProfileInput = z.infer<typeof BusinessProfileSchema>;
export type CompanyProfileInput = z.infer<typeof CompanyProfileSchema>;
export type BookkeepingSettingsInput = z.infer<
  typeof BookkeepingSettingsSchema
>;
export type FinancialOverviewInput = z.infer<typeof FinancialOverviewSchema>;
export type AddressInput = z.infer<typeof AddressSchema>;
export type ContactInput = z.infer<typeof ContactSchema>;
export type CreateGetStartedOnboardingInput = z.infer<
  typeof CreateGetStartedOnboardingSchema
>;
export type CustomerFormToPaymentInput = z.infer<
  typeof customerFormToPaymentSchema
>;
export type CreateCardToPayFormInput = z.infer<typeof createCardToPaySchema>;
export type CreateACHToPayFormInput = z.infer<typeof createACHToPaySchema>;