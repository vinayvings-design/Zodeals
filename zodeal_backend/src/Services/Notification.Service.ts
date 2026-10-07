import { Types } from "mongoose";
import {
  getCountByUserIdQuery,
  getNotificationByUserIdQuery,
  pushNotificationByUserIdQuery,
} from "../Queries/Notification.Query.js";
import {
  findAllUsersQuery,
  findAllVendorsQuery,
  findUserByEmailQuery,
} from "../Queries/User.Query.js";
import { IUser } from "../Models/User/User.Interface.js";
import { IVendor } from "../Models/Vendor/Vendor.Interface.js";
import {
  INotification,
  INotificationDocument,
} from "../Models/Notification/Notification.Interface.js"; // If you have this
import { badRequest, notFound } from "../../commons/Utils/StatusCode.js";
import { findVendorByEmailQuery } from "../Queries/Vendor.Query.js";
import { error } from "../../commons/Exception/CustomException.js";
interface NotificationBody {
  title: string;
  content: string;
  targetAudience: "users" | "vendors" | "both";
}

interface NotificationServiceInput {
  file?: { filename: string };
  body: NotificationBody;
}

const sendNotificationService = async (
  notification: NotificationServiceInput
) => {
  try {
    const { file, body } = notification;
    const { title, content, targetAudience } = body;
    const notificationData: INotification = {
      title,
      content,
      image: file ? `/uploads/NotificationImages/${file.filename}` : undefined,
    };

    let userIds: string[] = [];

    if (targetAudience === "users" || targetAudience === "both") {
      const users: IUser[] = await findAllUsersQuery();
      userIds.push(...users.map((user) => (user as any)["_id"].toString()));
    }
    if (targetAudience === "vendors" || targetAudience === "both") {
      const vendors: IVendor[] = await findAllVendorsQuery();
      userIds.push(
        ...vendors.map((vendor) => (vendor as any)["_id"].toString())
      );
    }
    userIds = Array.from(new Set(userIds));
    await Promise.all(
      userIds.map((userId) =>
        pushNotificationByUserIdQuery(
          new Types.ObjectId(userId),
          notificationData
        )
      )
    );
    return notificationData;
  } catch (error) {
    throw error;
  }
};
const getNotificationCountService = async (
  userName: string
): Promise<number> => {
  try {
    const user =
      (await findUserByEmailQuery(userName)) ||
      (await findVendorByEmailQuery(userName));
    if (!user) {
      throw error(badRequest, "User or vendor not found. Try again later.");
    }
    const userId = (user as any)["_id"] as string | Types.ObjectId;
    const count = await getCountByUserIdQuery(userId);
    return count;
  } catch (error) {
    throw error;
  }
};
const getNotificationsByUserIdService = async (
  userName: string
): Promise<INotificationDocument> => {
  try {
     const user =
       (await findUserByEmailQuery(userName)) ||
       (await findVendorByEmailQuery(userName));
     if (!user) {
       throw error(badRequest, "User or vendor not found. Try again later.");
     }
     const userId = (user as any)["_id"] as string | Types.ObjectId;
    const notification = await getNotificationByUserIdQuery(userId);
    if (!notification) {
      throw error(notFound, "Notification not found.");
    }
    return notification;
  } catch (error) {
    throw error;
  }
};
export {
  sendNotificationService,
  getNotificationCountService,
  getNotificationsByUserIdService,
};
