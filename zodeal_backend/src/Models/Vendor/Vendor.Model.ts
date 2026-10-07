import mongoose, { Schema, Model } from "mongoose";
import { IVendorDocument } from "./Vendor.Interface.js";
const vendorSchema = new Schema<IVendorDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profile: { type: String, required: false },
    phoneNumber: { type: String, required: true },
    businessName: { type: String, required: true },
    password: { type: String, required: true },
    verify: { type: Boolean, default: false },
    is_store_created: { type: Boolean, default: false },
    is_first_time_user: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);
export const VendorModel: Model<IVendorDocument> =
  mongoose.model<IVendorDocument>("Vendor", vendorSchema);
