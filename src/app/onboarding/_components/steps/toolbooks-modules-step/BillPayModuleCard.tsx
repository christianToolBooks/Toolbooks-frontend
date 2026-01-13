"use client";

import { CardHeader, CardTitle } from "@/src/components/ui/card";
import { FormCheckboxGroup } from "../../form-checkbox-group";
import { FormRadioGroup } from "../../form-radio-group";
import { FormSelect } from "../../form-select";
import { FormTextarea } from "../../form-textarea";
import {
  BillPaySettings,
  VendorListFormat,
  AgingTracking,
  BillReceptionChannel,
  BillPaymentFrequency,
} from "@/src/types/questionnaire";

import {
  LIST_FORMAT_OPTIONS_VENDOR,
  AGING_TRACKING_OPTIONS,
  BILL_RECEPTION_OPTIONS,
  BILL_PAY_FREQ_OPTIONS,
  YES_NO_OPTIONS,
  boolToYesNo,
  yesNoToBool,
} from "./constants";

type Props = {
  billPayModule: BillPaySettings;
  onBillPayModuleChange: (data: Partial<BillPaySettings>) => void;
  disabled?: boolean;
  isBillPayEnabled?: boolean;
  getFieldError: (field: string) => string | undefined;
};

export function BillPayModuleCard({
  billPayModule,
  onBillPayModuleChange,
  disabled = false,
  isBillPayEnabled,
  getFieldError,
}: Props) {
  if (isBillPayEnabled === true) {
    return (
      <div className="space-y-6 p-6">
        <CardHeader className="px-0">
          <CardTitle className="text-xl font-semibold text-foreground">
            C. Bill Pay Module
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormRadioGroup
            label="Vendor list format available:"
            name="billPaySettings.vendor_list_format"
            value={billPayModule.vendor_list_format ?? ""}
            onChange={(value) =>
              onBillPayModuleChange({
                vendor_list_format: value as VendorListFormat,
              })
            }
            options={LIST_FORMAT_OPTIONS_VENDOR}
            disabled={disabled}
            autoFilled={!!billPayModule.vendor_list_format}
            error={getFieldError("billPaySettings.vendor_list_format")}
          />

          <FormRadioGroup
            label="Do you have an approval process for bill payments?"
            name="billPaySettings.approval_workflow"
            value={boolToYesNo(billPayModule.approval_workflow)}
            onChange={(value) =>
              onBillPayModuleChange({ approval_workflow: yesNoToBool(value) })
            }
            options={YES_NO_OPTIONS}
            disabled={disabled}
            autoFilled={billPayModule.approval_workflow !== undefined}
            error={getFieldError("billPaySettings.approval_workflow")}
          />

          {billPayModule.approval_workflow && (
            <FormTextarea
              label="Approval workflow details"
              name="billPaySettings.approval_specify"
              value={billPayModule.approval_specify ?? ""}
              onChange={(value) =>
                onBillPayModuleChange({ approval_specify: value })
              }
              placeholder="Describe the approval workflow..."
              rows={2}
              disabled={disabled}
              autofilled={!!billPayModule.approval_specify}
              error={getFieldError("billPaySettings.approval_specify")}
            />
          )}

          <FormRadioGroup
            label="Do you track aging or overdue bills manually or via software?"
            name="billPaySettings.aging_tracking"
            value={billPayModule.aging_tracking ?? ""}
            onChange={(value) =>
              onBillPayModuleChange({ aging_tracking: value as AgingTracking })
            }
            options={AGING_TRACKING_OPTIONS}
            disabled={disabled}
            autoFilled={!!billPayModule.aging_tracking}
            error={getFieldError("billPaySettings.aging_tracking")}
          />
        </div>

        <FormCheckboxGroup
          label="How do you receive bills?"
          name="billPaySettings.bill_reception_channels"
          value={billPayModule.bill_reception_channels ?? []}
          onChange={(value) =>
            onBillPayModuleChange({
              bill_reception_channels: value as BillReceptionChannel[],
            })
          }
          options={BILL_RECEPTION_OPTIONS}
          disabled={disabled}
          autoFilled={!!billPayModule.bill_reception_channels?.length}
          error={getFieldError("billPaySettings.bill_reception_channels")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormRadioGroup
            label="Scan & extract automatically (OCR)?"
            name="billPaySettings.scan_extract_auto"
            value={boolToYesNo(billPayModule.scan_extract_auto)}
            onChange={(value) =>
              onBillPayModuleChange({ scan_extract_auto: yesNoToBool(value) })
            }
            options={YES_NO_OPTIONS}
            orientation="horizontal"
            disabled={disabled}
            autoFilled={billPayModule.scan_extract_auto !== undefined}
            error={getFieldError("billPaySettings.scan_extract_auto")}
          />

          <FormSelect
            label="Bill payment frequency"
            name="billPaySettings.payment_frequency"
            value={billPayModule.payment_frequency ?? ""}
            onChange={(value) =>
              onBillPayModuleChange({
                payment_frequency: value as BillPaymentFrequency,
              })
            }
            options={BILL_PAY_FREQ_OPTIONS}
            disabled={disabled}
            required={true}
            autoFilled={!!billPayModule.payment_frequency}
            error={getFieldError("billPaySettings.payment_frequency")}
          />
        </div>
      </div>
    );
  }
}
