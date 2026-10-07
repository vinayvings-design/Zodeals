import { Request, Response } from "express";
declare module "express" {
  export interface Request {
    userName?: string;
  }
}
import {
  created,
  dataAlreadyExists,
  serverError,
  successCode,
} from "../../commons/Utils/StatusCode.js";
import {
  handleSuccessResponse,
  handleErrorResponse,
} from "../../commons/Response/Response.js";
import { ErrorResponse } from "../../commons/Interfaces/ErrorResponse.interface.js";
import {
  getNotificationCountService,
  getNotificationsByUserIdService,
  sendNotificationService,
} from "../Services/Notification.Service.js";
const handleControllerError = (error: ErrorResponse, res: Response) => {
  if (error.errorCode) {
    return handleErrorResponse(error, res);
  }
  return handleErrorResponse(
    {
      errorCode: serverError,
      displayMessage: "Internal Server Error",
    },
    res
  );
};
const sendNotificationController = async (req: Request, res: Response) => {
  try {
    const result = await sendNotificationService({
      file: req.file,
      body: req.body,
    });
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Notification sent successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getNotificationCountController = async (req: Request, res: Response) => {
  try {
    const userName = (req as any).userName as string;
    const result = await getNotificationCountService(userName);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Notification sent successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getNotificationsByUserIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const userName = (req as any).userName as string;
    const result = await getNotificationsByUserIdService(userName);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Notification sent successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
export {
  /**
   * @swagger
   * /admin/notification:
   *   post:
   *     tags:
   *       - Notification (Admin) 
   *     summary: Send a notification to users and/or vendors
   *     description: Sends a notification to users, vendors, or both. Optionally uploads an image.
   *     consumes:
   *       - multipart/form-data
   *     produces:
   *       - application/json
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         type: string
   *         description: Bearer token for admin authentication
   *       - in: formData
   *         name: image
   *         type: file
   *         required: false
   *         description: Optional notification image
   *       - in: formData
   *         name: title
   *         type: string
   *         required: true
   *         description: Notification title
   *       - in: formData
   *         name: content
   *         type: string
   *         required: true
   *         description: Notification content
   *       - in: formData
   *         name: targetAudience
   *         type: string
   *         required: true
   *         enum: [users, vendors, both]
   *         description: Who will receive the notification
   *     responses:
   *       200:
   *         description: Notification sent successfully
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   */

  sendNotificationController,
  /**
   * @swagger
   * /notification/count:
   *   get:
   *     tags:
   *       - Notification (Vendor User)
   *     summary: Get count of active notifications for a user or vendor
   *     description: Returns the count of notifications with status true for a given user or vendor.
   *     produces:
   *       - application/json
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         type: string
   *         description: Bearer token for  authentication
   *     responses:
   *       200:
   *         description: Count of notifications
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: User not found
   */
  getNotificationCountController,
  /**
   * @swagger
   * /notification:
   *   get:
   *     tags:
   *       - Notification (Vendor User)
   *     summary: Get all notifications for a user or vendor
   *     description: Returns all notifications for a user or vendor.
   *     produces:
   *       - application/json
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         type: string
   *         description: Bearer token for authentication
   *     responses:
   *       200:
   *         description: List of notifications for the user
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: User not found or no notifications
   */
  getNotificationsByUserIdController,
};
