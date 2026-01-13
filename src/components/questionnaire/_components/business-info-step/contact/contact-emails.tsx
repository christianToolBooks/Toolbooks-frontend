import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import { ContactBaseProps } from "../props";
import { usePreferredContact } from "../../../_hooks/usePreferredContact";


export function ContactEmails(props: ContactBaseProps) {
  const { contact, index, getFieldError } = props;
  const preferred = usePreferredContact(index, props.onContactChange);

  const emails = [
    { key: "work", label: "Work Email" },
    { key: "personal", label: "Personal Email" },
    { key: "other", label: "Other Email" },
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {emails.map(({ key, label }) => (
        <div key={key} className="space-y-2">
          <Label>{label}</Label>
          <Input
            type="email"
            value={contact.emails?.[key] ?? ""}
            onChange={(e) =>
              props.onContactChange(index, `emails.${key}`, e.target.value)
            }
          />

          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              checked={contact.preferred_email_kind === key}
              onCheckedChange={(checked) => {
                if (checked) {
                  preferred.setPreferredEmail(key);
                }
              }}
            />
            <Label className="text-sm font-normal">
              Preferred contact method
            </Label>
          </div>
        </div>
      ))}

      {getFieldError(`contact.${index}.preferred_email_kind`) && (
        <p className="text-sm text-red-500 col-span-full">
          {getFieldError(`contact.${index}.preferred_email_kind`)}
        </p>
      )}
    </div>
  );
}
