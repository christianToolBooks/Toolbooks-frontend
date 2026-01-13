import { Card, CardDescription, CardTitle } from "@/src/components/ui/card";
import type { CustomerFormToPaymentInput as T } from "../../schemas/schemas";
import { CustomerAddressToPay } from "./customer-address";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { PhoneFieldToCustomerToPay } from "../inputPhoneToCustomerToPay";

interface CustomerFormToPayProps {
  i: number;
  data: T;
  onAddressChange: (index: number, field: keyof T, value: string) => void;
  onInputChange?: (field: keyof T, value: string) => void;
  getFieldError: (fieldPath: string) => string | null;
  setValue: UseFormSetValue<T>;
  errors?: FieldErrors<T>;
  register: UseFormRegister<T>;
  watch: UseFormWatch<T>;
}
export function CustomerFormToPay({
  data,
  setValue,
  register,
  watch,
  onAddressChange,
  onInputChange,
  i,
  getFieldError,
}: CustomerFormToPayProps) {
  return (
    <Card className="border-none shadow-none">
      <div>
        <CardTitle>Billing information</CardTitle>
        <CardDescription>
          Please provide your billing details below.
        </CardDescription>
      </div>
      <div className="flex justify-center items-center">
        <div className="grid w-full max-w-3xl items-center gap-1.5 mt-4 p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                value={data.name || ""}
                onChange={(e) => onInputChange?.("name", e.target.value)}
                className={getFieldError("name") ? "border-red-500" : ""}
              />
              {getFieldError("name") && (
                <p className="text-sm text-red-500">{getFieldError("name")}</p>
              )}
            </div>
            <PhoneFieldToCustomerToPay
              name="phone_number"
              label="Phone Number"
              required
              register={register}
              watch={watch}
              setValue={setValue}
              errorMsg={getFieldError("phone_number")}
            />
            <div className="space-y-2">
              <Label htmlFor="email" className="mt-4">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                value={data.email || ""}
                onChange={(e) => onInputChange?.("email", e.target.value)}
                className={getFieldError("email") ? "border-red-500" : ""}
              />
              {getFieldError("email") && (
                <p className="text-sm text-red-500">{getFieldError("email")}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="send_email_address" className="mt-4">
                Email to receive updates
              </Label>
              <Input
                type="email"
                id="send_email_address"
                value={data.send_email_address || ""}
                onChange={(e) =>
                  onInputChange?.("send_email_address", e.target.value)
                }
                className={
                  getFieldError("send_email_address") ? "border-red-500" : ""
                }
              />
              {getFieldError("send_email_address") && (
                <p className="text-sm text-red-500">
                  {getFieldError("send_email_address")}
                </p>
              )}
            </div>
          </div>
            <div className="space-y-2">
              <Label className="mt-4">Address</Label>
              <CustomerAddressToPay
                addr={data}
                onAddressChange={(index, field, value) =>
                  onAddressChange(index, field as keyof T, value)
                }
                getFieldError={getFieldError}
                setValue={setValue}
                i={i}
              />
            </div>
        </div>
      </div>
    </Card>
  );
}
