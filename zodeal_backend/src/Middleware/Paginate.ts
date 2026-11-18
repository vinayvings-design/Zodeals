import { Request, Response } from "express";

// Optional pagination for list endpoints: ?page=1&limit=20. Without `limit` the full list is
// returned, so existing clients keep working. The full count is sent in X-Total-Count.
export const paginate = <T>(items: T[], req: Request, res: Response): T[] => {
  if (!Array.isArray(items)) return items;
  res.setHeader("X-Total-Count", String(items.length));
  res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
  const limit = parseInt(String(req.query.limit ?? ""), 10);
  if (!Number.isFinite(limit) || limit <= 0) return items;
  const page = Math.max(parseInt(String(req.query.page ?? "1"), 10) || 1, 1);
  const size = Math.min(limit, 100);
  return items.slice((page - 1) * size, page * size);
};
