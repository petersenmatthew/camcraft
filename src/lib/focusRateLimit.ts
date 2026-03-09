const MIN_SPACING_MS = 20_000;
const WINDOW_MS = 10 * 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

export type FocusRateLimitResult =
  | { allowed: true }
  | {
      allowed: false;
      retryAfterSeconds: number;
      reason: "cooldown" | "window";
    };

const focusRequestStore = new Map<string, number[]>();

function getClientKey(ip: string | null): string {
  if (!ip) return "unknown";
  return ip.trim().toLowerCase() || "unknown";
}

export function extractClientIp(headers: Headers): string | null {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return null;
}

export function checkFocusRateLimit(now: number, ip: string | null): FocusRateLimitResult {
  const clientKey = getClientKey(ip);
  const windowStart = now - WINDOW_MS;
  const recentRequests = (focusRequestStore.get(clientKey) ?? []).filter(
    (timestamp) => timestamp > windowStart
  );

  const lastRequestAt = recentRequests[recentRequests.length - 1];
  if (typeof lastRequestAt === "number") {
    const spacingRemainingMs = MIN_SPACING_MS - (now - lastRequestAt);
    if (spacingRemainingMs > 0) {
      focusRequestStore.set(clientKey, recentRequests);
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil(spacingRemainingMs / 1000),
        reason: "cooldown",
      };
    }
  }

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldestRequestAt = recentRequests[0];
    const windowRemainingMs = WINDOW_MS - (now - oldestRequestAt);
    focusRequestStore.set(clientKey, recentRequests);
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil(windowRemainingMs / 1000)),
      reason: "window",
    };
  }

  recentRequests.push(now);
  focusRequestStore.set(clientKey, recentRequests);
  return { allowed: true };
}

export function getFocusRateLimitMessage(
  retryAfterSeconds: number,
  reason: "cooldown" | "window"
): string {
  const secondsLabel = `${retryAfterSeconds} second${retryAfterSeconds === 1 ? "" : "s"}`;
  if (reason === "cooldown") {
    return `Focus is temporarily paused. Try again in ${secondsLabel}.`;
  }

  return `Focus is temporarily rate limited to protect the AI endpoint from abuse. Try again in ${secondsLabel}.`;
}

export function resetFocusRateLimitStore() {
  focusRequestStore.clear();
}
