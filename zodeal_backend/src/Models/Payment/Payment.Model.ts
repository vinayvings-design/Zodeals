import mongoose, { Schema, Model } from "mongoose";
import { IPaymentDocument } from "./Payment.Interface.js";

const paymentSchema = new Schema<IPaymentDocument>(
  {
    razorpay_order_id: { type: String, required: false },
    razorpay_payment_id: { type: String, required: false },
    razorpay_signature: { type: String, required: false },
    date: { type: Date, required: true, default: Date.now },
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: false },
    paymentStatus: { type: String, required: true },
    paymentMethod: { type: String, required: false },
    amount: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

export const PaymentModel: Model<IPaymentDocument> =
  mongoose.model<IPaymentDocument>("Payment", paymentSchema);
