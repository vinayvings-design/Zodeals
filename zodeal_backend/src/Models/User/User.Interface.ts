import { Document } from "mongoose";
export interface IUser{
name:string;
email:string;
phoneNumber: string;
password:string;
profile?: string;
verify?:boolean;
}
export interface IUserDocument extends IUser, Document{}