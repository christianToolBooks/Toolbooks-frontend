import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Checkbox } from "@/src/components/ui/checkbox";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CreateCardToPayFormInput } from "../../../schemas/schemas";
import { toast } from "sonner";

interface CardFormFieldsProps {
  register: UseFormRegister<CreateCardToPayFormInput>;
  errors: FieldErrors<CreateCardToPayFormInput>;
  watchIsDefault: boolean;
  onFocusChange: (field: "name" | "number" | "expiry" | "cvc") => void;
  onIsDefaultChange: (checked: boolean) => void;
}

export function CardFormFields({
  register,
  errors,
  watchIsDefault,
  onFocusChange,
  onIsDefaultChange,
}: CardFormFieldsProps) {
  return (
    <div className="space-y-5 p-4 bg-slate-50 rounded-xl">
      <div className="space-y-2">
        <Label htmlFor="card_holder_name">Cardholder Name</Label>
        <Input
          id="card_holder_name"
          placeholder="John Doe"
          {...register("card_holder_name")}
          onFocus={() => onFocusChange("name")}
          className={errors.card_holder_name ? "border-red-500" : ""}
        />
        {errors.card_holder_name && (
          <p className="text-sm text-red-500">{errors.card_holder_name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Label htmlFor="card_number">Card Number</Label>
          <p className="text-chart-3">(Enter the number without spaces)</p>
        </div>
        <Input
          id="card_number"
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          {...register("card_number")}
          onFocus={() => onFocusChange("number")}
          className={errors.card_number ? "border-red-500" : ""}
        />
        {errors.card_number && (
          <p className="text-sm text-red-500">{errors.card_number.message}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="exp_month">Month</Label>
          <Input
            id="exp_month"
            placeholder="MM"
            maxLength={2}
            {...register("exp_month")}
            onFocus={() => onFocusChange("expiry")}
            className={errors.exp_month ? "border-red-500" : ""}
          />
          {errors.exp_month && (
            <p className="text-sm text-red-500">{errors.exp_month.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="exp_year">Year</Label>
          <Input
            id="exp_year"
            placeholder="YY"
            maxLength={2}
            {...register("exp_year")}
            onFocus={() => onFocusChange("expiry")}
            className={errors.exp_year ? "border-red-500" : ""}
          />
          {errors.exp_year && (
            <p className="text-sm text-red-500">{errors.exp_year.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            placeholder="123"
            maxLength={4}
            type="password"
            {...register("cvv")}
            onFocus={() => onFocusChange("cvc")}
            className={errors.cvv ? "border-red-500" : ""}
          />
          {errors.cvv && <p className="text-sm text-red-500">{errors.cvv.message}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Mark as default</Label>
        <div className="flex items-center gap-2 mt-2">
          <Checkbox
            id="is_default"
            className="bg-chart-5 border-chart-3"
            checked={watchIsDefault}
            onCheckedChange={(checked) => {
              onIsDefaultChange(Boolean(checked));
              if (checked) {
                toast.info(
                  "This will become your default payment method. Any other default card will be unmarked."
                );
              }
            }}
          />
          <Label htmlFor="is_default" className="font-normal ml-2">
            Set this card as my default payment method
          </Label>
        </div>
        <p className="text-xs text-gray-500 ml-6">
          Only one card can be set as default. Setting this card as default will
          unmark any other default card.
        </p>
      </div>
    </div>
  );
}
