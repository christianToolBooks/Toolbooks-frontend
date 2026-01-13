import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { CreditCard } from "lucide-react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { CardFormFields } from "./CardFormFields";
import { CreateCardToPayFormInput } from "../../../schemas/schemas";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface CardFormViewProps {
  register: UseFormRegister<CreateCardToPayFormInput>;
  errors: FieldErrors<CreateCardToPayFormInput>;
  watchValues: CreateCardToPayFormInput;
  focused: "name" | "number" | "expiry" | "cvc" | "";
  isEditing: boolean;
  hasMaxCards: boolean;
  maxCards: number;
  hasSavedCards: boolean;
  loading: boolean;
  onFocusChange: (field: "name" | "number" | "expiry" | "cvc") => void;
  onBackToCards: () => void;
  onSubmit: () => void;
  onIsDefaultChange: (checked: boolean) => void;
}

export function CardFormView({
  register,
  errors,
  watchValues,
  focused,
  isEditing,
  hasMaxCards,
  maxCards,
  hasSavedCards,
  loading,
  onFocusChange,
  onBackToCards,
  onSubmit,
  onIsDefaultChange,
}: CardFormViewProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-md font-semibold text-[#1E3A8A] flex items-center gap-2">
            {isEditing ? "Edit Card" : "Payment Details"}
          </h3>
          <p className="text-sm text-gray-600 text-start">
            {isEditing
              ? "Update your card information below."
              : hasMaxCards
              ? `You have reached the maximum limit of ${maxCards} cards. Please delete a card to add a new one.`
              : "Enter your card information below."}
          </p>
        </div>
        {(hasSavedCards || isEditing) && (
          <Button
            type="button"
            variant="ghost"
            onClick={onBackToCards}
            className="text-[#1E3A8A]"
          >
            ← Back to saved cards
          </Button>
        )}
      </div>

      {hasMaxCards && !isEditing ? (
        <Card className="mt-6 border-2 border-orange-200 bg-orange-50">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
              <CreditCard className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Maximum Cards Reached
            </h3>
            <p className="text-gray-600 mb-4">
              You have reached the maximum limit of {maxCards} payment cards. To add
              a new card, please delete one of your existing cards first.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={onBackToCards}
              className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white"
            >
              ← Back to saved cards
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6 border-none shadow-none">
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <Cards
                number={watchValues.card_number || ""}
                name={watchValues.card_holder_name || ""}
                expiry={`${watchValues.exp_month || ""}${watchValues.exp_year || ""}`}
                cvc={watchValues.cvv || ""}
                focused={focused}
              />
            </div>

            <CardFormFields
              register={register}
              errors={errors}
              watchIsDefault={watchValues.is_default || false}
              onFocusChange={onFocusChange}
              onIsDefaultChange={onIsDefaultChange}
            />

            <div className="pt-2">
              <Button
                type="button"
                onClick={onSubmit}
                disabled={loading}
                className="w-full bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90 transition-all"
              >
                {loading
                  ? isEditing
                    ? "Updating..."
                    : "Saving..."
                  : isEditing
                  ? "Update Card"
                  : "Save Card"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
