"use client";

import { CardHeader, CardTitle } from "@/src/components/ui/card";

import {
  BookkeepingBenefit,
  BookkeepingFrequency,
  BookkeepingService,
  BookkeepingSoftware,
  BookkeepingStatus,
  BookkeepingUtilization,
  InhouseHandler,
  OnboardingBookkeepingSettings,
  ReconcileFrequency,
  ReportsReviewed,
  ImprovementsWanted,
} from "@/src/types/questionnaire";

import {
  BOOKKEEPING_STATUS_OPTIONS,
  BOOKKEEPING_SERVICES_OPTIONS,
  IN_HOUSE_HANDLER_OPTIONS,
  BOOKKEEPING_FREQUENCIES,
  BOOKKEEPING_TOOLS_CHECKS,
  BOOKKEEPING_SOFTWARE,
  RECONCILE_FREQUENCY_OPTIONS,
  UTILIZATION_OPTIONS,
  BENEFITS_OPTIONS,
  FINANCIAL_REPORTS_OPTIONS,
  IMPROVEMENT_OPTIONS,
  type ToolKey,
} from "./constants";
import { FormSelect } from "../../form-select";
import { FormCheckboxGroup } from "../../form-checkbox-group";
import { FormRadioGroup } from "../../form-radio-group";
import { FormInput } from "../../form-input";
import { FormTextarea } from "../../form-textarea";

type Props = {
  bookkeepingSettings: OnboardingBookkeepingSettings;
  onBookkeepingSettingsChange: (
    data: Partial<OnboardingBookkeepingSettings>
  ) => void;
  getFieldError: (field: string) => string | undefined;
};

