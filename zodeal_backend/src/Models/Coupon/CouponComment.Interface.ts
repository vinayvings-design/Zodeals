import { Document, Types } from "mongoose";

export interface ICouponCommentItem {
  name: string;
  comment: string;
}

export interface ICouponComment {
  couponId: string | Types.ObjectId;
  comments: ICouponCommentItem[];
}

export interface ICouponCommentDocument extends ICouponComment, Document {}
