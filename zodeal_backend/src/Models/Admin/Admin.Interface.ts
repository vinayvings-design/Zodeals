import { Document } from "mongoose";

export interface IAdmin {
  name: string;
  email: string;
  password: string;
}
export interface IAdminDocument extends IAdmin, Document {}
