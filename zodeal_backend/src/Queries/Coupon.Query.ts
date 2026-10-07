import { ModifyResult, Types } from "mongoose";
import { ICouponPriceDocument } from "../Models/Coupon/CouponPrice.Interface.js";
import { CouponPriceModel } from "../Models/Coupon/CouponPrice.Model.js";
import { ICouponWorkingDocument } from "../Models/Coupon/CouponWorking.Interface.js";
import { CouponWorkingModel } from "../Models/Coupon/CouponWorking.Model.js";
import { ICoupon, ICouponDocument } from "../Models/Coupon/Coupon.Interface.js";
import { CouponModel } from "../Models/Coupon/Coupon.Model.js";
import {
  ICouponComment,
  ICouponCommentDocument,
} from "../Models/Coupon/CouponComment.Interface.js";
import { CouponCommentModel } from "../Models/Coupon/CouponComment.Model.js";
import { ICouponNotifyDocument } from "../Models/Coupon/CouponNotify.Interface.js";
import { CouponNotifyModel } from "../Models/Coupon/CouponNotify.Model.js";
const saveCouponPriceQuery = async ({
  oneCouponPrice,
  tenCouponPrice,
}: {
  oneCouponPrice: number;
  tenCouponPrice: number;
}): Promise<ICouponPriceDocument> => {
  try {
    const couponPrice = await CouponPriceModel.findOneAndUpdate(
      {},
      { $set: { oneCouponPrice, tenCouponPrice } },
      { new: true, upsert: true }
    );
    return couponPrice as ICouponPriceDocument;
  } catch (error) {
    throw error;
  }
};
const getCouponPriceQuery = async (): Promise<{
  oneCouponPrice: number;
  tenCouponPrice: number;
} | null> => {
  try {
    const doc = await CouponPriceModel.findOne().select(
      "oneCouponPrice tenCouponPrice -_id"
    );
    return doc
      ? {
        oneCouponPrice: doc.oneCouponPrice,
        tenCouponPrice: doc.tenCouponPrice,
      }
      : null;
  } catch (error) {
    throw error;
  }
};

const saveCouponQuery = async (
  couponData: Partial<ICoupon>
): Promise<ICouponDocument | null> => {
  try {
    const savedCoupon = await new CouponModel(couponData).save();
    return savedCoupon;
  } catch (error) {
    throw error;
  }
};

const viewAllCouponByStoreIdQuery = async (
  storeId: string | Types.ObjectId
): Promise<ICouponDocument[]> => {
  try {
    const coupons = await CouponModel.find({ storeId: storeId }).select(
      "-storeId -category"
    );
    return coupons;
  } catch (error) {
    throw error;
  }
};
const viewOnlyCouponsByStoreIdAndTypeQuery = async (
  storeId: string | Types.ObjectId,
  type: string
): Promise<ICouponDocument[]> => {
  try {
    const coupons = await CouponModel.find({
      storeId: storeId,
      type: type,
    }).select("-storeId -category");
    return coupons;
  } catch (error) {
    throw error;
  }
};

interface FilterOptions {
  pinCode?: string;
  categoryId?: string;
  storeId?: string;
}

//in future need to remove this query
const getAllCouponByTypeQuery = async (
  type: string,
  filters?: FilterOptions
): Promise<ICouponDocument[]> => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const query: any = {
      paid: true,
      $expr: {
        $and: [
          { $lte: [{ $substr: ["$validFrom", 0, 10] }, today] },
          { $gte: [{ $substr: ["$validTill", 0, 10] }, today] }
        ]
      }
    };
    const types = type.includes(",")
      ? type.split(",").map(t => t.trim())
      : type;
    if (Array.isArray(types)) {
      query.type = { $in: types };
    } else {
      query.type = types;
    }
    if (filters?.pinCode) {
      query.$or = [
        { isPanIndia: true },
        { pinCode: { $in: [filters.pinCode] } }
      ];
    } else {
      query.isPanIndia = true;
    }
    if (filters?.categoryId) {
      query.category = new Types.ObjectId(filters.categoryId);
    }
    if (filters?.storeId) {
      query.storeId = new Types.ObjectId(filters.storeId);
    }
    const coupons = await CouponModel.find(query)
      .sort({ createdAt: -1 })
      .populate("category");
    return coupons;
  } catch (error) {
    throw error;
  }
};


