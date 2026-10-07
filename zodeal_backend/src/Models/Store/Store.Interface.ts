import { Document, Types } from "mongoose";
export interface IStore {
  vendorId: Types.ObjectId;
  name: string;
  logo?: string;
  description?: string;
  contactName: string;
  contactEmail: string;
  phoneNumber?: string;
  socialMediaLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    [key: string]: string | undefined;
  };
  address?: string;
  locationQRCode?: string;
  country?: string;
  states?: string[];
  districts?: string[];
  pinCodes?: string[];
}

export interface IStoreDocument extends IStore, Document {}
