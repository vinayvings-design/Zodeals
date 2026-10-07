import { Document, Types } from "mongoose";
export interface IPinCodePaymentHistory {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  date?: Date;
  vendorId?: string | Types.ObjectId;
  paymentStatus: string;
  paymentMethod?: string;
  amount?: number;
  tag?:
    | "single"
    | "double"
    | "threeToFour"
    | "fiveToTen"
    | "fullCity"
    | "fullState"
    | "twoState"
    | "panIndia";
  city?: Array<string>;
  state?: Array<string>;
  pinCode: Array<number>;
  couponId: Array<string | Types.ObjectId>;
}
export interface IPinCodePaymentHistoryDocument
  extends IPinCodePaymentHistory,
    Document {}
