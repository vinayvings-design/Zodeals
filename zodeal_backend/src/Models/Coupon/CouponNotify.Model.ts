import mongoose, { Schema, Model } from "mongoose";
import { ICouponNotifyDocument } from "./CouponNotify.Interface.js";

const couponNotifySchema = new Schema<ICouponNotifyDocument>({
  storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
  emails: {
    type: [String], 
    required: true,
  },
});

export const CouponNotifyModel: Model<ICouponNotifyDocument> = mongoose.model(
  "CouponNotify",
  couponNotifySchema
);
