import type { CreateGetStartedOnboardingInput as T } from "../schemas/schemas";
import type { Questionnaire } from "@/src/types/questionnaire";

export function toE164US(input: unknown, opts: { required?: boolean } = {}) {
  const { required = false } = opts;

  const cleanedRaw = String(input ?? "")
    .replace(/[\u200E\u200F\u202A-\u202E\u00A0]/g, "")
    .trim();

  const digits = cleanedRaw.replace(/\D/g, "");

  if (!digits) {
    if (required) throw new Error("Phone is required");
    return undefined;
  }

  let e164 = "";
  if (digits.length === 10) {
    e164 = `+1${digits}`;
  } else if (digits.length === 11 && digits.startsWith("1")) {
    e164 = `+${digits}`;
  } else if (digits.length > 11 && digits.length <= 15) {
    e164 = `+${digits}`;
  } else {
    e164 = `+${digits}`;
  }

  return e164;
}

export function normalizePhonesForApi(parsed: T): Questionnaire {
  return {
    ...parsed,
    contact: parsed.contact.map((c) => ({
      ...c,
      phones: {
        ...c.phones,
        mobile: toE164US(c.phones.mobile, { required: true })!, 
        work: toE164US(c.phones.work),
        main: toE164US(c.phones.main),
        fax: toE164US(c.phones.fax),
      },
    })),
  } as unknown as Questionnaire;
}
