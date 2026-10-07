import { Document, Types } from "mongoose";
export interface ITestimonial {
  name: string;
  email: string;
  review: string;
  rating: number;
  image?: string;
  status?:string;
  userId?: Types.ObjectId | string;
}
export interface ITestimonialDocument extends ITestimonial, Document {}