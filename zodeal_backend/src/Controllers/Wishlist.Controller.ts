import { Request, Response } from "express";
declare module "express" {
  export interface Request {
    userName?: string;
  }
}
import { serverError, successCode } from "../../commons/Utils/StatusCode.js";
import {
  handleSuccessResponse,
  handleErrorResponse,
} from "../../commons/Response/Response.js";
import { ErrorResponse } from "../../commons/Interfaces/ErrorResponse.interface.js";
import {
  addCouponWishlistService,
  getPopulatedCouponsService,
  removeCouponWishlistService,
} from "../Services/Wishlist.Service.js";
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
const addCouponWishlistController = async (req: Request, res: Response) => {
  try {
    const userName = (req as any).userName as string;
    const result = await addCouponWishlistService(userName, req.body.couponId);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Coupon added wishlist successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const viewWishlistCouponController = async (req: Request, res: Response) => {
  try {
    const userName = (req as any).userName as string;
    const result = await getPopulatedCouponsService(userName);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Coupons fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const deleteWishlistCouponController = async (req: Request, res: Response) => {
  try {
    const userName = (req as any).userName as string;
    const result = await removeCouponWishlistService(
      userName,
      req.params.couponId
    );
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Coupon removed from wishlist successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
export {
  /**
   * @swagger
   * /user/wishlist:
   *   post:
   *     tags:
   *       - Wishlist (User)
   *     summary: Add a coupon to the user's wishlist
   *     description: Adds a coupon to the authenticated user's wishlist.
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         type: string
   *         description: Bearer token for user authentication
   *       - in: body
   *         name: body
   *         required: true
   *         schema:
   *           type: object
   *           required:
   *             - couponId
   *           properties:
   *             couponId:
   *               type: string
   *               description: The ID of the coupon to add to the wishlist
   *     responses:
   *       200:
   *         description: Coupon added to wishlist
   *       400:
   *         description: Invalid input or coupon already in wishlist
   *       401:
   *         description: Unauthorized
   */
  addCouponWishlistController,

  /**
   * @swagger
   * /user/wishlist:
   *   get:
   *     tags:
   *       - Wishlist (User)
   *     summary: View all coupons in the user's wishlist
   *     description: Returns all coupons in the authenticated user's wishlist.
   *     produces:
   *       - application/json
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         type: string
   *         description: Bearer token for user authentication
   *     responses:
   *       200:
   *         description: List of coupons in the wishlist
   *       401:
   *         description: Unauthorized
   */
  viewWishlistCouponController,

  /**
   * @swagger
   * /user/wishlist/{couponId}:
   *   delete:
   *     tags:
   *       - Wishlist (User)
   *     summary: Remove a coupon from the user's wishlist
   *     description: Removes the specified coupon from the authenticated user's wishlist.
   *     produces:
   *       - application/json
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         type: string
   *         description: Bearer token for user authentication
   *       - in: path
   *         name: couponId
   *         required: true
   *         type: string
   *         description: The ID of the coupon to remove from the wishlist
   *     responses:
   *       200:
   *         description: Coupon removed from wishlist
   *       400:
   *         description: Invalid coupon ID
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Coupon not found in wishlist
   */
  deleteWishlistCouponController,
};
