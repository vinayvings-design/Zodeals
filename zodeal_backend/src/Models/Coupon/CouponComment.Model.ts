import mongoose, { Schema, Model } from "mongoose";
import { ICouponCommentDocument } from "./CouponComment.Interface.js";

const couponCommentSchema = new Schema<ICouponCommentDocument>({
  couponId: { type: Schema.Types.ObjectId, ref: "Coupon", required: true },
  comments: [
    {
      name: { type: String, required: true },
      comment: { type: String, required: true },
    },
  ],
});

export const CouponCommentModel: Model<ICouponCommentDocument> = mongoose.model(
  "CouponComment",
  couponCommentSchema
);
