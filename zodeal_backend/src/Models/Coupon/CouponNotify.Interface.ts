import { Document, Types } from "mongoose";

export interface ICouponNotify {
  storeId: Types.ObjectId | string;
  emails: string[]; 
}

export interface ICouponNotifyDocument extends ICouponNotify, Document {}
