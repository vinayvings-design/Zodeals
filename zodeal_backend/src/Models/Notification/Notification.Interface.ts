import { Document, Types } from "mongoose";
export interface INotification {
  image?: string;
  title?: string;
  content?: string;
  date?: Date;
  status?: boolean;
}
export interface INotificationDocument {
  userId?: Types.ObjectId;
  notification: INotification[];
}
export interface INotificationModel extends INotificationDocument, Document {}
