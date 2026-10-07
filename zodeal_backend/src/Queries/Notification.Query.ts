import { Types } from "mongoose";
import { NotificationModel } from "../Models/Notification/Notification.Model.js";
import {
  INotification,
  INotificationDocument,
} from "../Models/Notification/Notification.Interface.js";
const saveNotificationQuery = async (
  notification: INotification
): Promise<INotificationDocument> => {
  try {
    const savedNotification = await new NotificationModel(notification).save();
    return savedNotification;
  } catch (error) {
    throw error;
  }
};
const getCountByUserIdQuery = async (
  userId: string | Types.ObjectId
): Promise<number> => {
  try {
    const result = await NotificationModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      { $unwind: "$notification" },
      { $match: { "notification.status": true } },
      { $count: "count" },
    ]);
    return result[0]?.count || 0;
  } catch (error) {
    throw error;
  }
};
const getNotificationByUserIdQuery = async (
  userId: string | Types.ObjectId
): Promise<INotificationDocument | null> => {
  try {
    const notification = await NotificationModel.findOne({ userId });
    return notification;
  } catch (error) {
    throw error;
  }
};
const pushNotificationByUserIdQuery = async (
  userId: string | Types.ObjectId,
  newNotification: INotification
) => {
  try {
    const id = typeof userId === "string" ? new Types.ObjectId(userId) : userId;
    const updatedDoc = await NotificationModel.findOneAndUpdate(
      { userId: id },
      { $push: { notification: newNotification } },
      { new: true, upsert: true }
    );
    return updatedDoc;
  } catch (error) {
    throw error;
  }
};
export {
  saveNotificationQuery,
  getCountByUserIdQuery,
  getNotificationByUserIdQuery,
  pushNotificationByUserIdQuery,
};
