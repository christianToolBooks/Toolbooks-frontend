"use client";

import { CardHeader, CardTitle } from "@/src/components/ui/card";
import { FormCheckboxGroup } from "../../form-checkbox-group";
import { FormInput } from "../../form-input";
import { FormSelect } from "../../form-select";
import {
  BusinessTaxForm,
  OnboardingTaxReturnPreparation,
} from "@/src/types/questionnaire";

import { BUSINESS_TAX_FORMS, US_STATES } from "./constants";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { AlertCircle } from "lucide-react";

type Props = {
  taxReturnPreparation: OnboardingTaxReturnPreparation;
  onTaxReturnPreparationChange: (
    data: Partial<OnboardingTaxReturnPreparation>
  ) => void;
  getFieldError: (field: string) => string | undefined;
  disabled?: boolean;
};

export function TaxReturnPreparationCard({
  taxReturnPreparation,
  onTaxReturnPreparationChange,
  getFieldError,
  disabled = false,
}: Props) {
  const years = Array.from(
    { length: 11 },
    (_, i) => String(new Date().getFullYear() - i)
  );

  const handleNumberChange = (
    value: string,
    section: "business" | "individual",
    field: "biz_num_states_filed" | "ind_num_states_filed"
  ) => {
    if (value === "") {
      onTaxReturnPreparationChange({
        [section]: {
          ...taxReturnPreparation[section],
          [field]: undefined,
        },
      });
      return;
    }

    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      onTaxReturnPreparationChange({
        [section]: {
          ...taxReturnPreparation[section],
          [field]: num,
        },
      });
    }
  };

  const businessErrors = [
    getFieldError("taxReturnPreparation.business.biz_last_filed_year"),
    getFieldError("taxReturnPreparation.business.business_form_filed"),
    getFieldError("taxReturnPreparation.business.biz_num_states_filed"),
  ].filter(Boolean);

  const individualErrors = [
    getFieldError("taxReturnPreparation.individual.ind_last_filed_year"),
    getFieldError("taxReturnPreparation.individual.ind_num_states_filed"),
  ].filter(Boolean);

  const hasEmptyRequiredFields =
    !taxReturnPreparation.business?.biz_last_filed_year ||
    !taxReturnPreparation.business?.business_form_filed ||
    !taxReturnPreparation.individual?.ind_last_filed_year;

  return (
    <div className="space-y-6 p-6">
      <CardHeader className="px-0">
        <CardTitle className="text-xl font-semibold text-foreground">
          Tax Return Preparation
        </CardTitle>
      </CardHeader>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-md font-medium text-muted-foreground">
            Business Tax Return Preparation
          </h5>
          {businessErrors.length > 0 && (
            <span className="text-xs text-destructive font-medium">
              {businessErrors.length} error
              {businessErrors.length > 1 ? "s" : ""} found
            </span>
          )}
        </div>

        {businessErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {businessErrors.map((error, idx) => (
                  <li key={idx} className="text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSelect
            label="Business Tax Return Last Filed"
            name="taxReturnPreparation.business.biz_last_filed_year"
            value={String(
              taxReturnPreparation.business?.biz_last_filed_year ?? ""
            )}
            onChange={(value) =>
              onTaxReturnPreparationChange({
                business: {
                  ...taxReturnPreparation.business,
                  biz_last_filed_year: value ? Number(value) : undefined,
                },
              })
            }
            options={years.map((y) => ({ value: y, label: y }))}
            placeholder="Select year (1900-2100)"
            autoFilled={!!taxReturnPreparation.business?.biz_last_filed_year}
            disabled={disabled}
            required
            error={getFieldError("taxReturnPreparation.business.biz_last_filed_year")}
          />

          <FormInput
            label="Number of State Tax Returns Filed"
            name="taxReturnPreparation.business.biz_num_states_filed"
            type="number"
            value={String(
              taxReturnPreparation.business?.biz_num_states_filed ?? ""
            )}
            onChange={(value) =>
              handleNumberChange(value, "business", "biz_num_states_filed")
            }
            placeholder="Enter 0-60"
            autofilled={!!taxReturnPreparation.business?.biz_num_states_filed}
            disabled={disabled}
            error={getFieldError("taxReturnPreparation.business.biz_num_states_filed")}
            min={0}
            max={60}
            description="Enter a number between 0 and 60"
            required
          />

          <FormSelect
            label="Tax Form Filed"
            name="taxReturnPreparation.business.business_form_filed"
            value={taxReturnPreparation.business?.business_form_filed ?? ""}
            onChange={(value) =>
              onTaxReturnPreparationChange({
                business: {
                  ...taxReturnPreparation.business,
                  business_form_filed: value as BusinessTaxForm,
                },
              })
            }
            options={BUSINESS_TAX_FORMS}
            placeholder="Select form type"
            autoFilled={!!taxReturnPreparation.business?.business_form_filed}
            disabled={disabled}
            required
            error={getFieldError("taxReturnPreparation.business.business_form_filed")}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">
            Business tax returns required for the following states
            <span className="text-xs text-muted-foreground ml-2">(Optional)</span>
          </p>
          <div className="grid grid-cols-4 gap-2 mt-2 max-h-40 overflow-y-auto border rounded-md p-3">
            <FormCheckboxGroup
              label=""
              name="taxReturnPreparation.business.biz_tax_states"
              value={taxReturnPreparation.business?.biz_tax_states ?? []}
              onChange={(value) =>
                onTaxReturnPreparationChange({
                  business: {
                    ...taxReturnPreparation.business,
                    biz_tax_states: value as string[],
                  },
                })
              }
              options={US_STATES.map((s) => ({ value: s, label: s }))}
              columns={3}
              autoFilled={!!taxReturnPreparation.business?.biz_tax_states?.length}
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-medium text-muted-foreground">
            Individual Tax Return Preparation
          </h5>
          {individualErrors.length > 0 && (
            <span className="text-xs text-destructive font-medium">
              {individualErrors.length} error
              {individualErrors.length > 1 ? "s" : ""} found
            </span>
          )}
        </div>

        {individualErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {individualErrors.map((error, idx) => (
                  <li key={idx} className="text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSelect
            label="Individual Tax Return Last Filed"
            name="taxReturnPreparation.individual.ind_last_filed_year"
            value={String(
              taxReturnPreparation.individual?.ind_last_filed_year ?? ""
            )}
            onChange={(value) =>
              onTaxReturnPreparationChange({
                individual: {
                  ...taxReturnPreparation.individual,
                  ind_last_filed_year: value ? Number(value) : undefined,
                },
              })
            }
            options={years.map((y) => ({ value: y, label: y }))}
            placeholder="Select year (1900-2100)"
            autoFilled={!!taxReturnPreparation.individual?.ind_last_filed_year}
            disabled={disabled}
            required
            error={getFieldError("taxReturnPreparation.individual.ind_last_filed_year")}
          />

          <FormInput
            label="Number of State Tax Returns Filed"
            name="taxReturnPreparation.individual.ind_num_states_filed"
            type="number"
            value={String(
              taxReturnPreparation.individual?.ind_num_states_filed ?? ""
            )}
            onChange={(value) =>
              handleNumberChange(value, "individual", "ind_num_states_filed")
            }
            placeholder="Enter 0-60"
            autofilled={!!taxReturnPreparation.individual?.ind_num_states_filed}
            disabled={disabled}
            error={getFieldError("taxReturnPreparation.individual.ind_num_states_filed")}
            min={0}
            max={60}
            description="Enter a number between 0 and 60"
            required
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">
            Individual tax returns required for the following states
            <span className="text-xs text-muted-foreground ml-2">(Optional)</span>
          </p>
          <div className="grid grid-cols-4 gap-2 mt-2 max-h-40 overflow-y-auto border rounded-md p-3">
            <FormCheckboxGroup
              label=""
              name="taxReturnPreparation.individual.ind_tax_states"
              value={taxReturnPreparation.individual?.ind_tax_states ?? []}
              onChange={(value) =>
                onTaxReturnPreparationChange({
                  individual: {
                    ...taxReturnPreparation.individual,
                    ind_tax_states: value as string[],
                  },
                })
              }
              options={US_STATES.map((s) => ({ value: s, label: s }))}
              columns={3}
              autoFilled={!!taxReturnPreparation.individual?.ind_tax_states?.length}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
