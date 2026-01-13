/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  UseFormSetValue,
  UseFormWatch,
  UseFormRegisterReturn,
  FieldPath,
  PathValue,
} from "react-hook-form";

interface FormWithPhoneNumber {
  phone: string;
}

interface UsePhoneNumberInputProps<TForm extends Record<string, any>> {
  name: FieldPath<TForm>;
  setValue: UseFormSetValue<TForm>;
  watch: UseFormWatch<TForm>;
  registerReturn: UseFormRegisterReturn;
}

export const usePhoneNumberInput = <TForm extends Record<string, any>>({
  name,
  setValue,
  watch,
  registerReturn,
}: UsePhoneNumberInputProps<TForm>) => {
  const phoneNumberValue = watch(name) as string | undefined;

  const formatPhoneNumber = (raw: string): string => {
    const digits = raw.replace(/\D/g, "");
    const cleanNumber = digits.startsWith("1") ? digits.slice(1) : digits;
    if (cleanNumber === "") return "";

    let formatted = "";
    if (cleanNumber.length > 0) formatted += `(${cleanNumber.slice(0, 3)}`;
    if (cleanNumber.length > 3) formatted += `) ${cleanNumber.slice(3, 6)}`;
    if (cleanNumber.length > 6) formatted += `-${cleanNumber.slice(6, 10)}`;

    return formatted.slice(0, "(555) 555-5555".length);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatPhoneNumber(value);
    setValue(name, formattedValue as PathValue<TForm, typeof name>, { shouldValidate: true });
    registerReturn.onChange?.(e); 
  };

  return {
    ...registerReturn,
    value: phoneNumberValue || "",
    onChange: handlePhoneChange,
  };
};

export const cleanPhoneNumberForBackend = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, "");
  return cleaned.startsWith("1") ? `+${cleaned}` : `+1${cleaned}`;
};