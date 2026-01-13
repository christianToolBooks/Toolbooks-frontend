"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { BookkeepingServicesCard } from "./BookkeepingServicesCard";
import { TaxReturnPreparationCard } from "./TaxReturnPreparationCard";
import type {
  OnboardingBookkeepingSettings,
  OnboardingTaxReturnPreparation,
} from "@/src/types/questionnaire";

type Props = {
  bookkeepingSettings: OnboardingBookkeepingSettings;
  taxReturnPreparation: OnboardingTaxReturnPreparation;
  onBookkeepingSettingsChange: (data: Partial<OnboardingBookkeepingSettings>) => void;
  onTaxReturnPreparationChange: (data: Partial<OnboardingTaxReturnPreparation>) => void;
  getFieldError: (field: string) => string | undefined;
};

export function BookkeepingServicesStep({
  bookkeepingSettings,
  taxReturnPreparation,
  onBookkeepingSettingsChange,
  onTaxReturnPreparationChange,
  getFieldError,
}: Props) {
  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-0">
          <BookkeepingServicesCard
            bookkeepingSettings={bookkeepingSettings}
            onBookkeepingSettingsChange={onBookkeepingSettingsChange}
            getFieldError={getFieldError}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <TaxReturnPreparationCard
          getFieldError={getFieldError}
            taxReturnPreparation={taxReturnPreparation}
            onTaxReturnPreparationChange={onTaxReturnPreparationChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default BookkeepingServicesStep;
