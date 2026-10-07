import { Document } from "mongoose";
export interface IContactUs{
email:string;
primaryNumber:number;
secondaryNumber?:number;
location:string;
instagram?:string;
facebook?:string;
twitter?:string;
linkedIn?:string;
}
export interface IContactUsDocument extends IContactUs,Document{};