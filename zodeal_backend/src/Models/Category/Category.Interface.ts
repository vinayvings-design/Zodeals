import { Document } from "mongoose";
export interface ICategory {
  title: string;
  image: string;
}
export interface ICategoryDocument extends ICategory, Document {}
