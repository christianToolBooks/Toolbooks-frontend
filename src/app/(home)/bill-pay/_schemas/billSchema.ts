"use client";

import { z } from "zod";
import { dateStr, money2AsString, qty4AsString, toNum } from "../bills/new-bill/helpers/funtions";

/* ----------------------------- Line Item --------------------------------- */

export const LineItemSchema = z
  .object({
    line_no: z.union([
      z.string(),
      z.number().transform(String),
      z.null()
    ]).optional(),
    description: z.string().max(500).optional().default(""),
    quantity: qty4AsString,     // string "x.xxxx"
    unit_price: money2AsString, // string "x.xx"
    amount: money2AsString,     // string "x.xx" (derivado pero validamos consistencia)
    department: z.string().nullable().optional(),
    tax_code: z.string().nullable().optional(),
  })
  .superRefine((v, ctx) => {
    // Valida amount ≈ qty * unit_price (2dp)
    const qty = toNum(v.quantity);
    const price = toNum(v.unit_price);
    const expected = Number((Math.round(qty * price * 100) / 100).toFixed(2));
    const got = toNum(v.amount);
    if (Math.abs(expected - got) > 0.01) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Amount should be qty * unit price (${expected.toFixed(2)})`,
        path: ["amount"],
      });
    }
  });

/* ------------------------------- Bill ------------------------------------ */

export const BillFormSchema = z
  .object({
    invoiceNumber: z.string().min(1, "Invoice number is required"),
    vendor_name: z.string().optional().default(""),
    vendor_address: z.string().optional().default(""), // si no lo usas, déjalo vacío
    invoice_date: dateStr,
    dueDate: dateStr,
    currency: z
      .string()
      .nullable()
      .transform((v) => (v && v.trim() ? v.toUpperCase() : "USD")),
    // payment_terms: z.string().optional().default("Net 30"),

    subtotal: money2AsString,       // string "x.xx"
    tax_total: money2AsString,      // editable
    discount_total: money2AsString, // editable
    total: money2AsString,          // string "x.xx"

    memo: z.string().max(2000).optional().default(""),

    // Cambiamos esto para manejar el objeto vendor
    vendor: z.object({
      id: z.string(),
      name: z.string().optional(),
      legalName: z.string().optional(),
      phone: z.string().optional(),
    }).optional(),
    
    account_id: z.string().uuid().nullable().optional(),
    subaccount_id: z.string().uuid().nullable().optional(),

    line_items: z.array(LineItemSchema).min(1, "Add at least one line"),
  })
  .superRefine((v, ctx) => {
    // due_date >= invoice_date
    if (v.invoice_date && v.dueDate && v.dueDate < v.invoice_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Due date must be after or equal to invoice date",
        path: ["due_date"],
      });
    }

    // total ≈ subtotal + tax - discount (2dp)
    const subtotal = toNum(v.subtotal);
    const tax = toNum(v.tax_total);
    const disc = toNum(v.discount_total);
    const expected = Number((Math.round((subtotal + tax - disc) * 100) / 100).toFixed(2));
    const got = toNum(v.total);
    if (Math.abs(expected - got) > 0.01) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Total should be Subtotal + Tax - Discount (${expected.toFixed(2)})`,
        path: ["total"],
      });
    }

    if (!v.account_id && !v.subaccount_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a Chart Account",
        path: ["account_id"],
      });
    }

    // Validamos que haya vendor
    if (!v.vendor || !v.vendor.id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a vendor",
        path: ["vendor"],
      });
    }
  });

/* -------------------------- Transform → Backend --------------------------- */
/** Devuelve el payload listo para POST /ap/bills */
export const BillPayloadSchema = BillFormSchema.transform((v) => {
  const lines = v.line_items.map((li, idx) => {
    const lineNo = li.line_no ? 
      (typeof li.line_no === 'string' ? Number(li.line_no) : li.line_no) : 
      idx + 1;

    return {
      lineNo,
      description: li.description || undefined,
      quantity: li.quantity,     // "x.xxxx"
      unitPrice: li.unit_price,  // "x.xx"
      amount: li.amount,         // "x.xx"
      department: li.department || undefined,
      taxCode: li.tax_code || undefined,
    };
  });

  return {
    vendorId: v.vendor?.id ?? undefined, // ← Aquí extraemos el ID del vendor
    invoiceNumber: v.invoiceNumber || undefined,
    invoiceDate: v.invoice_date || undefined,
    dueDate: v.dueDate || undefined,
    currency: v.currency || "USD",
    subtotal: v.subtotal,
    taxTotal: v.tax_total,
    discountTotal: v.discount_total,
    total: v.total,
    memo: v.memo || undefined,
    account_id: v.account_id ?? undefined,
    subaccount_id: v.subaccount_id ?? undefined,
    lines,
  };
});

export type BillFormValues = z.infer<typeof BillFormSchema>;
export type BillPayload = z.infer<typeof BillPayloadSchema>;