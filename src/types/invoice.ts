// types/invoice.ts

import { Branding } from './branding';
import { Customer } from './customer';

// Represents a single line item within an invoice
export interface InvoiceItem {
  id?: string;
  lineNo: number;
  description: string;
  quantity: string;      
  unitPrice: string;   
  amount: string;
  department: string;
  taxCode: string;
}

export interface UserInvoceItem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  name: string;
  lastName: string;
  email: string;
}

// Represents the state of the invoice itself
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'void';

export interface CreateInvoiceDto {
  customerId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  subtotal: string;
  taxTotal: string;
  discountTotal: string;
  total: string;
  memo: string;
  account_id: string | null;
  subaccount_id: string | null;
  items: InvoiceItem[];
}

export interface Invoice {
  id: string;
  customerId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  subtotal: string;
  taxTotal: string;
  discountTotal: string;
  total: string;
  memo: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  account_id: string | null;
  subaccount_id: string | null;
  items: InvoiceItem[];
  customer?: {
    id: string;
    name: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceSearchParams {
  q?: string;
  query?: string; // Mantener por compatibilidad
  startDate?: string;
  endDate?: string;
  customerName?: string;
  invoiceNumber?: string;
  status?: string | string[];
  minTotal?: string;
  maxTotal?: string;
  sortBy?: 'invoiceDate' | 'dueDate' | 'total' | 'status' | 'customerName';
  sortDir?: 'ASC' | 'DESC';
}

export interface NewInvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax?: number;
}

// Represents the data captured from the "Create New Invoice" form
export interface NewInvoiceFormData {
  issueDate: Date;
  status?: 'draft';
  clientName?: string;
  clientEmail?: string;
  items: NewInvoiceItem[];
}

export interface DownloadPdfInterface {
  url: string;
  key: string;
}

export interface InvoicePdfResponse {
  url: string;
  filename: string;
}

// Represents the settings for invoice branding
