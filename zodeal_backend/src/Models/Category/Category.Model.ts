import mongoose, { Schema, Model } from "mongoose";
import { ICategoryDocument } from "./Category.Interface.js";
const categorySchema = new Schema<ICategoryDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const CategoryModel: Model<ICategoryDocument> =
  mongoose.model<ICategoryDocument>("Category", categorySchema);
