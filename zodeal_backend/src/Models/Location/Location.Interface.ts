import { Document } from "mongoose";

export interface ILocation {
  states?: Array<{
    name: string;
    districts: Array<{
      name: string;
      pinCodes: string[];
    }>;
  }>;
}

export interface ILocationDocument extends ILocation, Document {}
