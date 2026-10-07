import { Document, Types } from "mongoose";

export interface IWishlist {
  userId: Types.ObjectId | string;
  couponIds: (Types.ObjectId | string)[];
}

export interface IWishlistDocument extends IWishlist, Document {}
