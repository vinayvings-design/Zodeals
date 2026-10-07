import mongoose, { Schema, Model } from "mongoose";
import { IUserDocument } from "./User.Interface.js";

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    profile: { type: String, required: false },
    verify:{type: Boolean, default: false},
  },
  {
    timestamps: true,
  }
);

export const UserModel: Model<IUserDocument> = mongoose.model<IUserDocument>(
  "User",
  userSchema
);
