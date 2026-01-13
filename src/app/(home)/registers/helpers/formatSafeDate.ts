/* eslint-disable @typescript-eslint/no-explicit-any */
export  const formatSafeDate = (dateValue: any): string => {
  if (!dateValue) return 'N/A';

  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return new Intl.DateTimeFormat('en-US').format(date);
  } catch (error) {
    console.warn('Error formatting date:', dateValue, error);
    return 'Invalid Date';
  }
};