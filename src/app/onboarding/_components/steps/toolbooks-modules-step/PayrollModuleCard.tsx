"use client";

import { CardHeader, CardTitle } from "@/src/components/ui/card";
import { FormRadioGroup } from "../../form-radio-group";
import { FormSelect } from "../../form-select";
import { FormTextarea } from "../../form-textarea";

import {
  EmployeeListFormat,
  NumEmployeesBand,
  PayFrequency,
  SalaryType,
  YesNoNotSure,
  PayrollSettings,
} from "@/src/types/questionnaire";

import {
  LIST_FORMAT_OPTIONS_EMP,
  SALARY_TYPE_OPTIONS,
  YES_NO_OPTIONS,
  TAX_SUPPORT_OPTIONS,
  boolToYesNo,
  yesNoToBool,
} from "./constants";
import { EMPLOYEE_COUNTS, PAY_FREQUENCIES } from "../../../_utils/onboarding-config";

type Props = {
  payrollModule: PayrollSettings;
  onPayrollModuleChange: (data: Partial<PayrollSettings>) => void;
  getFieldError: (field: string) => string | undefined;
  isPayrollEnabled: boolean;
  disabled?: boolean;
};

export function PayrollModuleCard({
  payrollModule,
  onPayrollModuleChange,
  getFieldError,
  isPayrollEnabled,
  disabled = false,
}: Props) {
  if (!isPayrollEnabled) {
    return (
      <div className="space-y-6 p-6">
        <CardHeader className="px-0">
          <CardTitle className="text-xl font-semibold text-muted-foreground">
            A. Payroll Module (Not Selected)
          </CardTitle>
        </CardHeader>
        <p className="text-sm text-muted-foreground">
          Payroll module is not enabled. Enable it in the Business Information step to configure payroll settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <CardHeader className="px-0">
        <CardTitle className="text-xl font-semibold text-foreground">
          A. Payroll Module
        </CardTitle>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormRadioGroup
          label="Employee list format available:"
          name="payrrollSettings.employee_list_format"
          value={payrollModule.employee_list_format ?? ""}
          onChange={(value) =>
            onPayrollModuleChange({ employee_list_format: value as EmployeeListFormat })
          }
          options={LIST_FORMAT_OPTIONS_EMP}
          disabled={disabled}
          autoFilled={!!payrollModule.employee_list_format}
          error={getFieldError("payrrollSettings.employee_list_format")}
          required
        />

        <FormSelect
          label="Number of employees:"
          name="payrrollSettings.num_employees_band"
          value={payrollModule.num_employees_band ?? ""}
          onChange={(value) =>
            onPayrollModuleChange({ num_employees_band: value as NumEmployeesBand })
          }
          options={EMPLOYEE_COUNTS}
          error={getFieldError("payrrollSettings.num_employees_band")}
          disabled={disabled}
          autoFilled={!!payrollModule.num_employees_band}
          required
        />

        <FormRadioGroup
          label="Pay frequency:"
          name="payrrollSettings.pay_frequency"
          value={payrollModule.pay_frequency ?? ""}
          onChange={(value) =>
            onPayrollModuleChange({ pay_frequency: value as PayFrequency })
          }
          options={PAY_FREQUENCIES}
          disabled={disabled}
          autoFilled={!!payrollModule.pay_frequency}
          error={getFieldError("payrrollSettings.pay_frequency")}
          required
        />

        <FormRadioGroup
          label="Do you track hours worked or use fixed salaries?"
          name="payrrollSettings.salary_type"
          value={payrollModule.salary_type ?? ""}
          onChange={(value) => onPayrollModuleChange({ salary_type: value as SalaryType })}
          options={SALARY_TYPE_OPTIONS}
          disabled={disabled}
          autoFilled={!!payrollModule.salary_type}
          error={getFieldError("payrrollSettings.salary_type")}
          required
        />
      </div>

      <div className="space-y-4">
        <FormRadioGroup
          label="Do you offer benefits, reimbursements, or deductions?"
          name="payrrollSettings.benefits_or_deductions"
          value={boolToYesNo(payrollModule.benefits_or_deductions) ?? ""}
          onChange={(value) =>
            onPayrollModuleChange({ benefits_or_deductions: yesNoToBool(value) })
          }
          options={YES_NO_OPTIONS}
          orientation="horizontal"
          disabled={disabled}
          autoFilled={payrollModule.benefits_or_deductions !== undefined}
          error={getFieldError("payrrollSettings.benefits_or_deductions")}
        />

        {payrollModule.benefits_or_deductions && (
          <FormTextarea
            label="If yes, please specify"
            name="payrrollSettings.benefits_specify"
            value={payrollModule.benefits_specify ?? ""}
            onChange={(value) => onPayrollModuleChange({ benefits_specify: value })}
            placeholder="Specify benefits, reimbursements, or deductions..."
            rows={2}
            disabled={disabled}
            autofilled={!!payrollModule.benefits_specify}
            error={getFieldError("payrrollSettings.benefits_specify")}
          />
        )}
      </div>

      <FormRadioGroup
        label="Do you require tax filings or compliance support?"
        name="payrrollSettings.tax_compliance_support"
        value={payrollModule.tax_compliance_support ?? YesNoNotSure.NOT_SURE}
        onChange={(value) =>
          onPayrollModuleChange({ tax_compliance_support: value as YesNoNotSure })
        }
        options={TAX_SUPPORT_OPTIONS}
        orientation="horizontal"
        disabled={disabled}
        autoFilled={!!payrollModule.tax_compliance_support}
        error={getFieldError("payrrollSettings.tax_compliance_support")}
        required
      />
    </div>
  );
}