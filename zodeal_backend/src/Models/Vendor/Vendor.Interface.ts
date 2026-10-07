import { Document, Types } from "mongoose";

export interface IVendor {
  name: string;
  email: string;
  profile?: string;
  phoneNumber: string;
  businessName: string;
  password: string;
  verify?: boolean;
  is_store_created:boolean,
  is_first_time_user?:boolean
}

export interface IVendorDocument extends IVendor, Document {}
