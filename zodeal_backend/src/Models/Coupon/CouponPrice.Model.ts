import mongoose, { Schema, Model } from "mongoose";
import { ICouponPriceDocument } from "./CouponPrice.Interface.js";
const couponPriceSchema = new Schema<ICouponPriceDocument>({
    oneCouponPrice: { type: Number, required: true },
    tenCouponPrice: { type: Number, required: true },
},{
    timestamps: true,
});
export const CouponPriceModel: Model<ICouponPriceDocument>= mongoose.model<ICouponPriceDocument>("CouponPrice", couponPriceSchema);
