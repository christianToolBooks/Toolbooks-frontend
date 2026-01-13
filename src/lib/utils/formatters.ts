import {
  FileManagerResponse,
  FormattedFileItem,
} from '@/src/types/fileManager';
import { isValidUSPhone } from './validates';
import { ExceptionType } from '@/src/types/bank-reconciliation';

// ============================================
// CURRENCY FORMATTING
// ============================================

/**
 * Formats a number as USD currency
 * @param amount - The amount to format
 * @param options - Optional formatting options
 */
export const formatCurrency = (
  amount: number | string ,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    currency?: string;
  }
): string => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return "$0.00";
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: options?.currency || 'USD',
    minimumFractionDigits: options?.minimumFractionDigits ?? 2,
    maximumFractionDigits: options?.maximumFractionDigits ?? 2,
  }).format(numAmount);
};

// ============================================
// DATE FORMATTING
// ============================================

/**
 * Formats a date string in a readable format
 * @param dateString - The date to format (string or Date object)
 * @param options - Optional formatting options
 */
export const formatDate = (
  dateString: string | Date | undefined | null,
  options?: {
    year?: 'numeric' | '2-digit';
    month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
    day?: 'numeric' | '2-digit';
  }
): string => {
  if (!dateString) return 'N/A';

  try {
    const dateStr =
      typeof dateString === "string"
        ? dateString.includes("T")
          ? dateString
          : dateString + "T00:00:00"
        : dateString;

    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    return date.toLocaleDateString('en-US', {
      year: options?.year || 'numeric',
      month: options?.month || 'short',
      day: options?.day || 'numeric',
    });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return "Invalid Date";
  }
};

// ============================================
// PHONE FORMATTING
// ============================================

/**
 * Formatted a phone number Adding +1 (US)
 * @param phone - phone number
 */
export const formatUSPhone = (phone: string): string => {
  if (!phone || phone.trim() === "") {
    throw new Error("Phone number is required")
  }

  if (phone.startsWith("+1")) {
    const cleanPhone = phone.substring(2).replace(/\D/g, "")

    if (cleanPhone.length !== 10 && cleanPhone.length !== 11) {
      throw new Error(`Invalid US phone number: must have 10 or 11 digits, got ${cleanPhone.length}`)
    }

    return phone
  }

  const cleanPhone = phone.replace(/\D/g, "")

  if (cleanPhone.length !== 10 && cleanPhone.length !== 11) {
    throw new Error(`Invalid US phone number: must have 10 or 11 digits, got ${cleanPhone.length} digits`)
  }

  return `+1${cleanPhone}`
}

/**
 * Safe version of formatUSPhone that returns null on error
 */
export const formatUSPhoneSafe = (phone: string): string | null => {
  try {
    return formatUSPhone(phone)
  } catch {
    return null
  }
}

/**
 * Formats a phone number for display with proper formatting
 */
export const formatPhoneDisplay = (phone: string): string => {
  if (!phone) return ""

  const cleanPhone = phone.substring(2).replace(/\D/g, "")

  if (cleanPhone.length === 10) {
    return `+1 (${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6, 10)}`
  } else if (cleanPhone.length === 11) {
    return `+1 ${cleanPhone.slice(0, 1)} (${cleanPhone.slice(1, 4)}) ${cleanPhone.slice(4, 7)}-${cleanPhone.slice(7, 11)}`
  }

  return phone
}

/**
 * Formats phone input as user types
 */
export const formatPhoneInput = (value: string): string => {
  const numbers = value.replace(/\D/g, "")
  if (numbers.length === 0) return ""
  if (numbers.length <= 3) return `(${numbers}`
  if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`
  return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
}

export const getPhoneInfo = (phone: string) => {
  const cleanPhone = phone.replace(/\D/g, '');

  return {
    original: phone,
    cleaned: cleanPhone,
    length: cleanPhone.length,
    isValid: isValidUSPhone(phone),
    formatted: formatUSPhoneSafe(phone),
    errors:
      cleanPhone.length < 10
        ? [`Too short: ${cleanPhone.length} digits (need 10-11)`]
        : cleanPhone.length > 11
          ? [`Too long: ${cleanPhone.length} digits (need 10-11)`]
          : [],
  };
};

// ============================================
// FILE FORMATTING
// ============================================

export const formatFileItem = (
  file: FileManagerResponse
): FormattedFileItem => {
  const { url, key } = file;

  const id = key.split('/')[0];
  const filesIndex = key.indexOf('/files/');
  const fileNamePart = key.substring(filesIndex + 7);
  const lastDotIndex = fileNamePart.lastIndexOf('.');
  const extension =
    lastDotIndex !== -1 ? fileNamePart.substring(lastDotIndex + 1) : '';
  const nameWithoutExtension =
    lastDotIndex !== -1
      ? fileNamePart.substring(0, lastDotIndex)
      : fileNamePart;
  const lastDashIndex = nameWithoutExtension.lastIndexOf('-');
  const name =
    lastDashIndex !== -1
      ? nameWithoutExtension.substring(0, lastDashIndex)
      : nameWithoutExtension;

  return {
    id,
    url,
    key,
    name,
    extension,
  };
};

export const formattedFileItems = (
  files: FileManagerResponse[]
): FormattedFileItem[] => {
  return files.map(formatFileItem);
};

// ============================================
// BUSINESS TYPE FORMATTING
// ============================================

export function formatBusinessType(type: string): string {
  switch (type) {
    case 's_corp':
      return 'S Corporation';
    case 'c_corp':
      return 'C Corporation';
    case 'self_employed':
      return 'Self-Employed';
    case 'partnership':
      return 'Partnership';
    default:
      return 'Unknown';
  }
}

// ============================================
// TEXT/KEY FORMATTING
// ============================================

export function humanizeKey (
  raw: string,
  style: 'plain' | 'hierarchy' = 'hierarchy'
): string {
  if (!raw) return '';

  const ACRONYMS = new Set(['ATM', 'ACH', 'APR', 'APY', 'IRS', 'IRA', 'HSA', 'PIN', 'USA']);
  const SMALL = new Set(['and', 'or', 'the', 'a', 'an', 'of', 'in', 'on', 'to', 'for', 'by', 'with', 'at', 'from']);

  const tokens = raw.split(/[_\s]+/).filter(Boolean);

  const words = tokens.map((tok, i) => {
    if (tok === 'AND') return '&';
    if (ACRONYMS.has(tok)) return tok; 

    const lower = tok.toLowerCase();
    if (SMALL.has(lower) && i !== 0) return lower;
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  });

  const label = words.join(' ').replace(/\s+&\s+/g, ' & ');
  if (style === 'hierarchy' && words.length > 1) {
    return `${words[0]} — ${words.slice(1).join(' ').replace(/\s+&\s+/g, ' & ')}`;
  }

  return label;
}

export function getExceptionLabel(type: ExceptionType): string {
  const labels: Record<ExceptionType, string> = {
    only_in_bank: "Bank Only",
    only_in_books: "Ledger Only",
    mismatch: "Mismatch",
  }

  return labels[type]
}

export function getExceptionBadgeVariant(type: ExceptionType): "secondary" | "outline" | "destructive" {
  const variants: Record<ExceptionType, "secondary" | "outline" | "destructive"> = {
    only_in_bank: "secondary",
    only_in_books: "outline",
    mismatch: "destructive",
  }

  return variants[type]
}