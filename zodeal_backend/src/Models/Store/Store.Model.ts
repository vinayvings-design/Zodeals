import mongoose, { Schema, Model } from "mongoose";
import { IStoreDocument } from "./Store.Interface.js";

const storeSchema = new Schema<IStoreDocument>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    name: { type: String, required: true },
    logo: { type: String },
    description: { type: String },
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    phoneNumber: { type: String },
    socialMediaLinks: {
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
    },
    address: { type: String },
    locationQRCode: { type: String },
    country: { type: String },
    states: [{ type: String }],
    districts: [{ type: String }],
    pinCodes: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const StoreModel: Model<IStoreDocument> = mongoose.model<IStoreDocument>(
  "Store",
  storeSchema
);
