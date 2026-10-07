import { Document } from "mongoose";

export interface IPinCode {
  state: string;
  cities: {
    name: string;
    pinCode: number[];
  }[];
}

export interface IPinCodeDocument extends Document, IPinCode {}
