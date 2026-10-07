import mongoose, { Schema, Model } from "mongoose";
import { IAdminDocument } from "./Admin.Interface.js";
const adminSchema = new Schema<IAdminDocument>(
  {
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
export const AdminModel: Model<IAdminDocument> = mongoose.model<IAdminDocument>(
  "Admin",
  adminSchema
);
