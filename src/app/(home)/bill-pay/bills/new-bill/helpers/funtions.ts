import { z } from "zod";

export const toNum = (v: unknown) =>
  v === "" || v == null ? 0 : Number(String(v).replace(/,/g, ""));

export const twoDpNumber = z
  .preprocess((v) => toNum(v), z.number().finite())
  .transform((n) => Number((Math.round(n * 100) / 100).toFixed(2))); // number con 2dp

export const fourDpNumber = z
  .preprocess((v) => toNum(v), z.number().finite())
  .transform((n) => Number((Math.round(n * 10000) / 10000).toFixed(4))); // number con 4dp

export const money2AsString = twoDpNumber.transform((n) => n.toFixed(2)); // -> string "0.00"
export const qty4AsString = fourDpNumber.transform((n) => n.toFixed(4));  // -> string "0.0000"

export const dateStr = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");
export const toNum2 = (v: unknown) => (v === "" || v == null ? 0 : Number(String(v).replace(/,/g, "")));
export const r2 = (x: number) => Math.round(x * 100) / 100;
export const r4 = (x: number) => Math.round(x * 10000) / 10000;
export const to2 = (x: number) => r2(x).toFixed(2);
export const to4 = (x: number) => r4(x).toFixed(4);