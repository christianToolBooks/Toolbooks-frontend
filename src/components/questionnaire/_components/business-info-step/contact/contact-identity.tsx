import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

import { PositionTitle } from "@/src/types/questionnaire";
import { ContactBaseProps } from "../props";

export function ContactIdentity({
  contact,
  index,
  getFieldError,
  onContactChange,
}: ContactBaseProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Field
        label="First Name *"
        value={contact.first_name ?? ""}
        error={getFieldError(`contact.${index}.first_name`)}
        onChange={(v) => onContactChange(index, "first_name", v)}
      />

      <Field
        label="Last Name *"
        value={contact.last_name ?? ""}
        error={getFieldError(`contact.${index}.last_name`)}
        onChange={(v) => onContactChange(index, "last_name", v)}
      />

      <div className="space-y-2">
        <Label>Position / Title *</Label>
        <Select
          value={contact.title ?? ""}
          onValueChange={(v) => onContactChange(index, "title", v)}
        >
          <SelectTrigger
            className={
              getFieldError(`contact.${index}.title`) ? "border-red-500" : ""
            }
          >
            <SelectValue placeholder="Select position" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(PositionTitle).map((title) => (
              <SelectItem key={title} value={title}>
                {title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  error,
  onChange,
}: {
  label: string;
  value: string;
  error: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
