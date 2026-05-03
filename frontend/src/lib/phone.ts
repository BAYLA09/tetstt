export function normalizeUaePhone(input: string): string | null {
  const trimmed = input.trim();
  const digits = trimmed.replace(/\D/g, "");

  let normalized = "";

  if (/^05\d{8}$/.test(digits)) {
    normalized = `+971${digits.slice(1)}`;
  } else if (/^5\d{8}$/.test(digits)) {
    normalized = `+971${digits}`;
  } else if (/^9715\d{8}$/.test(digits)) {
    normalized = `+${digits}`;
  } else if (/^009715\d{8}$/.test(digits)) {
    normalized = `+${digits.slice(2)}`;
  }

  if (!/^\+9715\d{8}$/.test(normalized)) {
    return null;
  }

  return normalized;
}

export function isValidUaePhone(input: string): boolean {
  return normalizeUaePhone(input) !== null;
}
