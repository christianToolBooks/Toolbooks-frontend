import {
  AgingTracking,
  BillPaymentFrequency,
  BillReceptionChannel,
  CreationTrackingMethod,
  CustomerListFormat,
  DeliveryMethod,
  EmployeeListFormat,
  InvoiceFrequency,
  SalaryType,
  YesNoNotSure,
  VendorListFormat,
} from "@/src/types/questionnaire";

/** ---------- Options tipadas ---------- */
export const LIST_FORMAT_OPTIONS_EMP: { value: EmployeeListFormat; label: string }[] = [
  { value: EmployeeListFormat.SPREADSHEET, label: "Spreadsheet" },
  { value: EmployeeListFormat.EXPORT, label: "Export from software" },
  { value: EmployeeListFormat.MANUAL, label: "Manual entry preferred" },
];

export const LIST_FORMAT_OPTIONS_CUST: { value: CustomerListFormat; label: string }[] = [
  { value: CustomerListFormat.SPREADSHEET, label: "Spreadsheet" },
  { value: CustomerListFormat.EXPORT, label: "Export from software" },
  { value: CustomerListFormat.MANUAL, label: "Manual entry preferred" },
];

export const LIST_FORMAT_OPTIONS_VENDOR: { value: VendorListFormat; label: string }[] = [
  { value: VendorListFormat.SPREADSHEET, label: "Spreadsheet" },
  { value: VendorListFormat.EXPORT, label: "Export from software" },
  { value: VendorListFormat.MANUAL, label: "Manual entry preferred" },
];

export const SALARY_TYPE_OPTIONS: { value: SalaryType; label: string }[] = [
  { value: SalaryType.HOURLY, label: "Hourly" },
  { value: SalaryType.SALARIED, label: "Salaried" },
  { value: SalaryType.MIXED, label: "Mixed" },
];

export const YES_NO_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export const TAX_SUPPORT_OPTIONS: { value: YesNoNotSure; label: string }[] = [
  { value: YesNoNotSure.YES, label: "Yes" },
  { value: YesNoNotSure.NO, label: "No" },
  { value: YesNoNotSure.NOT_SURE, label: "Not sure" },
];

export const INVOICING_METHOD_OPTIONS: { value: CreationTrackingMethod; label: string }[] = [
  { value: CreationTrackingMethod.ACCOUNTING_SOFTWARE, label: "Accounting software" },
  { value: CreationTrackingMethod.INVOICING_TOOL, label: "Separate invoicing tool" },
  { value: CreationTrackingMethod.SPREADSHEET, label: "Spreadsheets or manual tracking" },
  { value: CreationTrackingMethod.OTHER, label: "Other" },
];

export const INVOICE_FREQUENCY_OPTIONS: { value: InvoiceFrequency; label: string }[] = [
  { value: InvoiceFrequency.WEEKLY, label: "Weekly" },
  { value: InvoiceFrequency.MONTHLY, label: "Monthly" },
  { value: InvoiceFrequency.PROJECT_BASED, label: "Project-based" },
  { value: InvoiceFrequency.DAILY, label: "Daily" },
];

export const DELIVERY_METHOD_OPTIONS: { value: DeliveryMethod; label: string }[] = [
  { value: DeliveryMethod.EMAIL, label: "Email" },
  { value: DeliveryMethod.PDF, label: "PDF" },
  { value: DeliveryMethod.PORTAL, label: "Portal" },
  { value: DeliveryMethod.OTHER, label: "Other" },
];

export const AGING_TRACKING_OPTIONS: { value: AgingTracking; label: string }[] = [
  { value: AgingTracking.MANUALLY, label: "Manually" },
  { value: AgingTracking.SOFTWARE, label: "Software" },
  { value: AgingTracking.NOT_CURRENTLY, label: "Not currently tracked" },
];

export const BILL_RECEPTION_OPTIONS: { value: BillReceptionChannel; label: string }[] = [
  { value: BillReceptionChannel.EMAIL, label: "Email" },
  { value: BillReceptionChannel.SCANNED, label: "Scanned" },
  { value: BillReceptionChannel.PAPER_MAIL, label: "Paper mail" },
  { value: BillReceptionChannel.VENDOR_PORTALS, label: "Vendor portals" },
];

export const BILL_PAY_FREQ_OPTIONS: { value: BillPaymentFrequency; label: string }[] = [
  { value: BillPaymentFrequency.WEEKLY, label: "Weekly" },
  { value: BillPaymentFrequency.BIWEEKLY, label: "Biweekly" },
  { value: BillPaymentFrequency.MONTHLY, label: "Monthly" },
  { value: BillPaymentFrequency.AD_HOC, label: "Ad hoc" },
];

/** ---------- Helpers Sí/No <-> boolean ---------- */
export const boolToYesNo = (v?: boolean) => (v ? "yes" : "no");
export const yesNoToBool = (v: string) => v === "yes";
