import { Request, Response, NextFunction } from "express";
import NodeCache from "node-cache";

// Short-lived in-memory cache for public GET endpoints (home data, categories, stores,
// coupon lists). It keeps the database from being hit by every visitor. Any write request
// (POST/PUT/PATCH/DELETE) clears it, so admin and vendor edits show up straight away.
const store = new NodeCache({ stdTTL: 60, checkperiod: 120, useClones: false, maxKeys: 2000 });

export const cacheResponse = (ttlSeconds = 60) => (req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "GET") return next();
  const key = req.originalUrl;
  const hit = store.get<{ status: number; body: unknown; total?: string }>(key);
  res.setHeader("Cache-Control", `public, max-age=${Math.min(ttlSeconds, 30)}`);
  if (hit) {
    res.setHeader("X-Cache", "HIT");
    if (hit.total) {
      res.setHeader("X-Total-Count", hit.total);
      res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
    }
    return res.status(hit.status).json(hit.body);
  }
  const json = res.json.bind(res);
  res.json = (body: any) => {
    if (res.statusCode === 200) store.set(key, { status: 200, body, total: res.getHeader("X-Total-Count")?.toString() }, ttlSeconds);
    return json(body);
  };
  return next();
};

// Mount once, before the routes: any write clears the cache.
export const clearCacheOnWrite = (req: Request, _res: Response, next: NextFunction) => {
  const readOnly = req.method === "GET" || req.method === "OPTIONS" || req.method === "HEAD";
  // Sign-in and password requests change nothing that is cached.
  if (!readOnly && !/^\/(login|forgot)/.test(req.path)) store.flushAll();
  next();
};
