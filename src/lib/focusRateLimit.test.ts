import { beforeEach, describe, expect, test } from "bun:test";
import {
  checkFocusRateLimit,
  extractClientIp,
  resetFocusRateLimitStore,
} from "@/lib/focusRateLimit";

describe("focusRateLimit", () => {
  beforeEach(() => {
    resetFocusRateLimitStore();
  });

  test("allows the first request for an IP", () => {
    const result = checkFocusRateLimit(0, "203.0.113.10");
    expect(result).toEqual({ allowed: true });
  });

  test("blocks rapid repeat requests during cooldown", () => {
    expect(checkFocusRateLimit(0, "203.0.113.10")).toEqual({ allowed: true });

    const result = checkFocusRateLimit(5_000, "203.0.113.10");
    expect(result.allowed).toBe(false);
    if (result.allowed) return;

    expect(result.reason).toBe("cooldown");
    expect(result.retryAfterSeconds).toBe(15);
  });

  test("blocks the sixth spaced request within ten minutes", () => {
    const ip = "203.0.113.10";
    const timestamps = [0, 20_000, 40_000, 60_000, 80_000];

    for (const timestamp of timestamps) {
      expect(checkFocusRateLimit(timestamp, ip)).toEqual({ allowed: true });
    }

    const result = checkFocusRateLimit(100_000, ip);
    expect(result.allowed).toBe(false);
    if (result.allowed) return;

    expect(result.reason).toBe("window");
    expect(result.retryAfterSeconds).toBe(500);
  });

  test("expires old requests once they leave the rolling window", () => {
    const ip = "203.0.113.10";

    expect(checkFocusRateLimit(0, ip)).toEqual({ allowed: true });
    expect(checkFocusRateLimit(20_000, ip)).toEqual({ allowed: true });
    expect(checkFocusRateLimit(40_000, ip)).toEqual({ allowed: true });
    expect(checkFocusRateLimit(60_000, ip)).toEqual({ allowed: true });
    expect(checkFocusRateLimit(80_000, ip)).toEqual({ allowed: true });

    expect(checkFocusRateLimit(601_000, ip)).toEqual({ allowed: true });
  });

  test("extracts the first forwarded IP and falls back to x-real-ip", () => {
    const forwardedHeaders = new Headers({
      "x-forwarded-for": "198.51.100.3, 203.0.113.9",
    });
    expect(extractClientIp(forwardedHeaders)).toBe("198.51.100.3");

    const realIpHeaders = new Headers({
      "x-real-ip": "203.0.113.8",
    });
    expect(extractClientIp(realIpHeaders)).toBe("203.0.113.8");

    expect(extractClientIp(new Headers())).toBeNull();
  });
});
