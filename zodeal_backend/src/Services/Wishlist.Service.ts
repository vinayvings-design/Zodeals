import { Types } from "mongoose";
import { findUserByEmailQuery } from "../Queries/User.Query.js";
import {
  addCouponWishlistByUserIdQuery,
  getPopulatedCouponsByUserIdQuery,
  removeCouponWishlistByUserIdQuery,
} from "../Queries/Wishlist.Query.js";
import { IWishlistDocument } from "../Models/Wishlist/Wishlist.Interface.js";
import { error } from "console";
import { notFound } from "../../commons/Utils/StatusCode.js";

const addCouponWishlistService = async (
  userName: string,
  couponId: string
): Promise<IWishlistDocument | null> => {
  try {
    const user = await findUserByEmailQuery(userName);
    let userId = user?._id as Types.ObjectId;
    const updatedWishlist = await addCouponWishlistByUserIdQuery(
      userId,
      couponId
    );
    return updatedWishlist;
  } catch (error) {
    throw error;
  }
};

const removeCouponWishlistService = async (
  userName: string,
  couponId: string
): Promise<IWishlistDocument | null> => {
  try {
    const user = await findUserByEmailQuery(userName);
    let userId = user?._id as Types.ObjectId;
    const updatedWishlist = await removeCouponWishlistByUserIdQuery(
      userId,
      couponId
    );
    if (!updatedWishlist) {
      throw error(notFound, "Wishlist not found.");
    }
    return updatedWishlist;
  } catch (error) {
    throw error;
  }
};

const getPopulatedCouponsService = async (
  userName: string
): Promise<IWishlistDocument | null> => {
  try {
    const user = await findUserByEmailQuery(userName);
    let userId = user?._id as Types.ObjectId;
    const wishlist = await getPopulatedCouponsByUserIdQuery(userId);
    return wishlist;
  } catch (error) {
    throw error;
  }
};

export {
  addCouponWishlistService,
  removeCouponWishlistService,
  getPopulatedCouponsService,
};
