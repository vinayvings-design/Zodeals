import { Types, Document } from "mongoose";
import { WishlistModel } from "../Models/Wishlist/Wishlist.Model.js";
import { IWishlistDocument } from "../Models/Wishlist/Wishlist.Interface.js";

const addCouponWishlistByUserIdQuery = async (
  userId: string | Types.ObjectId,
  couponId: string | Types.ObjectId
): Promise<IWishlistDocument | null> => {
  try {
    const id = typeof userId === "string" ? new Types.ObjectId(userId) : userId;
    const updateWishlist = await WishlistModel.findOneAndUpdate(
      { userId: id },
      { $addToSet: { couponIds: couponId } },
      { new: true, upsert: true }
    );
    return updateWishlist;
  } catch (error) {
    throw error;
  }
};

const removeCouponWishlistByUserIdQuery = async (
  userId: string | Types.ObjectId,
  couponId: string | Types.ObjectId
): Promise<IWishlistDocument | null> => {
  try {
    const id = typeof userId === "string" ? new Types.ObjectId(userId) : userId;
    const updateWishlist = await WishlistModel.findOneAndUpdate(
      { userId: id },
      { $pull: { couponIds: couponId } },
      { new: true }
    );
    return updateWishlist;
  } catch (error) {
    throw error;
  }
};
const getPopulatedCouponsByUserIdQuery = async (
  userId: string | Types.ObjectId
): Promise<IWishlistDocument | null> => {
  try {
    const id = typeof userId === "string" ? new Types.ObjectId(userId) : userId;
    const wishlist = await WishlistModel.findOne({ userId: id }).populate(
      "couponIds"
    );
    return wishlist;
  } catch (error) {
    throw error;
  }
};

export {
  addCouponWishlistByUserIdQuery,
  removeCouponWishlistByUserIdQuery,
  getPopulatedCouponsByUserIdQuery,
};
