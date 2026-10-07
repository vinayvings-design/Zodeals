import jwt from "jsonwebtoken";
import { unauthorized } from "../../commons/Utils/StatusCode.js";
import { findAdminByEmailQuery } from "../Queries/Admin.Query.js";
import { Request, Response, NextFunction } from "express";
import { findVendorByEmailQuery } from "../Queries/Vendor.Query.js";
import { findUserByEmailQuery } from "../Queries/User.Query.js";

interface AuthenticatedRequest extends Request {
  userName?: string;
}
interface JwtPayload {
  userId: string;
}
const auth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(unauthorized)
        .send("Please provide a valid Authorization header with Bearer token.");
    }
    const token = authHeader.slice(7);
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.userName = decoded.userId;
    const admin = await findAdminByEmailQuery(decoded.userId);
    if (admin) {
      return res.status(unauthorized).send({ error: "Authentication failed" });
    }
    next();
  } catch (error) {
    res.status(unauthorized).send({ error: "Authentication failed" });
  }
};

const adminAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(unauthorized)
        .send("Please provide a valid Authorization header with Bearer token.");
    }
    const token = authHeader.slice(7);
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.userName = decoded.userId;
    const admin = await findAdminByEmailQuery(decoded.userId);
    if (!admin) {
      return res.status(unauthorized).send({ error: "Authentication failed" });
    }
    next();
  } catch (error) {
    res.status(unauthorized).send({ error: "Authentication failed" });
  }
};
const vendorAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(unauthorized)
        .send("Please provide a valid Authorization header with Bearer token.");
    }
    const token = authHeader.slice(7);
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.userName = decoded.userId;
    const vendor = await findVendorByEmailQuery(decoded.userId);
    if (!vendor) {
      return res.status(unauthorized).send({ error: "Authentication failed" });
    }
    next();
  } catch (error) {
    res.status(unauthorized).send({ error: "Authentication failed" });
  }
};
const userAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(unauthorized)
        .send("Please provide a valid Authorization header with Bearer token.");
    }
    const token = authHeader.slice(7);
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.userName = decoded.userId;
    const user = await findUserByEmailQuery(decoded.userId);
    if (!user) {
      return res.status(unauthorized).send({ error: "Authentication failed" });
      }
      next();
  } catch (error) {
    res.status(unauthorized).send({ error: "Authentication failed" });
  }
};
export { auth, adminAuth, vendorAuth , userAuth};
