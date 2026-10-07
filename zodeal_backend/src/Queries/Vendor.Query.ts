import { Types } from "mongoose";
import { VendorModel } from "../Models/Vendor/Vendor.Model.js";
import { IVendor, IVendorDocument } from "../Models/Vendor/Vendor.Interface.js";

const saveVendorQuery = async (
  vendorDetails: IVendor
): Promise<IVendorDocument> => {
  try {
    const savedVendor = await new VendorModel(vendorDetails).save();
    return savedVendor;
  } catch (error) {
    throw error;
  }
};

const findVendorByEmailQuery = async (
  email: string
): Promise<IVendorDocument | null> => {
  try {
    const vendor = await VendorModel.findOne({ email });
    return vendor;
  } catch (error) {
    throw error;
  }
};

const updateVendorByIdQuery = async (
  id: string | Types.ObjectId,
  vendorDetails: Partial<IVendor>
): Promise<IVendorDocument | null> => {
  try {
    const updatedVendor = await VendorModel.findByIdAndUpdate(
      id,
      { $set: vendorDetails },
      { new: true, runValidators: true }
    );
    return updatedVendor;
  } catch (error) {
    throw error;
  }
};
const getVendorCountQuery = async():Promise<number>=>{
  try {
    const count = await VendorModel.countDocuments();
    return count;
  } catch (error) {
    throw error;
  }
}
export {
  saveVendorQuery,
  findVendorByEmailQuery,
  updateVendorByIdQuery,
  getVendorCountQuery,
};
