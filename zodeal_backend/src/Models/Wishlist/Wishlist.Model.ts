import mongoose, { Schema, Model } from "mongoose";
import { IWishlistDocument } from "./Wishlist.Interface.js";

const wishlistSchema = new Schema<IWishlistDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  couponIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
    },
  ],
});

export const WishlistModel: Model<IWishlistDocument> =
  mongoose.model<IWishlistDocument>("Wishlist", wishlistSchema);
