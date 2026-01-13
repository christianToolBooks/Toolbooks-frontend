export type CurrencyCode = "USD" | "EUR" | "COP" | "MXN"; // Example, expand as needed

export interface AuditInfo {
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
  createdBy?: string; // User ID or system
}
