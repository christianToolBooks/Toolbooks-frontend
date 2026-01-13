"use client";

import { useEffect, useMemo, useState } from "react";
import { CombinedAccount } from "@/src/types/chart-of-accounts";
import {
  ApBillCreatePayload,
  BillData,
  BillDataResponseFromAPI,
  BillLine,
} from "@/src/types/billPayTypes";
import { r2, to2, to4, toNum2 } from "../helpers/funtions";
import { createBill, scanBill } from "@/src/lib/services/billServices";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/src/api/apiResponse";
import { ErrorResponse } from "@/src/api/errorResponse";
import { z } from "zod";

const formatQuantity = (value: string): string => {
  const cleanValue = value.replace(/[^\d.]/g, "");
  if (!cleanValue) return "";
  const num = parseFloat(cleanValue);
  if (isNaN(num)) return "";
  if (num % 1 === 0) {
    return num.toString();
  }
  const formatted = num.toFixed(4);
  return formatted.replace(/\.?0+$/, "");
};

const formatPrice = (value: string): string => {
  const cleanValue = value.replace(/[^\d.]/g, "");
  if (!cleanValue) return "";
  const num = parseFloat(cleanValue);
  if (isNaN(num)) return "";
  
  return num.toFixed(2);
};

const handleNumericInput = (value: string): string => {
  return value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, '$1');
};

// Schema de validación
const BillValidationSchema = z.object({
  vendorId: z.string().min(1, "Please select a vendor"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z.string().min(1, "Invoice date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  currency: z.string().min(1, "Currency is required"),
  subtotal: z.string(),
  taxTotal: z.string(),
  discountTotal: z.string(),
  total: z.string(),
  memo: z.string().optional(),
  account_id: z.string().nullable(),
  subaccount_id: z.string().nullable(),
  lines: z.array(z.object({
    // lineNo removed from validation - it's auto-generated
    description: z.string().optional(),
    quantity: z.string().refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Quantity must be greater than 0"),
    unitPrice: z.string().refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    }, "Unit price must be a valid number"),
    amount: z.string(),
    department: z.string().optional().nullable(),
    taxCode: z.string().optional().nullable(),
  })).min(1, "At least one line item is required"),
  confidence: z.number().optional(),
  warnings: z.array(z.string()).optional(),
  discrepancies: z.array(z.string()).optional(),
}).refine(
  (data) => data.account_id !== null || data.subaccount_id !== null,
  {
    message: "Please select a chart of accounts",
    path: ["account_id"],
  }
).refine(
  (data) => {
    if (!data.invoiceDate || !data.dueDate) return true;
    const invoiceDate = new Date(data.invoiceDate);
    const dueDate = new Date(data.dueDate);
    return dueDate >= invoiceDate;
  },
  {
    message: "Due date must be on or after invoice date",
    path: ["dueDate"],
  }
);

