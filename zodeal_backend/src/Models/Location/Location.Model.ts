import mongoose, { Schema, Model } from "mongoose";
import { ILocationDocument } from "./Location.Interface.js";

const DistrictSchema = new Schema(
  {
    name: { type: String, required: true },
    pinCodes: [{ type: String, required: true }],
  },
  { _id: false }
);

const StateSchema = new Schema(
  {
    name: { type: String, required: true },
    districts: [DistrictSchema],
  },
  { _id: false }
);

const LocationSchema = new Schema<ILocationDocument>(
  {
    states: [StateSchema],
  },
  { timestamps: true }
);

export const LocationModel: Model<ILocationDocument> =
  mongoose.model<ILocationDocument>("Location", LocationSchema);
