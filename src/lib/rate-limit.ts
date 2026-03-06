/**
 * In-memory sliding-window token-bucket rate limiter.
 * Vercel-compatible (no Redis required). Each serverless instance
 * maintains its own map — provides best-effort per-instance limiting.
 */

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  maxRequests: number;
  /** Window size in seconds */
  windowSizeSeconds: number;
}

const stores = new Map<string, Map<string, RateLimitEntry>>();

function getStore(name: string): Map<string, RateLimitEntry> {
  let store = stores.get(name);
  if (!store) {
    store = new Map();
    stores.set(name, store);
  }
  return store;
}

export function rateLimit(
  key: string,
  config: RateLimitConfig,
  storeName = "default"
): { success: boolean; remaining: number; resetInSeconds: number } {
  const store = getStore(storeName);
  const now = Date.now();
  const entry = store.get(key);

  if (!entry) {
    store.set(key, { tokens: config.maxRequests - 1, lastRefill: now });
    // Auto-cleanup every 100 entries
    if (store.size > 10_000) cleanupStore(store);
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetInSeconds: config.windowSizeSeconds,
    };
  }

  const elapsed = (now - entry.lastRefill) / 1000;
  const refillRate = config.maxRequests / config.windowSizeSeconds;
  entry.tokens = Math.min(
    config.maxRequests,
    entry.tokens + elapsed * refillRate
  );
  entry.lastRefill = now;

  if (entry.tokens < 1) {
    const resetIn = Math.ceil((1 - entry.tokens) / refillRate);
    return { success: false, remaining: 0, resetInSeconds: resetIn };
  }

  entry.tokens -= 1;
  return {
    success: true,
    remaining: Math.floor(entry.tokens),
    resetInSeconds: config.windowSizeSeconds,
  };
}

function cleanupStore(
  store: Map<string, RateLimitEntry>,
  maxAgeMs = 300_000
): void {
  const cutoff = Date.now() - maxAgeMs;
  for (const [key, entry] of store) {
    if (entry.lastRefill < cutoff) {
      store.delete(key);
    }
  }
}

/** Extract client IP from request (Vercel sets x-forwarded-for) */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}
