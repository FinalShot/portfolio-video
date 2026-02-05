// Simple in-memory rate limiter
// For production, use Redis/KV store instead

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export function rateLimit(
  identifier: string, // IP address or user ID
  limit: number = 5, // max requests
  windowMs: number = 60000 // 1 minute in ms
): boolean {
  const now = Date.now();
  const key = `${identifier}`;

  // Si la clé n'existe pas ou que le window est expiré, réinitialise
  if (!store[key] || now > store[key].resetTime) {
    store[key] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return true; // Requête autorisée
  }

  // Si on a pas dépassé la limite
  if (store[key].count < limit) {
    store[key].count++;
    return true; // Requête autorisée
  }

  // Limite dépassée
  return false; // Requête refusée
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return ip;
}

// Cleanup old entries every hour (prevent memory leak)
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (now > store[key].resetTime) {
      delete store[key];
    }
  });
}, 3600000);

