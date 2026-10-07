import { Document, Types } from "mongoose";
export interface ICoupon {
  title: string;
  type: "Coupon" | "Deal";
  code?: string;
  link?: string;
  description: string;
  discountType: "Flat" | "Percentage" | "BOGO";
  discountValue: number;
  validFrom: string;
  validTill: string;
  category: string | Types.ObjectId;
  applicableProducts?: string[];
  termsAndConditions: string;
  storeUrl: string;
  logo: string;
  banner?: string;
  storeId: string | Types.ObjectId;
  status: "Active" | "Expired" | "Draft";
  viewCount: number;
  paid: boolean;
  pinCode?: string[];
  agentCode?: string;
  isPanIndia?: boolean;
}

export interface ICouponDocument extends ICoupon, Document { }
