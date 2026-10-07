import { Types } from "mongoose";
import { error } from "../../commons/Exception/CustomException.js";
import { badRequest, notFound } from "../../commons/Utils/StatusCode.js";
import { ICouponPriceDocument } from "../Models/Coupon/CouponPrice.Interface.js";
import {
  addNotifyCouponQuery,
  deleteCouponByIdQuery,
  editCouponByIdQuery,
  getAllCouponByTypeQuery,
  getCouponByIdQuery,
  getCouponPriceQuery,
  getListOfCouponsQuery,
  saveCouponCommentQuery,
  saveCouponPriceQuery,
  saveCouponQuery,
  saveCouponWorkingQuery,
  viewAllCouponByStoreIdQuery,
  viewCommentsByCouponIdQuery,
  viewCouponByCategoryIdQuery,
  viewCouponWorkingByCouponIdQuery,
  viewOnlyCouponsByStoreIdAndTypeQuery,
} from "../Queries/Coupon.Query.js";
import { ICoupon, ICouponDocument } from "../Models/Coupon/Coupon.Interface.js";
import { findVendorByEmailQuery } from "../Queries/Vendor.Query.js";
import {
  getListOfStoresQuery,
  getStoreByVendorIdQuery,
} from "../Queries/Store.Query.js";
import { deleteFile } from "../../commons/Utils/Storage.js";
import { ICouponWorkingDocument } from "../Models/Coupon/CouponWorking.Interface.js";
import { findUserByEmailQuery } from "../Queries/User.Query.js";
import { ModifyResult } from "mongoose";
import {
  ICouponComment,
  ICouponCommentDocument,
} from "../Models/Coupon/CouponComment.Interface.js";
import { ICouponNotifyDocument } from "../Models/Coupon/CouponNotify.Interface.js";
interface couponInput {
  file?: { filename: string };
  body: Partial<ICoupon>;
}
interface couponWorkingInput {
  couponId: string | Types.ObjectId;
  message: "yes" | "no";
}
const saveCouponPriceService = async (couponPriceDetails: {
  oneCouponPrice: number;
  tenCouponPrice: number;
}): Promise<ICouponPriceDocument> => {
  try {
    const couponPrice = await saveCouponPriceQuery(couponPriceDetails);
    return couponPrice;
  } catch (error) {
    throw error;
  }
};
const getCouponPriceService = async (): Promise<ICouponPriceDocument> => {
  try {
    const price = await getCouponPriceQuery();
    if (!price) {
      throw error(notFound, "No price found.");
    }
    return price as ICouponPriceDocument;
  } catch (error) {
    throw error;
  }
};
const saveCouponService = async (
  userName: string,
  couponDetails: couponInput & { files?: any }
) => {
  try {
    const { files, body } = couponDetails;
    const vendor = await findVendorByEmailQuery(userName);
    const vendorId = vendor?._id as Types.ObjectId;
    const store = await getStoreByVendorIdQuery(vendorId);
    if (!store) {
      throw error(badRequest, "Please add store and coupons.");
    }
    const storeId = store?._id as Types.ObjectId;
    if (!store.logo) {
      throw error(badRequest, "Please add store logo.");
    }
    let logoUrl: string | undefined = store.logo;
    let bannerUrl: string | undefined;

    // if (files?.logo && files.logo[0]) {
    //   logoUrl = `/uploads/CouponImages/${files.logo[0].filename}`;
    // }
    if (files?.banner && files.banner[0]) {
      bannerUrl = `/uploads/CouponImages/${files.banner[0].filename}`;
    }

    const couponData = {
      ...body,
      storeId: storeId,
      ...(logoUrl && { logo: logoUrl }),
      ...(bannerUrl && { banner: bannerUrl }),
    };

    const coupon = await saveCouponQuery(couponData);
    return coupon;
  } catch (error) {
    throw error;
  }
};
const getListOfCouponByVendorService = async (userName: string, query: any) => {
  try {
    const paidBool = query.paid.toLowerCase() === "true";
    const vendor = await findVendorByEmailQuery(userName);
    const vendorId = vendor?._id as Types.ObjectId;
    const store = await getStoreByVendorIdQuery(vendorId);
    if (!store) {
      throw error(badRequest, "Please add store and coupons.");
    }
    const storeId = store?._id as Types.ObjectId;
    const coupons = await viewAllCouponByStoreIdQuery(storeId);
    if (coupons.length === 0) {
      throw error(notFound, "No coupons found.");
    }
    const filteredCoupons =
      typeof query.paid === "string"
        ? coupons.filter((coupon) => coupon.paid === paidBool)
        : coupons;
    return filteredCoupons;
  } catch (error) {
    throw error;
  }
};
const editCouponByVendorService = async (
  userName: string,
  couponId: string,
  couponDetails: couponInput & { files?: any }
) => {
  try {
    const { files, body } = couponDetails;

    const vendor = await findVendorByEmailQuery(userName);
    if (!vendor) throw error(badRequest, "Vendor not found.");
    let logoUrl: string | undefined;
    let bannerUrl: string | undefined;
    if (files?.logo && files.logo[0]) {
      logoUrl = `/uploads/CouponImages/${files.logo[0].filename}`;
    }
    if (files?.banner && files.banner[0]) {
      bannerUrl = `/uploads/CouponImages/${files.banner[0].filename}`;
    }
    const updateData: Partial<ICoupon> = {
      ...body,
      // ...(logoUrl && { logo: logoUrl }),
      ...(bannerUrl && { banner: bannerUrl }),
    };
    const updatedCoupon = await editCouponByIdQuery(couponId, updateData);
    if (!updatedCoupon) {
      throw error(notFound, "Coupon not found or update failed.");
    }
    return updatedCoupon;
  } catch (error) {
    throw error;
  }
};

