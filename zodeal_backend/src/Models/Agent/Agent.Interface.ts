import { Document } from "mongoose";

export interface IVendorDetail {
  name: string;
  amount: number;
}
export interface IAgent {
  name: string;
  email: string;
  phoneNumber: string;
  code?: string;
  pan?: string;
  address?: string;
  city?: string;
  pincode?: string;
  upi?: string;
  reference?: string;
  vendor?: string;
  marketingAmount?: number;
  vendorDetails: IVendorDetail[];
}


export interface IAgentDocument extends IAgent, Document {}
