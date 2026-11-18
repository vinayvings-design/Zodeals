import mongoose, { Schema, Document, Model } from "mongoose";

export type PlanMode = "free" | "paid";
export const PLAN_MODES: PlanMode[] = ["free", "paid"];

export interface ISettingsDocument extends Document {
  planMode: PlanMode;
}

// A single document holds platform-wide settings. When it does not exist yet the
// platform behaves as "paid", which is how it worked before this setting existed.
const settingsSchema = new Schema<ISettingsDocument>(
  {
    planMode: { type: String, enum: PLAN_MODES, default: "paid" },
  },
  { timestamps: true }
);

export const SettingsModel: Model<ISettingsDocument> =
  mongoose.model<ISettingsDocument>("Settings", settingsSchema);
