import { describe, expect, it } from "vitest";
import { normalizeUaePhone } from "@/lib/phone";

describe("normalizeUaePhone", () => {
  it.each([["0501234567", "+971501234567"], ["501234567", "+971501234567"], ["+971501234567", "+971501234567"], ["00971501234567", "+971501234567"]])("normalizes %s", (input, expected) => expect(normalizeUaePhone(input)).toBe(expected));
  it.each(["040123456", "+966501234567", "050123456", "05012345678", "1111111111"])("rejects %s", (input) => expect(normalizeUaePhone(input)).toBeNull());
});
