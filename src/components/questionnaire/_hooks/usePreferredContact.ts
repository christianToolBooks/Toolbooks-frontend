export interface ContactChangeHandler {
  (index: number, path: string, value: string | boolean): void;
}

export function usePreferredContact(
  index: number,
  onContactChange: ContactChangeHandler
) {
  return {
    setPreferredEmail(kind: "work" | "personal" | "other") {
      onContactChange(index, "preferred_email_kind", kind);
    },

    setPreferredPhone(kind: "mobile" | "work" | "main") {
      onContactChange(index, "preferred_phone_kind", kind);
    },
  };
}
