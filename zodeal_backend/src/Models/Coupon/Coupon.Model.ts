import mongoose, { Schema, Model } from "mongoose";
import { ICouponDocument } from "./Coupon.Interface.js";

const couponSchema = new Schema<ICouponDocument>(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["Coupon", "Deal"], required: true },
    code: {
      type: String,
      required: function (this: any) {
        return this.type === "Coupon";
      },
    },
    link: {
      type: String,
      required: function (this: any) {
        return this.type === "Deal";
      },
    },
    description: { type: String, required: true },
    discountType: {
      type: String,
      enum: ["Flat", "Percentage", "BOGO"],
      required: true,
    },
    isPanIndia: {
      type: Boolean,
      default: false,
    },
    discountValue: { type: Number, required: true },
    validFrom: { type: String, required: true },
    validTill: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    applicableProducts: [{ type: String }],
    termsAndConditions: { type: String, required: true },
    storeUrl: { type: String, required: true },
    logo: { type: String, required: true },
    banner: { type: String },
    storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    status: {
      type: String,
      enum: ["Active", "Expired", "Draft"],
      default: "Active",
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    paid: {
      type: Boolean,
      default: false
    },
    pinCode: [
      { type: String }
    ],
    agentCode: { type: String }
  },
  {
    timestamps: true,
  }
);

export const CouponModel: Model<ICouponDocument> =
  mongoose.model<ICouponDocument>("Coupon", couponSchema);
