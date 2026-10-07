import { Document, Types } from "mongoose";
export interface ICouponWorking {
  couponId: string | Types.ObjectId;
  yes: (string | Types.ObjectId)[];
  no: (string | Types.ObjectId)[];
}
export interface ICouponWorkingDocument extends ICouponWorking, Document {}
