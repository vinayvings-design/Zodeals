import { Types } from "mongoose";
import { BannerModel } from "../Models/Banner/Banner.Model.js";
import { IBanner, IBannerDocument } from "../Models/Banner/Banner.Interface.js";

const saveBannerQuery = async (banner: IBanner): Promise<IBannerDocument> => {
  return await new BannerModel(banner).save();
};

const updateBannerQuery = async (
  id: string | Types.ObjectId,
  banner: Partial<IBanner>
): Promise<IBannerDocument | null> => {
  return await BannerModel.findByIdAndUpdate(id, banner, {
    new: true,
    runValidators: true,
  });
};

const deleteBannerQuery = async (
  id: string | Types.ObjectId
): Promise<IBannerDocument | null> => {
  return await BannerModel.findByIdAndDelete(id);
};

const getBannerByIdQuery = async (
  id: string | Types.ObjectId
): Promise<IBannerDocument | null> => {
  return await BannerModel.findById(id);
};

const getAllBannersQuery = async (): Promise<IBannerDocument[]> => {
  return await BannerModel.find().sort({ order: 1, createdAt: 1 });
};

const getActiveBannersQuery = async (): Promise<IBannerDocument[]> => {
  return await BannerModel.find({ isActive: true }).sort({
    order: 1,
    createdAt: 1,
  });
};

const getMaxBannerOrderQuery = async (): Promise<number> => {
  const last = await BannerModel.findOne().sort({ order: -1 }).select("order");
  return last ? last.order : 0;
};

export {
  saveBannerQuery,
  updateBannerQuery,
  deleteBannerQuery,
  getBannerByIdQuery,
  getAllBannersQuery,
  getActiveBannersQuery,
  getMaxBannerOrderQuery,
};
