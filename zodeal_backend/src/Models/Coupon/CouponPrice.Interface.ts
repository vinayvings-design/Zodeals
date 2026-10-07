import { Document } from "mongoose";
export interface ICouponPrice {
  oneCouponPrice: number;
  tenCouponPrice:number;
}
export interface ICouponPriceDocument extends ICouponPrice, Document {}
