import { BillData, BillDataResponseFromAPI } from "@/src/types/billPayTypes";

export function getAgingColor(aging: BillDataResponseFromAPI["agingStage"]) {
  switch (aging) {
    case "current":
      return "bg-green-100 text-green-800";
    case "due_soon":
      return "bg-yellow-100 text-yellow-800";
    case "overdue":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getStatusColor(status: string | undefined): string {
  if (!status) return "bg-gray-500";

  switch (status.toLowerCase()) {
    case "draft":
      return "bg-gray-100 text-gray-600";
    case "approved":
      return "bg-green-100 text-green-800";
    case "pending_approval":
      return "bg-yellow-100 text-yellow-800";
    case "on_hold":
      return "bg-orange-100 text-orange-800";
    case "disputed":
      return "bg-red-100 text-red-800";
    case "voided":
      return "bg-gray-200 text-gray-700 line-through";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getPriorityColor(priority: string | undefined): string {
  if (!priority) return "bg-gray-500";

  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-green-500";
    default:
      return "bg-blue-500";
  }
}

export function parseDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date && !isNaN(value.valueOf())) return value;

  if (typeof value === "string") {
    // "YYYY-MM-DD"
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split("-").map(Number);
      return new Date(y, m - 1, d);
    }
    const d = new Date(value);
    return isNaN(d.valueOf()) ? null : d;
  }

  if (typeof value === "number") {
    const d = new Date(value);
    return isNaN(d.valueOf()) ? null : d;
  }

  return null;
}

export function getCreatedAt(bill: BillDataResponseFromAPI): Date | null {
  const candidate =
    (bill as BillDataResponseFromAPI).createdAt ?? (bill as BillDataResponseFromAPI).createdAt;

  return parseDate(candidate);
}

export function normalizeDate(date: Date | string) {
  if (typeof date === "string") {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}