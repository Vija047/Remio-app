/**
 * Formats a Date object or date string into a local 'YYYY-MM-DD' string based on the device's local timezone.
 * Avoids UTC timezone shift errors when calculating 'due today' or 'overdue' statuses.
 */
export function toLocalDateString(input?: string | Date | null): string {
  const d = !input ? new Date() : typeof input === 'string' ? new Date(input) : input;
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
