import mongoose, { Schema, Model } from "mongoose";
import { BANNER_THEMES, IBannerDocument } from "./Banner.Interface.js";

const bannerSchema = new Schema<IBannerDocument>(
  {
    image: { type: String, required: true },
    badge: { type: String, default: "", maxlength: 60 },
    headline: { type: String, required: true, maxlength: 90 },
    accentText: { type: String, default: "", maxlength: 90 },
    subtitle: { type: String, default: "", maxlength: 220 },
    primaryLabel: { type: String, default: "", maxlength: 30 },
    primaryLink: { type: String, default: "" },
    secondaryLabel: { type: String, default: "", maxlength: 30 },
    secondaryLink: { type: String, default: "" },
    theme: { type: String, enum: BANNER_THEMES, default: "orange" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Model is named "HeroBanner" because "Banner" is already used as a field name on coupons.
export const BannerModel: Model<IBannerDocument> =
  mongoose.model<IBannerDocument>("HeroBanner", bannerSchema);
