import { usePhoneNumberInput } from "@/src/hooks/usePhonNumberInput";
import { Label } from "@/src/components/ui/label";
import { Phone } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { motion } from "framer-motion"
import { FormData, FormStepsProps } from "../types/types";

export function InputPhoneFormateToVendorForm ({
register,
setValue,
watch,
contactsIndex = 0
}: FormStepsProps){
 const phoneNumberProps = usePhoneNumberInput<FormData>({
    name: `contacts.${contactsIndex}.phone`,
    setValue,
    watch,
    registerReturn: register(`contacts.${contactsIndex}.phone`, {
      validate: {
        minLength: (value) => {
          const cleaned = value?.replace(/\D/g, "") || "";
          return (
            cleaned.length === 11 ||
            "Phone number must be 10 digits long (after +1)"
          );
        },
      },
    }),
  });
  const phone_number = watch(`contacts.${contactsIndex}.phone`);
  const isPhoneValid = phone_number && phone_number.length >= 10;
  return(
    <div className="space-y-2">
          <Label htmlFor="primary_contact" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Primary Contact
          </Label>
          <div className="flex gap-2">
            <Input
              id="primary_contact"
              placeholder="+1 (555) 000-0000"
              type="tel"
              {...phoneNumberProps}
            />
            {isPhoneValid && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
              </motion.div>
            )}
          </div>
        </div>
  )
} 