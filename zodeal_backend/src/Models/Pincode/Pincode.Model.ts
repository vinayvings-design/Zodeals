import mongoose, { Schema, Model } from "mongoose";
import { IPinCodeDocument } from "./Pincode.Interface.js";

const pinCodeSchema = new Schema<IPinCodeDocument>(
  {
    state: {
      type: String,
      required: true,
      trim: true,
    },
    cities: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        pinCode: [
          {
            type: Number,
            required: true,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const PinCodeModel: Model<IPinCodeDocument> =
  mongoose.model<IPinCodeDocument>("PinCode", pinCodeSchema);
