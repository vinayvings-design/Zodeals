import mongoose, { Schema, Model } from "mongoose";
import { INotificationModel } from "./Notification.Interface.js";

const notificationSchema = new Schema<INotificationModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
    },
    notification: [
      {
        image: {
          type: String,
        },
        title: {
          type: String,
        },
        content: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const NotificationModel: Model<INotificationModel> =
  mongoose.model<INotificationModel>("Notification", notificationSchema);
