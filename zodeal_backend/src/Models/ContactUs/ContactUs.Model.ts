import mongoose, { Schema, Model } from "mongoose";
import { IContactUsDocument } from "./ContactUs.Interface.js";
const contactUsSchema = new Schema<IContactUsDocument>({
  email: { type: String, required: true },
  primaryNumber: { type: Number, required: true },
  secondaryNumber: { type: Number },
  location: { type: String, required: true },
  instagram: { type: String },
  facebook: { type: String },
  twitter: { type: String },
  linkedIn: { type: String },
});
export const ContactUsModel: Model<IContactUsDocument> =
  mongoose.model<IContactUsDocument>("ContactUs", contactUsSchema);
