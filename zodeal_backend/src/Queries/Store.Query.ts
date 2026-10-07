import { Types } from "mongoose";
import { StoreModel } from "../Models/Store/Store.Model.js";
import { IStore, IStoreDocument } from "../Models/Store/Store.Interface.js";
const saveStoreQuery = async (
  storeDetails: IStore
): Promise<IStoreDocument> => {
  try {
    const store = await new StoreModel(storeDetails).save();
    return store;
  } catch (error) {
    throw error;
  }
};
const getStoreByVendorIdQuery = async (
  vendorId: string | Types.ObjectId
): Promise<IStoreDocument | null> => {
  try {
const store = await StoreModel.findOne({ vendorId: vendorId }).select(
  "-pinCodes -locationQRCode"
);

    return store;
  } catch (error) {
    throw error;
  }
};
const updateStoreByVendorIdQuery = async (
  vendorId: string | Types.ObjectId,
  storeDetails: Partial<IStoreDocument>
): Promise<IStoreDocument | null> => {
  try {
    const updatedStore = await StoreModel.findOneAndUpdate(
      { vendorId: vendorId },
      { $set: { ...storeDetails } },
      { new: true }
    );
    return updatedStore;
  } catch (error) {
    throw error;
  }
};
const getListOfStoresQuery = async (
  query: any
): Promise<IStoreDocument[]> => {
  try {
    const stores = await StoreModel.find(query)
    return stores;
  } catch (error) {
    throw error;
  }
};

export {
  saveStoreQuery,
  getStoreByVendorIdQuery,
  updateStoreByVendorIdQuery,
  getListOfStoresQuery,
};
