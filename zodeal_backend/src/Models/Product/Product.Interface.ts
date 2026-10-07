import { Document } from "mongoose";
export interface IProduct {
  image: string ;
  description: string;
  price: number;
  link: string;
  discountPercentage: number;
  viewCount: number;
}
export interface IProductDocument extends Document, IProduct {}
