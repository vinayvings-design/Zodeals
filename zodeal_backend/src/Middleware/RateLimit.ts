import { Request, Response, NextFunction } from "express";

// Simple per-IP fixed-window rate limiter (no extra packages). State lives in memory,
// which is fine for a single Railway instance.
export const rateLimit = (max: number, windowMs = 60_000) => {
  const hits = new Map<string, { n: number; reset: number }>();
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of hits) if (v.reset <= now) hits.delete(k);
  }, windowMs).unref();
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const cur = hits.get(ip);
    if (!cur || cur.reset <= now) {
      hits.set(ip, { n: 1, reset: now + windowMs });
      return next();
    }
    cur.n += 1;
    if (cur.n > max) {
      res.setHeader("Retry-After", String(Math.ceil((cur.reset - now) / 1000)));
      return res.status(429).json({
        statusCode: 429,
        result: null,
        displayMessage: "Too many requests. Please try again in a minute.",
        status: false,
      });
    }
    return next();
  };
};