const getAllCouponsQuery = async (): Promise<ICouponDocument[]> => {
  try {
    const coupons = await CouponModel.find().sort({ createdAt: -1 });
    return coupons;
  } catch (error) {
    throw error;
  }
}
const viewCouponByIdQuery = async (
  couponId: string | Types.ObjectId
): Promise<ICouponDocument | null> => {
  try {
    const coupon = await CouponModel.findById(couponId);
    return coupon;
  } catch (error) {
    throw error;
  }
};
const editCouponByIdQuery = async (
  couponId: string | Types.ObjectId,
  couponData: Partial<ICoupon>
): Promise<ICouponDocument | null> => {
  try {
    const coupon = await CouponModel.findByIdAndUpdate(
      couponId,
      { ...couponData },
      { new: true }
    );
    return coupon;
  } catch (error) {
    throw error;
  }
};
const deleteCouponByIdQuery = async (
  id: string | Types.ObjectId
): Promise<ICouponDocument | null> => {
  try {
    const coupon = await CouponModel.findByIdAndDelete(id);
    return coupon;
  } catch (error) {
    throw error;
  }
};
const viewCouponByCategoryIdQuery = async (
  categoryId: string | Types.ObjectId
): Promise<ICouponDocument[]> => {
  try {
    const coupons = await CouponModel.find({ category: categoryId }).select(
      " -category"
    );
    return coupons;
  } catch (error) {
    throw error;
  }
};
const getListOfCouponsQuery = async (
  storeId?: string
): Promise<ICouponDocument[]> => {
  try {
    const filter: Record<string, any> = {
      status: "Active",
      paid: true
    };

    if (storeId) {
      filter.storeId = storeId;
    }

    return await CouponModel.find(filter).populate("category");
  } catch (error) {
    throw error;
  }
};


const addNotifyCouponQuery = async (
  couponId: string | Types.ObjectId,
  email: string
): Promise<ICouponNotifyDocument> => {
  try {
    const savedEmail = await CouponNotifyModel.findOneAndUpdate(
      { storeId: couponId },
      { $addToSet: { emails: email } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return savedEmail;
  } catch (error) {
    throw error;
  }
};
const viewNotifyEmailByStoreIdQuery = async (
  storeId: string | Types.ObjectId
): Promise<ICouponNotifyDocument | null> => {
  try {
    const emails = await CouponNotifyModel.findOne({ storeId: storeId }).select(
      "-storeId"
    );
    return emails;
  } catch (error) {
    throw error;
  }
};
const saveCouponCommentQuery = async (
  couponId: string | Types.ObjectId,
  comment: { name: string; comment: string }
): Promise<ICouponCommentDocument | null> => {
  try {
    const couponComment = await CouponCommentModel.findOneAndUpdate(
      { couponId },
      { $push: { comments: comment } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return couponComment;
  } catch (error) {
    throw error;
  }
};
const viewCommentsByCouponIdQuery = async (
  couponId: string | Types.ObjectId
): Promise<ICouponCommentDocument | null> => {
  try {
    return await CouponCommentModel.findOne({ couponId }).select(
      "comments -_id"
    );
  } catch (error) {
    throw error;
  }
};
const saveCouponWorkingQuery = async (
  filter: any,
  update: any,
  options: any = { new: true, upsert: true }
): Promise<ModifyResult<ICouponWorkingDocument>> => {
  try {
    const updatedCouponWorking = await CouponWorkingModel.findOneAndUpdate(
      filter,
      update,
      options
    );
    return updatedCouponWorking;
  } catch (error) {
    throw error;
  }
};
const viewCouponWorkingByCouponIdQuery = async (
  couponId: string | Types.ObjectId
): Promise<{ yesCount: number; noCount: number } | null> => {
  try {
    const result = await CouponWorkingModel.aggregate([
      {
        $match: {
          couponId:
            typeof couponId === "string"
              ? new Types.ObjectId(couponId)
              : couponId,
        },
      },
      {
        $project: {
          _id: 0,
          yesCount: { $size: { $ifNull: ["$yes", []] } },
          noCount: { $size: { $ifNull: ["$no", []] } },
        },
      },
    ]);
    return result[0] || { yesCount: 0, noCount: 0 };
  } catch (error) {
    throw error;
  }
};
const getCouponByIdQuery = async (
  id: string | Types.ObjectId
): Promise<ICouponDocument | null> => {
  try {
    const coupon = await CouponModel.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true }
    );
    return coupon;
  } catch (error) {
    throw error;
  }
};

export {
  saveCouponPriceQuery,
  getCouponPriceQuery,
  saveCouponQuery,
  viewAllCouponByStoreIdQuery,
  viewOnlyCouponsByStoreIdAndTypeQuery,
  viewCouponByCategoryIdQuery,
  getAllCouponByTypeQuery,
  getAllCouponsQuery,
  viewCouponByIdQuery,
  editCouponByIdQuery,
  deleteCouponByIdQuery,
  getListOfCouponsQuery,
  addNotifyCouponQuery,
  viewNotifyEmailByStoreIdQuery,
  saveCouponCommentQuery,
  viewCommentsByCouponIdQuery,
  saveCouponWorkingQuery,
  viewCouponWorkingByCouponIdQuery,
  getCouponByIdQuery,
};
