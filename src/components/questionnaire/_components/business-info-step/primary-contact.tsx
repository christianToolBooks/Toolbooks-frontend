import { Separator } from "@/src/components/ui/separator";
import { PrimaryContactProps } from "./props";
import { ContactIdentity } from "./contact/contact-identity";
import { ContactEmails } from "./contact/contact-emails";
import { ContactPhones } from "./contact/contact-phones";


export default function PrimaryContact({
  data,
  getFieldError,
  onContactChange,
  register,
  watch,
  setValue,
}: PrimaryContactProps) {
  const contact = data.contacts[0] ?? {};
  const index = 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-primary">Primary Contact</h3>
      <Separator className="mb-6" />

      <div className="space-y-6 p-4">
        <ContactIdentity
          contact={contact}
          index={index}
          getFieldError={getFieldError}
          onContactChange={onContactChange}
        />

        <ContactEmails
          contact={contact}
          index={index}
          getFieldError={getFieldError}
          onContactChange={onContactChange}
        />

        <ContactPhones
          contact={contact}
          index={index}
          getFieldError={getFieldError}
          onContactChange={onContactChange}
          register={register}
          watch={watch}
          setValue={setValue}
        />
      </div>
    </div>
  );
}