export function useBillForm() {
  const [isScanning, setIsScanning] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const router = useRouter();
  const [formData, setFormData] = useState<BillData>({
    vendorId: "",
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    currency: "USD",
    subtotal: "0.00",
    taxTotal: "0.00",
    discountTotal: "0.00",
    total: "0.00",
    memo: "",
    account_id: null,
    subaccount_id: null,
    lines: [],
  });

  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectorAccountNumber, setSelectorAccountNumber] = useState("");
  const [selectorAccountName, setSelectorAccountName] = useState("");

  const handleSelectAccount = (account: CombinedAccount) => {
    if (account.type === "subAccount") {
      setFormData((p) => ({
        ...p,
        subaccount_id: account.id,
        account_id: null,
      }));
    } else {
      setFormData((p) => ({
        ...p,
        account_id: account.id,
        subaccount_id: null,
      }));
    }
    setSelectorAccountNumber(account.account_code);
    setSelectorAccountName(account.account_name);
  };

  const computedLineAmounts = useMemo(
    () =>
      (formData.lines || []).map(
        (li) => toNum2(li.quantity) * toNum2(li.unitPrice)
      ),
    [formData.lines]
  );

  const subtotalComputed = useMemo(
    () => (computedLineAmounts || []).reduce((s, v) => s + v, 0),
    [computedLineAmounts]
  );

  const totalComputed = useMemo(() => {
    const tax = toNum2(formData.taxTotal);
    const disc = toNum2(formData.discountTotal);
    return r2(subtotalComputed + tax - disc);
  }, [subtotalComputed, formData.taxTotal, formData.discountTotal]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      subtotal: to2(subtotalComputed),
      total: to2(totalComputed),
    }));
  }, [subtotalComputed, totalComputed]);

  const handleFileUpload = async (file: File) => {
    setIsScanning(true);
    setSubmitError(null);

    try {
      setAttachment(file);
      const response = await scanBill(file);

      if ("data" in response) {
        const scannedData = response.data as BillDataResponseFromAPI;
        
        const mappedData: BillData = {
          vendorId: scannedData.vendorId || "",
          invoiceNumber: scannedData.invoiceNumber || "",
          invoiceDate: scannedData.invoice_date,
          dueDate: scannedData.dueDate || "",
          currency: scannedData.currency || "USD",
          subtotal: scannedData.subtotal || "0.00",
          taxTotal: scannedData.tax_total || "0.00",
          discountTotal: scannedData.discount_total || "0.00",
          total: scannedData.total || "0.00",
          memo: scannedData.memo || "",
          account_id: null,
          subaccount_id: null,
          lines: (scannedData.line_items || []).map((item: BillLine) => ({
            lineNo: item.line_no,
            description: item.description || "",
            quantity: item.quantity || "0",
            unitPrice: item.unit_price || "0.00",
            amount: item.amount || "0.00",
            department: item.department || undefined,
            taxCode: item.tax_code || undefined,
          })),
          confidence: scannedData.confidence,
          warnings: scannedData.warnings || [],
          discrepancies: scannedData.discrepancies || [],
        };
        
        setFormData(mappedData);
        setShowForm(true);
        return;
      }
      
      const errorResponse = response as { message?: string };
      setSubmitError(errorResponse.message ?? "Unexpected response");
    } catch (error) {
      const err = error as Error;
      console.error("Error scanning bill:", error);
      setSubmitError(err?.message ?? "Error scanning bill");
      toast.error(err?.message ?? "Error scanning bill");
    } finally {
      setIsScanning(false);
    }
  };

  const handleManualEntry = () => setShowForm(true);

  const addLineItem = () => {
    setFormData((prev) => {
      const currentLines = prev.lines || [];
      const nextNo = currentLines.length + 1;
      return {
        ...prev,
        lines: [
          ...currentLines,
          {
            lineNo: nextNo,
            description: "",
            quantity: "1", 
            unitPrice: "0.00",
            amount: "0.00",
            department: undefined,
            taxCode: undefined,
          },
        ],
      };
    });
  };

  const removeLineItem = (index: number) => {
    setFormData((prev) => {
      const list = (prev.lines || []).filter((_, i) => i !== index);
      const reindexed = list.map((li, i) => ({
        ...li,
        lineNo: i + 1,
      }));
      return { ...prev, lines: reindexed };
    });
  };

  const updateLineItem = (
    index: number,
    field: keyof BillData["lines"][number],
    value: string
  ) => {
    setFormData((prev) => {
      const items = [...(prev.lines || [])];
      const current = { ...items[index] };

      if (field === "quantity") {
        const numericValue = handleNumericInput(value);
        current.quantity = numericValue;
        
        const qty = toNum2(numericValue);
        const price = toNum2(current.unitPrice);
        current.amount = to2(qty * price);
      } else if (field === "unitPrice") {
        const numericValue = handleNumericInput(value);
        current.unitPrice = numericValue;
        
        const qty = toNum2(current.quantity);
        const price = toNum2(numericValue);
        current.amount = to2(qty * price);
      } else if (field === "description") {
        current.description = value;
      } else if (field === "department") {
        current.department = value || undefined;
      } else if (field === "taxCode") {
        current.taxCode = value || undefined;
      }

      items[index] = current;
      return { ...prev, lines: items };
    });
  };

  const formatLineItemOnBlur = (
    index: number,
    field: "quantity" | "unitPrice"
  ) => {
    setFormData((prev) => {
      const items = [...(prev.lines || [])];
      const current = { ...items[index] };

      if (field === "quantity") {
        current.quantity = formatQuantity(current.quantity);
      } else if (field === "unitPrice") {
        current.unitPrice = formatPrice(current.unitPrice);
      }
      const qty = toNum2(current.quantity);
      const price = toNum2(current.unitPrice);
      current.amount = to2(qty * price);

      items[index] = current;
      return { ...prev, lines: items };
    });
  };

  const updateFormData = (updates: Partial<BillData>) =>
    setFormData((prev) => ({ ...prev, ...updates }));

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<ApiResponse<ApBillCreatePayload> | ErrorResponse | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateBillData = (data: BillData): { success: boolean; errors?: string[]; fieldErrors?: Record<string, string> } => {
    try {
      const normalizedData = {
        ...data,
        lines: (data.lines || []).map((line) => {
          const { lineNo, ...lineWithoutLineNo } = line;
          return {
            ...lineWithoutLineNo,
            description: line.description || "",
            quantity: line.quantity || "0",
            unitPrice: line.unitPrice || "0",
            amount: line.amount || "0",
          };
        })
      };

      BillValidationSchema.parse(normalizedData);
      return { success: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: string[] = [];
        const fieldErrors: Record<string, string> = {};

        error.errors.forEach((err) => {
          const fieldPath = err.path.join(".");
          fieldErrors[fieldPath] = err.message;
          errors.push(err.message);
        });

        const uniqueErrors = Array.from(new Set(errors));
        return { success: false, errors: uniqueErrors, fieldErrors };
      }
      return { success: false, errors: ["Validation failed"] };
    }
  };

  const getFieldError = (fieldPath: string): string | null => {
    return fieldErrors[fieldPath] || null;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    setSubmitResult(null);
    setFieldErrors({});

    try {
      const validation = validateBillData(formData);
      
      if (!validation.success) {
        const errorMessage = validation.errors?.join("\n") || "Please check all required fields";
        setSubmitError(errorMessage);
        setFieldErrors(validation.fieldErrors || {});
        
        setSubmitting(false);
        return;
      }

      // Limpiar el payload antes de enviar - remover metadata del escaneo
      const cleanPayload: ApBillCreatePayload = {
        vendorId: formData.vendorId,
        invoiceNumber: formData.invoiceNumber,
        invoiceDate: formData.invoiceDate,
        dueDate: formData.dueDate,
        currency: formData.currency,
        subtotal: formData.subtotal,
        taxTotal: formData.taxTotal,
        discountTotal: formData.discountTotal,
        total: formData.total,
        memo: formData.memo || undefined,
        account_id: formData.account_id || undefined,
        subaccount_id: formData.subaccount_id || undefined,
        lines: (formData.lines || []).map((line, index) => ({
          lineNo: typeof line.lineNo === 'number' ? line.lineNo : index + 1,
          description: line.description || undefined,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          amount: line.amount,
          department: line.department || undefined,
          taxCode: line.taxCode || undefined,
        })),
      };

      const response = await createBill(cleanPayload ?? undefined);
      setSubmitResult(response);
      
      if ("statusCode" in response) {
        setSubmitError(response.message || 'Failed to create bill');
        toast.error(response.message || 'Failed to create bill');
        return;
      }

      toast.success("Bill created successfully");
      router.push("/bill-pay/bills");
    } catch (e) {
      const error = e as Error;
      console.error("Bill submission error:", error);
      const errorMessage = error?.message ?? "Error creating bill";
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setAttachment(null);
    setFormData({
      vendorId: "",
      invoiceNumber: "",
      invoiceDate: "",
      dueDate: "",
      currency: "USD",
      subtotal: "0.00",
      taxTotal: "0.00",
      discountTotal: "0.00",
      total: "0.00",
      memo: "",
      account_id: null,
      subaccount_id: null,
      lines: [],
    });
    setSelectorAccountName("");
    setSelectorAccountNumber("");
    setSubmitError(null);
    setSubmitResult(null);
  };

  return {
    isScanning,
    showForm,
    formData,
    selector: {
      accountNumber: selectorAccountNumber,
      accountName: selectorAccountName,
      isOpen: selectorOpen,
    },
    setSelectorOpen,
    handleSelectAccount,
    submitting,
    submitError,
    submitResult,
    handleFileUpload,
    handleManualEntry,
    addLineItem,
    removeLineItem,
    updateLineItem,
    formatLineItemOnBlur,
    updateFormData,
    resetForm,
    handleSubmit,
    getFieldError,
    fieldErrors,
  };
}