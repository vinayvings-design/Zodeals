import mongoose, { Schema, Model } from "mongoose";
import { ITestimonialDocument } from "./Testimonial.Interface.js";
const testimonialSchema = new Schema<ITestimonialDocument>(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    status:{
      type: String,
      enum:["request", "approve","rejected"],
      default: "request"
    },
    userId:{
      type: Schema.Types.ObjectId ,
      ref: "User",
      required: false,
    }
  },
  {
    timestamps: true,
  }
);
export const TestimonialModel: Model<ITestimonialDocument> =
  mongoose.model<ITestimonialDocument>("Testimonial", testimonialSchema);
