import { NextRequest } from "next/server";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export function rateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60000
): boolean {
  const now = Date.now();

  if (!store[identifier] || now > store[identifier].resetTime) {
    store[identifier] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return true;
  }

  if (store[identifier].count < limit) {
    store[identifier].count++;
    return true;
  }

  return false;
}

export function getClientIp(request: NextRequest | Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return ip;
}

// Cleanup every hour
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (now > store[key].resetTime) {
      delete store[key];
    }
  });
}, 3600000);
