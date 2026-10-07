import { Document, Types } from "mongoose";
export interface IPayment {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  date?: Date;
  vendorId?: string | Types.ObjectId;
  paymentStatus: string;
  paymentMethod?: string;
  amount?: number;
}
export interface IPaymentDocument extends IPayment, Document {}
