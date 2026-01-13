/* eslint-disable @typescript-eslint/no-explicit-any */

export const isValidUSPhone = (phone: string): boolean => {
  if (!phone || phone.trim() === '') {
    return false;
  }

  if (phone.startsWith('+1')) {
    const cleanPhone = phone.substring(2).replace(/\D/g, '');
    return cleanPhone.length === 10;
  }

  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length === 10;
};

export function getChangedFields<T extends Record<string, any>>(
  original: T,
  updated: T
): Partial<T> {
  const changes: Partial<T> = {};

  for (const [key, value] of Object.entries(updated)) {
    if (
      value !== original[key] &&
      value !== null &&
      value !== undefined &&
      value !== ''
    ) {
      changes[key as keyof T] = value;
    }
  }

  return changes;
}