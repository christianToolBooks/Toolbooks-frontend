import { Label } from "@/src/components/ui/label";
import { Checkbox } from "@/src/components/ui/checkbox";
import { FieldPath } from "react-hook-form";

import type { CreateGetStartedOnboardingInput as T } from "@/src/components/questionnaire/schemas/schemas";
import { ContactBaseProps, PhoneFormProps } from "../props";
import { usePreferredContact } from "../../../_hooks/usePreferredContact";
import { PhoneField } from "../../inputPhoneToGetStarted";

type Props = ContactBaseProps & PhoneFormProps;

export function ContactPhones(props: Props) {
  const { contact, index, getFieldError } = props;
  const preferred = usePreferredContact(index, props.onContactChange);

  const phones = [
    { key: "mobile", label: "Mobile Phone", required: true },
    { key: "work", label: "Work Phone", required: false },
    { key: "main", label: "Other Phone", required: false },
  ] as const;

  return (
    <div>
      <p className="text-sm text-muted-foreground italic mb-4">
        * Select a preferred phone contact method
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {phones.map(({ key, label, required }) => (
          <div key={key}>
            <PhoneField
              name={`contact.${index}.phones.${key}` as FieldPath<T>}
              label={label}
              required={required}
              register={props.register}
              watch={props.watch}
              setValue={props.setValue}
              errorMsg={
                getFieldError(`contact.${index}.phones.${key}`) ?? undefined
              }
            />

            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                checked={contact.preferred_phone_kind === key}
                onCheckedChange={(checked) => {
                  if (checked) {
                    preferred.setPreferredPhone(key);
                  }
                }}
              />
              <Label className="text-sm font-normal">
                Preferred contact method
              </Label>
            </div>
          </div>
        ))}
      </div>

      {getFieldError(`contact.${index}.preferred_phone_kind`) && (
        <p className="text-sm text-red-500 mt-2">
          {getFieldError(`contact.${index}.preferred_phone_kind`)}
        </p>
      )}
    </div>
  );
}
