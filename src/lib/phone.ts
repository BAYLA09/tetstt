/**
 * Accepts any common UAE mobile format:
 *   0501234567  /  050 123 4567  /  050-123-4567
 *   971501234567  /  +971501234567  /  +971 50 123 4567
 *   00971501234567  /  971-50-123-4567
 * Returns E.164 (+971XXXXXXXXX) or null if invalid.
 */
export function normalizeUaePhone(input: string): string | null {
  if (!input) return null;

  // Strip every character that is not a digit or leading +
  const digits = input.replace(/\D/g, "");

  let local = "";

  if (/^00971/.test(digits)) {
    // 00971XXXXXXXXX
    local = digits.slice(5);
  } else if (/^971/.test(digits)) {
    // 971XXXXXXXXX  or  +971XXXXXXXXX (+ already stripped)
    local = digits.slice(3);
  } else if (/^0/.test(digits)) {
    // 0XXXXXXXXX
    local = digits.slice(1);
  } else {
    // bare local without leading 0: 5XXXXXXXX
    local = digits;
  }

  // UAE mobile local: 5X + 7 digits = 9 digits total, starts with 5
  if (/^5\d{8}$/.test(local)) {
    return `+971${local}`;
  }

  return null;
}

export function isValidUaePhone(input: string): boolean {
  return normalizeUaePhone(input) !== null;
}