const deleteCouponByVendorService = async (
  couponId: string | Types.ObjectId
): Promise<ICouponDocument> => {
  try {
    const deletedCoupon = await deleteCouponByIdQuery(couponId);
    if (!deletedCoupon) {
      throw error(notFound, "Coupon not found.");
    }
    if (deletedCoupon.banner) {
      await deleteFile(deletedCoupon.banner);
    }
    if (deletedCoupon.logo) {
      await deleteFile(deletedCoupon.logo);
    }
    return deletedCoupon;
  } catch (error) {
    throw error;
  }
};
const getCouponsByStoreIdService = async (
  storeId: string | Types.ObjectId, pinCode?: string
): Promise<ICouponDocument[]> => {
  try {
    let result: ICouponDocument[] = [];
    const coupons = await viewAllCouponByStoreIdQuery(storeId);
    if (coupons.length === 0) {
      throw error(notFound, "No coupons found.");
    }
    for (const coupon of coupons) {
      if (coupon.paid === true && (!pinCode || (coupon.pinCode && coupon.pinCode.includes(pinCode)))) {
        result.push(coupon);
      }
    }
    return result;
  } catch (error) {
    throw error;
  }
};
const getCouponsByCategoryIdService = async (
  categoryId: string | Types.ObjectId, pinCode?: string
): Promise<ICouponDocument[]> => {
  try {
    let result: ICouponDocument[] = [];
    const coupons = await viewCouponByCategoryIdQuery(categoryId);
    if (coupons.length === 0) {
      throw error(notFound, "No coupons found.");
    }
    for (const coupon of coupons) {
      if (coupon.paid === true && (!pinCode || (coupon.pinCode && coupon.pinCode.includes(pinCode)))) {
        result.push(coupon);
      }
    }
    return result;
  } catch (error) {
    throw error;
  }
};
const saveCouponWorkingService = async (
  userName: string,
  couponWorking: couponWorkingInput
): Promise<ModifyResult<ICouponWorkingDocument>> => {
  try {
    const user = await findUserByEmailQuery(userName);
    const userId = user?._id as Types.ObjectId;
    const { couponId, message } = couponWorking;

    let update: any = {};
    if (message === "yes") {
      update = {
        $addToSet: { yes: userId },
        $pull: { no: userId },
      };
    } else if (message === "no") {
      update = {
        $addToSet: { no: userId },
        $pull: { yes: userId },
      };
    }
    const result = await saveCouponWorkingQuery({ couponId }, update, {
      new: true,
      upsert: true,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const getCouponWorkingByCouponIdService = async (
  couponId: string | Types.ObjectId
): Promise<{
  yesCount: number;
  noCount: number;
} | null> => {
  try {
    const couponWorking = await viewCouponWorkingByCouponIdQuery(couponId);
    if (!couponWorking) {
      throw error(notFound, "Coupon working not found.");
    }
    return couponWorking;
  } catch (error) {
    throw error;
  }
};
const saveCouponCommentService = async (couponCommentDetails: {
  couponId: string | Types.ObjectId;
  name: string;
  comment: string;
}): Promise<ICouponCommentDocument | null> => {
  try {
    const { couponId, name, comment } = couponCommentDetails;
    if (!couponId || !name || !comment) {
      throw new Error("couponId, Name, and Comment are required.");
    }
    const commentObj = { name: name, comment: comment };
    const savedCouponComment = await saveCouponCommentQuery(
      couponId,
      commentObj
    );
    return savedCouponComment;
  } catch (error) {
    throw error;
  }
};
const getCouponCommentService = async (
  couponId: string | Types.ObjectId
): Promise<ICouponCommentDocument | null> => {
  try {
    if (!couponId) {
      throw new Error("couponId is required.");
    }
    const couponComment = await viewCommentsByCouponIdQuery(couponId);
    return couponComment;
  } catch (error) {
    throw error;
  }
};
const addNotifyCouponService = async (notifyDetails: {
  storeId: string | Types.ObjectId;
  email: string;
}): Promise<ICouponNotifyDocument> => {
  try {
    const { storeId, email } = notifyDetails;
    const savedNotifyDetails = await addNotifyCouponQuery(storeId, email);
    return savedNotifyDetails;
  } catch (error) {
    throw error;
  }
};
const getCouponsByPinCodeService = async (pinCode?: string) => {
  try {
    const coupons = await getAllCouponByTypeQuery("Coupon");
    if (!coupons || coupons.length === 0) {
      return {
        matchedCoupons: [],
        panIndiaCoupons: [],
      };
    }

    const matchedCoupons = pinCode
      ? coupons.filter(
        (coupon) => coupon.pinCode && coupon.pinCode.includes(pinCode)
      )
      : [];

    return {
      matchedCoupons,
      panIndiaCoupons: coupons,
    };
    const stores = await getListOfStoresQuery(pinCode);
    if (!stores || stores.length === 0) {
      throw error(notFound, "No Coupon found for the given PinCode");
    }

    let couponsList: ICouponDocument[] = [];
    for (const store of stores) {
      const storeId = store?._id as Types.ObjectId;
      if (!storeId) continue;
      const coupons = await viewOnlyCouponsByStoreIdAndTypeQuery(
        storeId,
        "Coupon"
      );
      if (Array.isArray(coupons) && coupons.length > 0) {
        couponsList = [...coupons, ...couponsList];
      }
    }

    if (couponsList.length === 0) {
      throw error(notFound, "No Coupon found for the given PinCode");
    }
    return couponsList;
  } catch (error) {
    throw error;
  }
};
const getDealsByPinCodeService = async (
  type: string = "Deal",
  pinCode?: string,
  categoryId?: string,
  storeId?: string
) => {
  try {
    const matchedDeals = await getAllCouponByTypeQuery(type, {
      pinCode,
      categoryId,
      storeId,
    });
    const panIndiaDeals = matchedDeals;
    return {
      matchedDeals,
      panIndiaDeals,
    };
  } catch (error) {
    throw error;
  }
};

const getLastDealsService = async (pinCode?: string) => {
  try {
    const deals = await getAllCouponByTypeQuery("Deal");
    if (!deals || deals.length === 0) {
      return {
        matchedDeals: [],
        panIndiaDeals: [],
      };
    }

    const matchedDeals = pinCode
      ? deals.filter((deal) => deal.pinCode && deal.pinCode.includes(pinCode))
      : [];

    return {
      matchedDeals,
      panIndiaDeals: deals,
    };
    // const stores = await getListOfStoresQuery(pinCode);
    // if (!stores || stores.length === 0) {
    //   throw error(notFound, "No Coupon found for the given PinCode");
    // }

    // let couponsList: ICouponDocument[] = [];
    // for (const store of stores) {
    //   const storeId = store?._id as Types.ObjectId;
    //   if (!storeId) continue;
    //   const coupons = await viewOnlyCouponsByStoreIdAndTypeQuery(
    //     storeId,
    //     "Deal"
    //   );
    //   if (Array.isArray(coupons) && coupons.length > 0) {
    //     couponsList = [...coupons, ...couponsList];
    //   }
    // }

    // if (couponsList.length === 0) {
    //   throw error(notFound, "No Coupon found for the given PinCode");
    // }
    // return couponsList;
  } catch (error) {
    throw error;
  }
};
const getDealsAndCouponByPinCodeService = async (pinCode?: string) => {
  try {
    const coupons = await getAllCouponByTypeQuery("Coupon");
    const deals = await getAllCouponByTypeQuery("Deal");

    const result = {
      matched: [] as ICouponDocument[],
      panIndia: [] as ICouponDocument[],
    };

    if ((!coupons || coupons.length === 0) && (!deals || deals.length === 0)) {
      return result;
    }

    const matchedCoupons = pinCode
      ? coupons.filter(
        (coupon) => coupon.pinCode && coupon.pinCode.includes(pinCode)
      )
      : [];

    const matchedDeals = pinCode
      ? deals.filter((deal) => deal.pinCode && deal.pinCode.includes(pinCode))
      : [];

    result.matched = [...matchedCoupons, ...matchedDeals];
    result.panIndia = [...(coupons || []), ...(deals || [])];

    return result;
  } catch (error) {
    throw error;
  }
};
const getListOfCouponsService = async () => {
  try {
    const coupons = await getListOfCouponsQuery();
    if (coupons.length === 0) {
      throw error(notFound, "No Coupons found.");
    }
    return coupons;
  } catch (error) {
    throw error;
  }
};
const getCouponByIdService = async (
  id: string | Types.ObjectId
): Promise<ICouponDocument> => {
  try {
    const coupon = await getCouponByIdQuery(id);
    if (!coupon) {
      throw error(notFound, "Coupon not found.");
    }
    return coupon;
  } catch (error) {
    throw error;
  }
};
export {
  saveCouponPriceService,
  getCouponPriceService,
  saveCouponService,
  getListOfCouponByVendorService,
  editCouponByVendorService,
  deleteCouponByVendorService,
  getCouponsByStoreIdService,
  getCouponsByCategoryIdService,
  saveCouponWorkingService,
  getCouponWorkingByCouponIdService,
  saveCouponCommentService,
  getCouponCommentService,
  addNotifyCouponService,
  getCouponsByPinCodeService,
  getDealsByPinCodeService,
  getDealsAndCouponByPinCodeService,
  getLastDealsService,
  getListOfCouponsService,
  getCouponByIdService,
};
