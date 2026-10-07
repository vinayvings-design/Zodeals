import mongoose, { Schema, Model } from "mongoose";
import { IPinCodePaymentHistoryDocument } from "./PinCodePaymentHistory.Interface.js";


const pinCodePaymentHistorySchema = new Schema<IPinCodePaymentHistoryDocument>(
  {
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
    razorpay_signature: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: false },
    paymentStatus: { type: String, required: true },
    paymentMethod: { type: String, required: false },
    amount: { type: Number, required: false },
    tag: {
      type: String,
      enum: [
        "single",
        "double",
        "threeToFour",
        "fiveToTen",
        "fullCity",
        "fullState",
        "twoState",
        "panIndia",
      ],
      required: false,
    },
    city: [{ type: String, required: false }],
    state: [{ type: String, required: false }],
    pinCode: [{ type: Number, required: true }],
    couponId: [{ type: Schema.Types.ObjectId, ref: "Coupon", required: true }],
  },
  {
    timestamps: true,
  }
);

export const PinCodePaymentHistoryModel: Model<IPinCodePaymentHistoryDocument> =
  mongoose.model<IPinCodePaymentHistoryDocument>(
    "PinCodePaymentHistory",
    pinCodePaymentHistorySchema
  );