export function BookkeepingServicesCard({
  bookkeepingSettings,
  onBookkeepingSettingsChange,
  getFieldError,
}: Props) {
  // Map checkboxes → boolean flags
  const selectedTools: ToolKey[] = [
    bookkeepingSettings.tools_software ? "software" : null,
    bookkeepingSettings.tools_spreadsheets ? "spreadsheets" : null,
    bookkeepingSettings.tools_other ? "other" : null,
    bookkeepingSettings.tools_none ? "none" : null,
  ].filter(Boolean) as ToolKey[];

  const handleToolsChange = (values: string[]) => {
    const v = new Set(values as ToolKey[]);
    onBookkeepingSettingsChange({
      tools_software: v.has("software"),
      tools_spreadsheets: v.has("spreadsheets"),
      tools_other: v.has("other"),
      tools_none: v.has("none"),
    });
  };

  return (
    <div className="space-y-6 p-6">
      <CardHeader className="px-0">
        <CardTitle className="text-xl font-semibold text-foreground">
          Bookkeeping Services
        </CardTitle>
      </CardHeader>

      <FormSelect
        label="Status of Bookkeeping"
        name="bookkeepingSettings.status"
        value={bookkeepingSettings.status ?? ""}
        onChange={(value) =>
          onBookkeepingSettingsChange({
            status: value as BookkeepingStatus,
          })
        }
        options={BOOKKEEPING_STATUS_OPTIONS}
        placeholder="Select status"
        error={getFieldError("bookkeepingSettings.status")}
        autoFilled={!!bookkeepingSettings.status}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          label="Currently your bookkeeping services are:"
          name="bookkeepingSettings.service"
          value={bookkeepingSettings.service ?? ""}
          onChange={(value) =>
            onBookkeepingSettingsChange({
              service: value as BookkeepingService,
            })
          }
          options={BOOKKEEPING_SERVICES_OPTIONS}
          placeholder="Select option"
          error={getFieldError("bookkeepingSettings.service")}
          autoFilled={!!bookkeepingSettings.service}
        />

        <FormCheckboxGroup
          label="Who handles the bookkeeping in house?"
          name="bookkeepingSettings.inhouse_handlers"
          value={bookkeepingSettings.inhouse_handlers ?? []}
          onChange={(value) =>
            onBookkeepingSettingsChange({
              inhouse_handlers: value as InhouseHandler[],
            })
          }
          options={IN_HOUSE_HANDLER_OPTIONS}
          columns={1}
          autoFilled={!!bookkeepingSettings.inhouse_handlers}
        />
      </div>

      <FormRadioGroup
        label="How frequently is your bookkeeping updated?"
        name="bookkeepingSettings.frequency"
        value={bookkeepingSettings.frequency ?? ""}
        onChange={(value) =>
          onBookkeepingSettingsChange({
            frequency: value as BookkeepingFrequency,
          })
        }
        options={BOOKKEEPING_FREQUENCIES}
        orientation="horizontal"
        autoFilled={!!bookkeepingSettings.frequency}
      />

      <div className="space-y-4">
        <FormCheckboxGroup
          label="Do you use any of the following bookkeeping tools?"
          name="bookkeepingSettings.bookkeeping_tools"
          value={selectedTools ??  []}
          onChange={handleToolsChange}
          options={
            BOOKKEEPING_TOOLS_CHECKS as unknown as {
              value: string;
              label: string;
            }[]
          }
          autoFilled={!!selectedTools}
        />

        {bookkeepingSettings.tools_software && (
          <FormSelect
            label="Software Used"
            name="bookkeepingSettings.tools_software_used"
            value={bookkeepingSettings.tools_software_used ?? ""}
            onChange={(value) =>
              onBookkeepingSettingsChange({
                tools_software_used: value as BookkeepingSoftware,
              })
            }
            options={BOOKKEEPING_SOFTWARE}
            placeholder="Select software"
            error={getFieldError(
              "bookkeepingSettings.tools_software_used"
            )}
            autoFilled={!!bookkeepingSettings.tools_software_used}
          />
        )}

        {bookkeepingSettings.tools_other && (
          <FormInput
            label="If 'Other', please specify"
            name="bookkeepingSettings.tools_other_text"
            value={bookkeepingSettings.tools_other_text ?? ""}
            onChange={(value) =>
              onBookkeepingSettingsChange({ tools_other_text: value })
            }
            placeholder="Describe other tool(s)"
            autofilled={!!bookkeepingSettings.tools_other_text}
          />
        )}
      </div>

      <FormSelect
        label="Do you reconcile your bank and credit card accounts regularly?"
        name="bookkeepingSettings.reconcile_frequency"
        value={bookkeepingSettings.reconcile_frequency ?? ""}
        onChange={(value) =>
          onBookkeepingSettingsChange({
            reconcile_frequency: value as ReconcileFrequency,
          })
        }
        options={RECONCILE_FREQUENCY_OPTIONS}
        placeholder="Select frequency"
        autoFilled={!!bookkeepingSettings.reconcile_frequency}
      />

      <FormTextarea
        label="What challenges do you face with your current bookkeeping system?"
        name="bookkeepingSettings.challenges_current_setup"
        value={bookkeepingSettings.challenges_current_setup ?? ""}
        onChange={(value) =>
          onBookkeepingSettingsChange({
            challenges_current_setup: value,
          })
        }
        placeholder="Describe any challenges..."
        rows={3}
        autofilled={!!bookkeepingSettings.challenges_current_setup}
      />

      <FormCheckboxGroup
        label="How do you utilize your bookkeeping system?"
        name="bookkeepingSettings.utilization"
        value={bookkeepingSettings.utilization ?? []}
        onChange={(value) =>
          onBookkeepingSettingsChange({
            utilization: value as BookkeepingUtilization[],
          })
        }
        options={UTILIZATION_OPTIONS}
        autoFilled={!!bookkeepingSettings.utilization}
        required={true}
        error={getFieldError("bookkeepingSettings.utilization")}
      />

      <FormCheckboxGroup
        label="How do you benefit from your bookkeeping system?"
        name="bookkeepingSettings.benefits"
        value={bookkeepingSettings.benefits ?? []}
        onChange={(value) =>
          onBookkeepingSettingsChange({
            benefits: value as BookkeepingBenefit[],
          })
        }
        options={BENEFITS_OPTIONS}
        autoFilled={!!bookkeepingSettings.benefits}
        required={true}
        error={getFieldError("bookkeepingSettings.benefits")}
      />

      <div className="space-y-4">
        <FormCheckboxGroup
          label="What financial reports do you currently review?"
          name="bookkeepingSettings.reports_reviewed"
          value={bookkeepingSettings.reports_reviewed ?? []}
          onChange={(value) =>
            onBookkeepingSettingsChange({
              reports_reviewed: value as ReportsReviewed[],
            })
          }
          options={FINANCIAL_REPORTS_OPTIONS}
          autoFilled={!!bookkeepingSettings.reports_reviewed}
          required={true}
          error={getFieldError("bookkeepingSettings.reports_reviewed")}
        />

        {(bookkeepingSettings.reports_reviewed ?? []).includes(
          ReportsReviewed.OTHER
        ) && (
          <FormTextarea
            label="Other Reports"
            name="bookkeepingSettings.report_other_text"
            value={bookkeepingSettings.report_other_text ?? ""}
            onChange={(value) =>
              onBookkeepingSettingsChange({ report_other_text: value })
            }
            placeholder="Specify other reports..."
            rows={2}
            autofilled={!!bookkeepingSettings.report_other_text}
          />
        )}
      </div>

      <FormCheckboxGroup
        label="What would you like your bookkeeping system to do better?"
        name="bookkeepingSettings.improvements_wanted"
        value={bookkeepingSettings.improvements_wanted ?? []}
        onChange={(value) =>
          onBookkeepingSettingsChange({
            improvements_wanted: value as ImprovementsWanted[],
          })
        }
        options={IMPROVEMENT_OPTIONS}
        autoFilled={!!bookkeepingSettings.improvements_wanted}
        required={true}
        error={getFieldError("bookkeepingSettings.improvements_wanted")}
      />
    </div>
  );
}
