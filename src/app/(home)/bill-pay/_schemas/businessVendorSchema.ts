import { z } from "zod";

/* ----------------------------- Enums (Zod) ----------------------------- */

export const PaymentTermsSchema = z.enum(["net_0", "net_15", "net_30", "custom"]);
export const VendorAddressTypeSchema = z.enum([
  "billed_from",
  "shipped_from",
  "remit_to",
]);

/* ----------------------------- Common Helpers ----------------------------- */

const PHONE_REGEX = /^\+?[0-9()\-\s]{5,20}$/;
const optStr = z
  .string()
  .trim()
  .transform((val) => (val === "" ? undefined : val))
  .optional();

/* ----------------------- Subschemas (Contact & Address) ----------------------- */

export const CreateVendorContactSchema = z
  .object({
    id: z.string().optional(),
    vendorId: z.string().uuid().optional(),
    name: optStr,
    email: z.string().email().optional(),
    phone: z.string().regex(PHONE_REGEX, "Invalid phone").optional(),
    role: optStr,
    jobTitle: optStr,
    isPrimary: z.boolean().optional(),
  })
  .strict()
  .refine(
    (c) => !(c.email || c.phone) || !!(c.name && c.name.trim().length),
    {
      message: "Contact name is required when email or phone is provided",
      path: ["name"], 
    }
  );


export const CreateVendorAddressSchema = z
  .object({
    id: z.string().optional(),
    vendorId: z.string().uuid().optional(),
    type: VendorAddressTypeSchema,
    line1: optStr,
    line2: optStr,
    city: optStr,
    state: optStr,
    postalCode: optStr,
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    country: z.string().trim().min(2).max(60).optional(),
    isDefault: z.boolean().optional(),
  })
  .strict()
  .refine(
    (a) => !!(a.line1 || a.city || a.state || a.postalCode || a.country),
    { message: "Provide at least one address field (line1, city, state, postalCode or country)" }
  );

/* ----------------------------- Principal Schema ----------------------------- */

export const CreateVendorSchema = z
  .object({
    businessProfileId: z.string().uuid().optional(),
    name: z.string().trim().min(1, "Vendor name is required"),
    legalName: optStr,
    type: z.literal("business"),
    paymentTerms: PaymentTermsSchema,
    defaultCurrency: z
      .string()
      .trim()
      .regex(/^[A-Z]{3}$/, "Use ISO 4217 code, e.g. USD"),
    email: z.string().email().optional(),
    phone: z.string().regex(PHONE_REGEX, "Invalid phone").optional(),
    notes: z.string().max(2000).optional(),
    isActive: z.boolean().optional(),

    contacts: z.array(CreateVendorContactSchema).optional(),
    addresses: z.array(CreateVendorAddressSchema).optional(),
  })
  .strict()
  .superRefine((v, ctx) => {
    const primaries = (v.contacts ?? []).filter((c) => c.isPrimary).length;
    if (primaries > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only one contact can be marked as primary",
        path: ["contacts"],
      });
    }
  })
  .superRefine((v, ctx) => {
    const byType: Record<string, number> = {};
    (v.addresses ?? []).forEach((a, i) => {
      if (a.isDefault) {
        byType[a.type] = (byType[a.type] ?? 0) + 1;
        if (byType[a.type] > 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Only one default address allowed for type "${a.type}"`,
            path: ["addresses", i, "isDefault"],
          });
        }
      }
    });
  });

  export const CreateIndividualVendorSchema = z
  .object({
    businessProfileId: z.string().uuid().optional(),
    name: z.string().trim().min(1, "Vendor name is required"),
    type: z.literal("individual"),
    paymentTerms: PaymentTermsSchema,
    defaultCurrency: z
      .string()
      .trim()
      .regex(/^[A-Z]{3}$/, "Use ISO 4217 code, e.g. USD"),
    email: z.string().email().optional(),
    phone: z.string().regex(PHONE_REGEX, "Invalid phone").optional(),
    notes: z.string().max(2000).optional(),
    isActive: z.boolean().optional(),

    addresses: z.array(CreateVendorAddressSchema).optional(),
  })
  .strict()
  .superRefine((v, ctx) => {
    const byType: Record<string, number> = {};
    (v.addresses ?? []).forEach((a, i) => {
      if (a.isDefault) {
        byType[a.type] = (byType[a.type] ?? 0) + 1;
        if (byType[a.type] > 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Only one default address allowed for type "${a.type}"`,
            path: ["addresses", i, "isDefault"],
          });
        }
      }
    });
  });
/* --------------------------- inferred types (opc.) --------------------------- */
export type CreateVendorInputSchemaType = z.infer<typeof CreateVendorSchema>;
export type CreateIndividualVendorInputSchemaType = z.infer<typeof CreateIndividualVendorSchema>;
export type CreateVendorContactInput = z.infer<typeof CreateVendorContactSchema>;
export type CreateVendorAddressInput = z.infer<typeof CreateVendorAddressSchema>;
