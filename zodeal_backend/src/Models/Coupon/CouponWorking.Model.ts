import mongoose, { Schema, Model } from "mongoose";
import { ICouponWorkingDocument } from "./CouponWorking.Interface.js";

const couponWorkingSchema = new Schema<ICouponWorkingDocument>(
  {
    couponId: { type: Schema.Types.ObjectId, ref: "Coupon", required: true },
    yes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    no: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

export const CouponWorkingModel: Model<ICouponWorkingDocument> =
  mongoose.model<ICouponWorkingDocument>("CouponWorking", couponWorkingSchema);
