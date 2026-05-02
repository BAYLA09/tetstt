export function normalizeUaePhone(input: string): string | null {
  const compact = input.replace(/[\s().-]/g, "");
  let digits = compact;
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.startsWith("00971")) digits = `971${digits.slice(5)}`;
  if (digits.startsWith("971")) digits = digits.slice(3);
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (!/^5\d{8}$/.test(digits)) return null;
  return `+971${digits}`;
}

export function isValidName(name: string): boolean {
  return name.trim().length >= 2;
}
