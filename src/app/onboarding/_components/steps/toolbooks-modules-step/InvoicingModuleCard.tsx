"use client";

import { CardHeader, CardTitle } from "@/src/components/ui/card";
import { FormRadioGroup } from "../../form-radio-group";
import { FormTextarea } from "../../form-textarea";

import {
  InvoicingSettings,
  CreationTrackingMethod,
  CustomerListFormat,
  InvoiceFrequency,
  DeliveryMethod,
} from "@/src/types/questionnaire";

import {
  INVOICING_METHOD_OPTIONS,
  LIST_FORMAT_OPTIONS_CUST,
  INVOICE_FREQUENCY_OPTIONS,
  DELIVERY_METHOD_OPTIONS,
  YES_NO_OPTIONS,
  boolToYesNo,
  yesNoToBool,
} from "./constants";

type Props = {
  invoicingModule: InvoicingSettings;
  onInvoicingModuleChange: (data: Partial<InvoicingSettings>) => void;
  disabled?: boolean;
  isInvoicingEnabled?: boolean;
  getFieldError: (field: string) => string | undefined;
};

export function InvoicingModuleCard({
  invoicingModule,
  onInvoicingModuleChange,
  disabled = false,
  isInvoicingEnabled,
  getFieldError,
}: Props) {
  if (isInvoicingEnabled === true) {
    return (
      <div className="space-y-6 p-6">
        <CardHeader className="px-0">
          <CardTitle className="text-xl font-semibold text-foreground">
            B. Invoicing Module
          </CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormRadioGroup
            label="How are invoices currently created and tracked?"
            name="invoicingSettings.creation_tracking_method"
            value={invoicingModule.creation_tracking_method ?? ""}
            onChange={(value) =>
              onInvoicingModuleChange({
                creation_tracking_method: value as CreationTrackingMethod,
              })
            }
            options={INVOICING_METHOD_OPTIONS}
            disabled={disabled}
            autoFilled={!!invoicingModule.creation_tracking_method}
            error= {getFieldError("invoicingSettings.creation_tracking_method")}
          />

          <FormRadioGroup
            label="Customer list format available:"
            name="invoicingSettings.customer_list_format"
            value={invoicingModule.customer_list_format ?? ""}
            onChange={(value) =>
              onInvoicingModuleChange({
                customer_list_format: value as CustomerListFormat,
              })
            }
            options={LIST_FORMAT_OPTIONS_CUST}
            disabled={disabled}
            autoFilled={!!invoicingModule.customer_list_format}
            error= {getFieldError("invoicingSettings.customer_list_format")}
          />

          <FormRadioGroup
            label="Typical invoice frequency?"
            name="invoicingSettings.invoice_frequency"
            value={invoicingModule.invoice_frequency ?? ""}
            onChange={(value) =>
              onInvoicingModuleChange({
                invoice_frequency: value as InvoiceFrequency,
              })
            }
            options={INVOICE_FREQUENCY_OPTIONS}
            disabled={disabled}
            autoFilled={!!invoicingModule.invoice_frequency}
            error= {getFieldError("invoicingSettings.invoice_frequency")}
          />

          <FormRadioGroup
            label="Delivery method"
            name="invoicingSettings.delivery_method"
            value={invoicingModule.delivery_method ?? ""}
            onChange={(value) =>
              onInvoicingModuleChange({
                delivery_method: value as DeliveryMethod,
              })
            }
            options={DELIVERY_METHOD_OPTIONS}
            disabled={disabled}
            autoFilled={!!invoicingModule.delivery_method}
            error= {getFieldError("invoicingSettings.delivery_method")}
          />
        </div>

        <FormRadioGroup
          label="Have you applied invoice customizations?"
          name="invoicingSettings.customizations_applied"
          value={boolToYesNo(invoicingModule.customizations_applied)}
          onChange={(value) =>
            onInvoicingModuleChange({
              customizations_applied: yesNoToBool(value),
            })
          }
          options={YES_NO_OPTIONS}
          orientation="horizontal"
          disabled={disabled}
          autoFilled={invoicingModule.customizations_applied !== undefined}
        />

        {invoicingModule.customizations_applied && (
          <FormTextarea
            label="Customization details"
            name="invoicingSettings.customization_specify"
            value={invoicingModule.customization_specify ?? ""}
            onChange={(value) =>
              onInvoicingModuleChange({ customization_specify: value })
            }
            placeholder="Describe any invoice customizations..."
            rows={3}
            disabled={disabled}
            autofilled={!!invoicingModule.customization_specify}
          />
        )}
      </div>
    );
  }
}
