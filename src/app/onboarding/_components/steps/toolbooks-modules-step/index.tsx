"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { PayrollModuleCard } from "./PayrollModuleCard";
import { InvoicingModuleCard } from "./InvoicingModuleCard";
import { BillPayModuleCard } from "./BillPayModuleCard";

import type {
  PayrollSettings,
  InvoicingSettings,
  BillPaySettings,
} from "@/src/types/questionnaire";

type Props = {
  payrollModule: PayrollSettings;
  invoicingModule: InvoicingSettings;
  billPayModule: BillPaySettings;
  onPayrollModuleChange: (data: Partial<PayrollSettings>) => void;
  onInvoicingModuleChange: (data: Partial<InvoicingSettings>) => void;
  onBillPayModuleChange: (data: Partial<BillPaySettings>) => void;
  getFieldError: (field: string) => string | undefined;
  hasInvoicing: boolean;
  hasBillPay: boolean;
  hasPayroll: boolean;
  /** Deshabilita inputs mientras se hidrata (opcional) */
  disabled?: boolean;
};

export function ToolbooksModulesStep({
  payrollModule,
  invoicingModule,
  billPayModule,
  hasInvoicing,
  hasBillPay,
  hasPayroll,
  onPayrollModuleChange,
  onInvoicingModuleChange,
  onBillPayModuleChange,
  getFieldError,
  disabled = false,
}: Props) {
  
  return (
    <div className="space-y-8">
      {hasPayroll && (
        <Card>
          <CardContent className="p-0">
            <PayrollModuleCard
              isPayrollEnabled={hasPayroll}
              payrollModule={payrollModule}
              onPayrollModuleChange={onPayrollModuleChange}
              getFieldError={getFieldError}
              disabled={disabled}
            />
          </CardContent>
        </Card>
      )}
      {hasInvoicing && (
        <Card>
          <CardContent className="p-0">
            <InvoicingModuleCard
              invoicingModule={invoicingModule}
              isInvoicingEnabled={hasInvoicing}
              onInvoicingModuleChange={onInvoicingModuleChange}
              disabled={disabled}
              getFieldError={getFieldError}
            />
          </CardContent>
        </Card>
      )}
      {hasBillPay && (
        <Card>
          <CardContent className="p-0">
            <BillPayModuleCard
              billPayModule={billPayModule}
              isBillPayEnabled={hasBillPay}
              onBillPayModuleChange={onBillPayModuleChange}
              disabled={disabled}
              getFieldError={getFieldError}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ToolbooksModulesStep;
