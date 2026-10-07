import { Request, Response } from "express";
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
  addNotifyCouponService,
  deleteCouponByVendorService,
  editCouponByVendorService,
  getCouponByIdService,
  getCouponCommentService,
  getCouponPriceService,
  getCouponsByCategoryIdService,
  getCouponsByPinCodeService,
  getCouponsByStoreIdService,
  getCouponWorkingByCouponIdService,
  getDealsAndCouponByPinCodeService,
  getDealsByPinCodeService,
  getLastDealsService,
  getListOfCouponByVendorService,
  getListOfCouponsService,
  saveCouponCommentService,
  saveCouponPriceService,
  saveCouponService,
  saveCouponWorkingService,
} from "../Services/Coupon.Service.js";
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
const saveCouponPriceController = async (req: Request, res: Response) => {
  try {
    const result = await saveCouponPriceService(req.body);
    return handleSuccessResponse(
      { statusCode: created, result },
      res,
      "Coupon price added successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getCouponPriceController = async (req: Request, res: Response) => {
  try {
    const result = await getCouponPriceService();
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Coupon price fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const saveCouponController = async (req: Request, res: Response) => {
  try {
    const userName = (req as any).userName as string;
    const result = await saveCouponService(userName, req);
    return handleSuccessResponse(
      { statusCode: created, result },
      res,
      "Coupon saved successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getListOfCouponByVendorController = async (
  req: Request,
  res: Response
) => {
  try {
    const userName = (req as any).userName as string;
    const query = req.query;
    const result: unknown = await getListOfCouponByVendorService(userName, query);
    return handleSuccessResponse(
      { statusCode: created, result },
      res,
      "Coupon fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const editCouponByVendorController = async (req: Request, res: Response) => {
  try {
    const userName = (req as any).userName as string;
    const result = await editCouponByVendorService(
      userName,
      req.params.id,
      req
    );
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Coupon updated successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const deleteCouponByVendorController = async (req: Request, res: Response) => {
  try {
    const result = await deleteCouponByVendorService(req.params.id);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Coupon deleted successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getCouponsByStoreIdController = async (req: Request, res: Response) => {
  try {
    const pinCode = req.query.pinCode;
    const result = await getCouponsByStoreIdService(req.params.storeId, pinCode as string | undefined);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Coupon fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getCouponsByCategoryIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const pinCode = req.query.pinCode;
    const result = await getCouponsByCategoryIdService(req.params.categoryId, pinCode as string | undefined);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Coupon fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getListOfCouponsController = async (req: Request, res: Response) => {
  try {
    const result = await getListOfCouponsService();
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Coupons fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const saveCouponWorkingController = async (req: Request, res: Response) => {
  try {
    const userName = (req as any).userName as string;
    const result = await saveCouponWorkingService(userName, req.body);
    return handleSuccessResponse(
      { statusCode: created, result },
      res,
      "Coupon working message saved successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getCouponWorkingByCouponIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getCouponWorkingByCouponIdService(req.params.couponId);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Coupon working status fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const saveCouponCommentController = async (req: Request, res: Response) => {
  try {
    const result = await saveCouponCommentService(req.body);
    return handleSuccessResponse(
      { statusCode: created, result },
      res,
      "Coupon comment saved successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getCouponCommentController = async (req: Request, res: Response) => {
  try {
    const result = await getCouponCommentService(req.params.couponId);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Coupon comment fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const addNotifyCouponController = async (req: Request, res: Response) => {
  try {
    const result = await addNotifyCouponService(req.body);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Email added for notify."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getCouponsByPinCodeController = async (req: Request, res: Response) => {
  try {
    const pinCode = req.query.pinCode as string | undefined;
    const result = await getCouponsByPinCodeService(pinCode);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Coupons fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getDealsByPinCodeController = async (req: Request, res: Response) => {
  try {
    const { type, pinCode, categoryId, storeId } = req.query as {
      type?: string;
      pinCode?: string;
      categoryId?: string;
      storeId?: string;
    };
    const result = await getDealsByPinCodeService(
      type || "Deal",  
      pinCode,
      categoryId,
      storeId
    );
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Deals fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getDealsAndCouponByPinCodeController = async (
  req: Request,
  res: Response
) => {
  try {
    const pinCode = req.query.pinCode as string | undefined;
    const result = await getDealsAndCouponByPinCodeService(pinCode);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Deals and Coupon fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getLastDealsController = async (req: Request, res: Response) => {
  try {
    const pinCode = req.query.pinCode as string | undefined;
    const result = await getLastDealsService(pinCode);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Deals fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getCouponByIdController = async (req: Request, res: Response) => {
  try {
    const result = await getCouponByIdService(req.params.id);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Coupon fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
export {
  /**
   * @swagger
   * /admin/coupon/price:
   *   post:
   *     tags:
   *       - Coupon Price (Admin)
   *     summary: Set or update the coupon price
   *     description: Allows an admin to set or update the global coupon price.
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
   *         description: Bearer token for admin authentication
   *       - in: body
   *         name: body
   *         required: true
   *         description: Coupon price to set
   *         schema:
   *           type: object
   *           properties:
   *             oneCouponPrice:
   *               type: number
   *               example: 99
   *             tenCouponPrice:
   *               type: number
   *               example: 800
   *     responses:
   *       200:
   *         description: Coupon price set or updated successfully
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   */
  saveCouponPriceController,
  /**
   * @swagger
   * /coupon/price:
   *   get:
   *     tags:
   *       - Coupon Price (Admin, Vendor)
   *     summary: Get the current coupon price
   *     description: Returns the current global coupon price.
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Current coupon price
   *         schema:
   *           type: object
   *           properties:
   *             price:
   *               type: number
   *               example: 99
   *       404:
   *         description: Coupon price not set
   */
  getCouponPriceController,
  /**
   * @swagger
   * /vendor/coupon:
   *   post:
   *     tags:
   *       - Coupon (Vendor)
   *     summary: Create a new coupon or deal
   *     description: |
   *       Allows a vendor to create a new coupon or deal.
   *       - If `type` is `Coupon`, the `code` field is required.
   *       - If `type` is `Deal`, the `link` field is required.
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
   *         description: Bearer token for vendor authentication
   *       - in: formData
   *         name: title
   *         required: true
   *         type: string
   *         description: Coupon or deal title
   *       - in: formData
   *         name: type
   *         required: true
   *         type: string
   *         enum: [Coupon, Deal]
   *         description: Type of offer (Coupon or Deal)
   *       - in: formData
   *         name: code
   *         required: false
   *         type: string
   *         description: Required if type is Coupon
   *       - in: formData
   *         name: link
   *         required: false
   *         type: string
   *         description: Required if type is Deal
   *       - in: formData
   *         name: description
   *         required: true
   *         type: string
   *         description: Description of the coupon or deal
   *       - in: formData
   *         name: discountType
   *         required: true
   *         type: string
   *         enum: [Flat, Percentage, BOGO]
   *         description: Discount type
   *       - in: formData
   *         name: discountValue
   *         required: true
   *         type: number
   *         description: Discount value
   *       - in: formData
   *         name: validFrom
   *         required: true
   *         type: string
   *         format: date
   *         description: Start date (YYYY-MM-DD)
   *       - in: formData
   *         name: validTill
   *         required: true
   *         type: string
   *         format: date
   *         description: End date (YYYY-MM-DD)
   *       - in: formData
   *         name: category
   *         required: true
   *         type: string
   *         description: Coupon category
   *       - in: formData
   *         name: applicableProducts
   *         required: false
   *         type: array
   *         items:
   *           type: string
   *         description: List of applicable product IDs
   *       - in: formData
   *         name: termsAndConditions
   *         required: true
   *         type: string
   *         description: Terms and conditions
   *       - in: formData
   *         name: storeUrl
   *         required: true
   *         type: string
   *         description: Store URL
   *       - in: formData
   *         name: logo
   *         required: false
   *         type: file
   *         description: Coupon logo image file
   *       - in: formData
   *         name: banner
   *         required: false
   *         type: file
   *         description: Coupon banner image file (optional)
   *       - in: formData
   *         name: status
   *         required: true
   *         type: string
   *         enum: [Active, Expired, Draft]
   *         description: Coupon status
   *     responses:
   *       201:
   *         description: Coupon or deal created successfully
   *         schema:
   *           type: object
   *           properties:
   *             _id:
   *               type: string
   *               example: 609e129e8a7b9a0015bfae6d
   *             title:
   *               type: string
   *               example: Summer Sale
   *             type:
   *               type: string
   *               example: Coupon
   *             code:
   *               type: string
   *               example: SUMMER2025
   *             link:
   *               type: string
   *               example: https://store.com/summer-deal
   *             description:
   *               type: string
   *               example: Get 20% off on all summer collection items.
   *             discountType:
   *               type: string
   *               example: Percentage
   *             discountValue:
   *               type: number
   *               example: 20
   *             validFrom:
   *               type: string
   *               example: 2025-06-01
   *             validTill:
   *               type: string
   *               example: 2025-06-30
   *             category:
   *               type: string
   *               example: Clothing
   *             applicableProducts:
   *               type: array
   *               items:
   *                 type: string
   *               example: [productId1, productId2]
   *             termsAndConditions:
   *               type: string
   *               example: Valid on minimum purchase of $50.
   *             storeUrl:
   *               type: string
   *               example: https://store.com
   *             logo:
   *               type: string
   *               example: /uploads/CouponLogoImages/logo.png
   *             banner:
   *               type: string
   *               example: /uploads/CouponBannerImages/banner.png
   *             storeId:
   *               type: string
   *               example: 609e129e8a7b9a0015bfae6d
   *             status:
   *               type: string
   *               example: Active
   *             viewCount:
   *               type: number
   *               example: 0
   *       400:
   *         description: Invalid request (missing required fields or validation error)
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: Code is required for type Coupon.
   *       401:
   *         description: Unauthorized (vendor authentication required)
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: Unauthorized access.
   */
  saveCouponController,
  /**
   * @swagger
   * /vendor/coupon:
   *   get:
   *     tags:
   *       - Coupon (Vendor)
   *     summary: Get list of coupons by vendor
   *     description: Returns all coupons and deals created by the authenticated vendor.
   *     produces:
   *       - application/json
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         type: string
   *         description: Bearer token for vendor authentication
   *       - in: query
   *         name: paid
   *         type: boolean
   *     responses:
   *       200:
   *         description: List of coupons and deals
   *         schema:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               _id:
   *                 type: string
   *                 example: 609e129e8a7b9a0015bfae6d
   *               title:
   *                 type: string
   *                 example: Summer Sale
   *               type:
   *                 type: string
   *                 example: Coupon
   *               code:
   *                 type: string
   *                 example: SUMMER2025
   *               link:
   *                 type: string
   *                 example: https://store.com/summer-deal
   *               description:
   *                 type: string
   *                 example: Get 20% off on all summer collection items.
   *               discountType:
   *                 type: string
   *                 example: Percentage
   *               discountValue:
   *                 type: number
   *                 example: 20
   *               validFrom:
   *                 type: string
   *                 example: 2025-06-01
   *               validTill:
   *                 type: string
   *                 example: 2025-06-30
   *               category:
   *                 type: string
   *                 example: Clothing
   *               applicableProducts:
   *                 type: array
   *                 items:
   *                   type: string
   *                 example: [productId1, productId2]
   *               termsAndConditions:
   *                 type: string
   *                 example: Valid on minimum purchase of $50.
   *               storeUrl:
   *                 type: string
   *                 example: https://store.com
   *               logo:
   *                 type: string
   *                 example: /uploads/CouponLogoImages/logo.png
   *               banner:
   *                 type: string
   *                 example: /uploads/CouponBannerImages/banner.png
   *               storeId:
   *                 type: string
   *                 example: 609e129e8a7b9a0015bfae6d
   *               status:
   *                 type: string
   *                 example: Active
   *               viewCount:
   *                 type: number
   *                 example: 0
   *       401:
   *         description: Unauthorized (vendor authentication required)
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: Unauthorized access.
   */
  getListOfCouponByVendorController,
  /**
   * @swagger
   * /vendor/coupon/{id}:
   *   patch:
   *     tags:
   *       - Coupon (Vendor)
   *     summary: Update a coupon or deal
   *     description: |
   *       Allows a vendor to update a coupon or deal.
   *       - You can update any field.
   *       - To update images, upload new files for `logo` and/or `banner`.
   *       - If a file is not sent, the existing image remains unchanged.
   *     consumes:
   *       - multipart/form-data
   *     produces:
   *       - application/json
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         type: string
   *         description: Coupon ID to update
   *       - in: header
   *         name: Authorization
   *         required: true
   *         type: string
   *         description: Bearer token for vendor authentication
   *       - in: formData
   *         name: title
   *         required: false
   *         type: string
   *         description: Coupon or deal title
   *       - in: formData
   *         name: type
   *         required: false
   *         type: string
   *         enum: [Coupon, Deal]
   *         description: Type of offer (Coupon or Deal)
   *       - in: formData
   *         name: code
   *         required: false
   *         type: string
   *         description: Required if type is Coupon
   *       - in: formData
   *         name: link
   *         required: false
   *         type: string
   *         description: Required if type is Deal
   *       - in: formData
   *         name: description
   *         required: false
   *         type: string
   *         description: Description of the coupon or deal
   *       - in: formData
   *         name: discountType
   *         required: false
   *         type: string
   *         enum: [Flat, Percentage, BOGO]
   *         description: Discount type
   *       - in: formData
   *         name: discountValue
   *         required: false
   *         type: number
   *         description: Discount value
   *       - in: formData
   *         name: validFrom
   *         required: false
   *         type: string
   *         format: date
   *         description: Start date (YYYY-MM-DD)
   *       - in: formData
   *         name: validTill
   *         required: false
   *         type: string
   *         format: date
   *         description: End date (YYYY-MM-DD)
   *       - in: formData
   *         name: category
   *         required: false
   *         type: string
   *         description: Coupon category
   *       - in: formData
   *         name: applicableProducts
   *         required: false
   *         type: array
   *         items:
   *           type: string
   *         description: List of applicable product IDs
   *       - in: formData
   *         name: termsAndConditions
   *         required: false
   *         type: string
   *         description: Terms and conditions
   *       - in: formData
   *         name: storeUrl
   *         required: false
   *         type: string
   *         description: Store URL
   *       - in: formData
   *         name: logo
   *         required: false
   *         type: file
   *         description: Coupon logo image file (optional, only if updating)
   *       - in: formData
   *         name: banner
   *         required: false
   *         type: file
   *         description: Coupon banner image file (optional, only if updating)
   *       - in: formData
   *         name: status
   *         required: false
   *         type: string
   *         enum: [Active, Expired, Draft]
   *         description: Coupon status
   *     responses:
   *       200:
   *         description: Coupon or deal updated successfully
   *         schema:
   *           type: object
   *           properties:
   *             _id:
   *               type: string
   *               example: 609e129e8a7b9a0015bfae6d
   *             title:
   *               type: string
   *               example: Summer Sale
   *             type:
   *               type: string
   *               example: Coupon
   *             code:
   *               type: string
   *               example: SUMMER2025
   *             link:
   *               type: string
   *               example: https://store.com/summer-deal
   *             description:
   *               type: string
   *               example: Get 20% off on all summer collection items.
   *             discountType:
   *               type: string
   *               example: Percentage
   *             discountValue:
   *               type: number
   *               example: 20
   *             validFrom:
   *               type: string
   *               example: 2025-06-01
   *             validTill:
   *               type: string
   *               example: 2025-06-30
   *             category:
   *               type: string
   *               example: Clothing
   *             applicableProducts:
   *               type: array
   *               items:
   *                 type: string
   *               example: [productId1, productId2]
   *             termsAndConditions:
   *               type: string
   *               example: Valid on minimum purchase of $50.
   *             storeUrl:
   *               type: string
   *               example: https://store.com
   *             logo:
   *               type: string
   *               example: /uploads/CouponImages/logo.png
   *             banner:
   *               type: string
   *               example: /uploads/CouponImages/banner.png
   *             storeId:
   *               type: string
   *               example: 609e129e8a7b9a0015bfae6d
   *             status:
   *               type: string
   *               example: Active
   *       400:
   *         description: Invalid request (missing required fields or validation error)
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: Invalid coupon ID.
   *       401:
   *         description: Unauthorized (vendor authentication required)
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: Unauthorized access.
   */
  editCouponByVendorController,
  /**
   * @swagger
   * /vendor/coupon/{id}:
   *   delete:
   *     tags:
   *       - Coupon (Vendor)
   *     summary: Delete a coupon or deal
   *     description: Deletes a coupon or deal by its ID. Requires vendor authentication.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         type: string
   *         description: Coupon ID to delete
   *       - in: header
   *         name: Authorization
   *         required: true
   *         type: string
   *         description: Bearer token for vendor authentication
   *     responses:
   *       200:
   *         description: Coupon or deal deleted successfully
   *         schema:
   *           type: object
   *           properties:
   *             message:
   *               type: string
   *               example: Coupon deleted successfully.
   *             deletedCoupon:
   *               type: object
   *               properties:
   *                 _id:
   *                   type: string
   *                   example: 609e129e8a7b9a0015bfae6d
   *                 title:
   *                   type: string
   *                   example: Summer Sale
   *                 type:
   *                   type: string
   *                   example: Coupon
   *                 code:
   *                   type: string
   *                   example: SUMMER2025
   *                 link:
   *                   type: string
   *                   example: https://store.com/summer-deal
   *                 description:
   *                   type: string
   *                   example: Get 20% off on all summer collection items.
   *                 discountType:
   *                   type: string
   *                   example: Percentage
   *                 discountValue:
   *                   type: number
   *                   example: 20
   *                 validFrom:
   *                   type: string
   *                   example: 2025-06-01
   *                 validTill:
   *                   type: string
   *                   example: 2025-06-30
   *                 category:
   *                   type: string
   *                   example: Clothing
   *                 applicableProducts:
   *                   type: array
   *                   items:
   *                     type: string
   *                   example: [productId1, productId2]
   *                 termsAndConditions:
   *                   type: string
   *                   example: Valid on minimum purchase of $50.
   *                 storeUrl:
   *                   type: string
   *                   example: https://store.com
   *                 logo:
   *                   type: string
   *                   example: /uploads/CouponImages/logo.png
   *                 banner:
   *                   type: string
   *                   example: /uploads/CouponImages/banner.png
   *                 storeId:
   *                   type: string
   *                   example: 609e129e8a7b9a0015bfae6d
   *                 status:
   *                   type: string
   *                   example: Active
   *       400:
   *         description: Invalid request (missing or invalid coupon ID)
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: Invalid coupon ID.
   *       401:
   *         description: Unauthorized (vendor authentication required)
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: Unauthorized access.
   *       404:
   *         description: Coupon not found
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: Coupon not found.
   */
  deleteCouponByVendorController,
  /**
   * @swagger
   * /store/coupons/{storeId}:
   *   get:
   *     tags:
   *       - Coupon (User)
   *     summary: Get all coupons for a store
   *     description: Returns a list of all coupons and deals for a given store.
   *     parameters:
   *       - in: path
   *         name: storeId
   *         required: true
   *         type: string
   *         description: Store ID to fetch coupons for
   *       - in: query
   *         name: pinCode
   *         required: false
   *         type: string
   *         description: Optional pin code to filter coupons
   *     responses:
   *       200:
   *         description: List of coupons for the store
   *         schema:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               _id:
   *                 type: string
   *                 example: 609e129e8a7b9a0015bfae6d
   *               title:
   *                 type: string
   *                 example: Summer Sale
   *               type:
   *                 type: string
   *                 example: Coupon
   *               code:
   *                 type: string
   *                 example: SUMMER2025
   *               link:
   *                 type: string
   *                 example: https://store.com/summer-deal
   *               description:
   *                 type: string
   *                 example: Get 20% off on all summer collection items.
   *               discountType:
   *                 type: string
   *                 example: Percentage
   *               discountValue:
   *                 type: number
   *                 example: 20
   *               validFrom:
   *                 type: string
   *                 example: 2025-06-01
   *               validTill:
   *                 type: string
   *                 example: 2025-06-30
   *               category:
   *                 type: string
   *                 example: Clothing
   *               applicableProducts:
   *                 type: array
   *                 items:
   *                   type: string
   *                 example: [productId1, productId2]
   *               termsAndConditions:
   *                 type: string
   *                 example: Valid on minimum purchase of $50.
   *               storeUrl:
   *                 type: string
   *                 example: https://store.com
   *               logo:
   *                 type: string
   *                 example: /uploads/CouponImages/logo.png
   *               banner:
   *                 type: string
   *                 example: /uploads/CouponImages/banner.png
   *               storeId:
   *                 type: string
   *                 example: 609e129e8a7b9a0015bfae6d
   *               status:
   *                 type: string
   *                 example: Active
   *       400:
   *         description: Invalid store ID
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: Invalid store ID.
   *       404:
   *         description: No coupons found for this store
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: No coupons found for this store.
   */
  getCouponsByStoreIdController,
  /**
   * @swagger
   * /category/coupons/{categoryId}:
   *   get:
   *     tags:
   *       - Coupon (User)
   *     summary: Get all coupons for a category
   *     description: Returns a list of all coupons and deals for a given category.
   *     parameters:
   *       - in: path
   *         name: categoryId
   *         required: true
   *         type: string
   *         description: Category ID to fetch coupons for
   *       - in: query
   *         name: pinCode
   *         required: false
   *         type: string
   *         description: Optional pin code to filter coupons
   *     responses:
   *       200:
   *         description: List of coupons for the category
   *         schema:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               _id:
   *                 type: string
   *                 example: 609e129e8a7b9a0015bfae6d
   *               title:
   *                 type: string
   *                 example: Summer Sale
   *               type:
   *                 type: string
   *                 example: Coupon
   *               code:
   *                 type: string
   *                 example: SUMMER2025
   *               link:
   *                 type: string
   *                 example: https://store.com/summer-deal
   *               description:
   *                 type: string
   *                 example: Get 20% off on all summer collection items.
   *               discountType:
   *                 type: string
   *                 example: Percentage
   *               discountValue:
   *                 type: number
   *                 example: 20
   *               validFrom:
   *                 type: string
   *                 example: 2025-06-01
   *               validTill:
   *                 type: string
   *                 example: 2025-06-30
   *               category:
   *                 type: string
   *                 example: Clothing
   *               applicableProducts:
   *                 type: array
   *                 items:
   *                   type: string
   *                 example: [productId1, productId2]
   *               termsAndConditions:
   *                 type: string
   *                 example: Valid on minimum purchase of $50.
   *               storeUrl:
   *                 type: string
   *                 example: https://store.com
   *               logo:
   *                 type: string
   *                 example: /uploads/CouponImages/logo.png
   *               banner:
   *                 type: string
   *                 example: /uploads/CouponImages/banner.png
   *               storeId:
   *                 type: string
   *                 example: 609e129e8a7b9a0015bfae6d
   *               status:
   *                 type: string
   *                 example: Active
   *       400:
   *         description: Invalid category ID
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: Invalid category ID.
   *       404:
   *         description: No coupons found for this category
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: No coupons found for this category.
   */
  getCouponsByCategoryIdController,
  /**
   * @swagger
   * /coupons/working:
   *   post:
   *     tags:
   *       - Coupon Working (User)
   *     summary: Submit coupon working feedback
   *     description: Allows a user to submit whether a coupon is working ("yes" or "no").
   *     security:
   *       - bearerAuth: []
   *     consumes:
   *       - application/json
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
   *             - message
   *           properties:
   *             couponId:
   *               type: string
   *               example: 609e129e8a7b9a0015bfae6d
   *             message:
   *               type: string
   *               enum: [yes, no]
   *               example: yes
   *     responses:
   *       200:
   *         description: Coupon working feedback saved successfully
   *         schema:
   *           type: object
   *           properties:
   *             _id:
   *               type: string
   *               example: 609e129e8a7b9a0015bfae6d
   *             couponId:
   *               type: string
   *               example: 609e129e8a7b9a0015bfae6d
   *             yes:
   *               type: array
   *               items:
   *                 type: string
   *               example: [609e129e8a7b9a0015bfae6d]
   *             no:
   *               type: array
   *               items:
   *                 type: string
   *               example: []
   *             createdAt:
   *               type: string
   *               example: 2025-06-01T12:00:00.000Z
   *             updatedAt:
   *               type: string
   *               example: 2025-06-01T12:00:00.000Z
   *       400:
   *         description: Invalid request
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: Invalid couponId or message.
   *       401:
   *         description: Unauthorized (user authentication required)
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: Unauthorized access.
   */
  saveCouponWorkingController,
  /**
   * @swagger
   * /coupons/working/{couponId}:
   *   get:
   *     tags:
   *       - Coupon Working (User)
   *     summary: Get coupon working feedback by coupon ID
   *     description: Returns the working feedback (yes/no counts and user IDs) for a given coupon.
   *     parameters:
   *       - in: path
   *         name: couponId
   *         required: true
   *         type: string
   *         description: Coupon ID to fetch working feedback for
   *     responses:
   *       200:
   *         description: Coupon working feedback found
   *         schema:
   *           type: object
   *           properties:
   *             _id:
   *               type: string
   *               example: 609e129e8a7b9a0015bfae6d
   *             couponId:
   *               type: string
   *               example: 609e129e8a7b9a0015bfae6d
   *             yes:
   *               type: array
   *               items:
   *                 type: string
   *               example: [609e129e8a7b9a0015bfae6d]
   *             no:
   *               type: array
   *               items:
   *                 type: string
   *               example: []
   *             createdAt:
   *               type: string
   *               example: 2025-06-01T12:00:00.000Z
   *             updatedAt:
   *               type: string
   *               example: 2025-06-01T12:00:00.000Z
   *       400:
   *         description: Invalid coupon ID
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: Invalid coupon ID.
   *       404:
   *         description: Coupon working feedback not found
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: No working feedback found for this coupon.
   */
  getCouponWorkingByCouponIdController,
  /**
   * @swagger
   * /coupon/comment:
   *   post:
   *     tags:
   *       - Coupon Comment (User)
   *     summary: Add a comment to a coupon
   *     description: Allows a user to add a comment to a specific coupon.
   *     security:
   *       - bearerAuth: []
   *     consumes:
   *       - application/json
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
   *             - name
   *             - comment
   *           properties:
   *             couponId:
   *               type: string
   *               example: 609e129e8a7b9a0015bfae6d
   *             name:
   *               type: string
   *               example: Alice
   *             comment:
   *               type: string
   *               example: Great deal!
   *     responses:
   *       200:
   *         description: Comment added successfully
   *         schema:
   *           type: object
   *           properties:
   *             _id:
   *               type: string
   *               example: 609e129e8a7b9a0015bfae6d
   *             couponId:
   *               type: string
   *               example: 609e129e8a7b9a0015bfae6d
   *             comments:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   name:
   *                     type: string
   *                     example: Alice
   *                   comment:
   *                     type: string
   *                     example: Great deal!
   *             createdAt:
   *               type: string
   *               example: 2025-06-01T12:00:00.000Z
   *             updatedAt:
   *               type: string
   *               example: 2025-06-01T12:00:00.000Z
   *       400:
   *         description: Invalid request
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: couponId, name, and comment are required.
   *       401:
   *         description: Unauthorized (user authentication required)
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: Unauthorized access.
   */
  saveCouponCommentController,
  /**
   * @swagger
   * /coupon/comment/{couponId}:
   *   get:
   *     tags:
   *       - Coupon Comment (User)
   *     summary: Get all comments for a coupon
   *     description: Returns all comments for a given coupon ID.
   *     parameters:
   *       - in: path
   *         name: couponId
   *         required: true
   *         type: string
   *         description: Coupon ID to fetch comments for
   *     responses:
   *       200:
   *         description: Comments found
   *         schema:
   *           type: object
   *           properties:
   *             _id:
   *               type: string
   *               example: 609e129e8a7b9a0015bfae6d
   *             couponId:
   *               type: string
   *               example: 609e129e8a7b9a0015bfae6d
   *             comments:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   name:
   *                     type: string
   *                     example: Alice
   *                   comment:
   *                     type: string
   *                     example: Great deal!
   *             createdAt:
   *               type: string
   *               example: 2025-06-01T12:00:00.000Z
   *             updatedAt:
   *               type: string
   *               example: 2025-06-01T12:00:00.000Z
   *       400:
   *         description: Invalid coupon ID
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: Invalid coupon ID.
   *       404:
   *         description: No comments found for this coupon
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: No comments found for this coupon.
   */
  getCouponCommentController,
  /**
   * @swagger
   * /coupon/store:
   *   post:
   *     tags:
   *       - Coupon Notify (User)
   *     summary: Add a notification email for a store
   *     description: Adds an email to the notification list for a given store. If the store doesn't exist, it creates a new entry.
   *     parameters:
   *       - in: body
   *         name: body
   *         description: Store ID and email to add
   *         required: true
   *         schema:
   *           type: object
   *           required:
   *             - storeId
   *             - email
   *           properties:
   *             storeId:
   *               type: string
   *               example: 664ff7e8c3b3e2e4a5d9e8a6
   *             email:
   *               type: string
   *               example: user@example.com
   *     responses:
   *       200:
   *         description: Email added successfully
   *         schema:
   *           type: object
   *           properties:
   *             _id:
   *               type: string
   *               example: 6650d8f7c3b3e2e4a5d9e8a7
   *             storeId:
   *               type: string
   *               example: 664ff7e8c3b3e2e4a5d9e8a6
   *             emails:
   *               type: array
   *               items:
   *                 type: string
   *               example: ["user@example.com", "another@example.com"]
   *             createdAt:
   *               type: string
   *               example: 2025-06-01T12:00:00.000Z
   *             updatedAt:
   *               type: string
   *               example: 2025-06-01T12:00:00.000Z
   *       400:
   *         description: Invalid input
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: storeId and email are required.
   *       500:
   *         description: Internal server error
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: An unexpected error occurred.
   */
  addNotifyCouponController,
  /**
   * @swagger
   * /home/coupons:
   *   get:
   *     tags:
   *       - Coupon (User)
   *     summary: Get all coupons for a given pin code
   *     description: Returns a list of coupons available for the specified pin code.
   *     parameters:
   *       - in: query
   *         name: pinCode
   *         required: false
   *         description: The pin code to search for coupons.
   *         schema:
   *           type: string
   *           example: "110001"
   *     responses:
   *       200:
   *         description: List of coupons for the given pin code
   *         schema:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               couponId:
   *                 type: string
   *                 example: 609e129e8a7b9a0015bfae6d
   *               title:
   *                 type: string
   *                 example: 20% off on all products
   *               description:
   *                 type: string
   *                 example: Get flat 20% discount on your order.
   *               storeId:
   *                 type: string
   *                 example: 664ff7e8c3b3e2e4a5d9e8a6
   *               validTill:
   *                 type: string
   *                 example: 2025-06-30T23:59:59.000Z
   *       404:
   *         description: No Coupon found for the given PinCode
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: No Coupon found for the given PinCode
   *       500:
   *         description: Internal server error
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: An unexpected error occurred.
   */
  getCouponsByPinCodeController,
  /**
   * @swagger
   * /home/deals:
   *   get:
   *     tags:
   *       - Deals (User)
   *     summary: Get all deals for a given pin code
   *     description: Returns a list of deals available for the specified pin code.
   *     parameters:
   *       - in: query
   *         name: pinCode
   *         required: false
   *         description: The pin code to search for deals.
   *         schema:
   *           type: string
   *           example: "110001"
   *     responses:
   *       200:
   *         description: List of deals for the given pin code
   *         schema:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               dealId:
   *                 type: string
   *                 example: 609e129e8a7b9a0015bfae6d
   *               title:
   *                 type: string
   *                 example: Buy 1 Get 1 Free
   *               description:
   *                 type: string
   *                 example: Buy one pizza and get another free.
   *               storeId:
   *                 type: string
   *                 example: 664ff7e8c3b3e2e4a5d9e8a6
   *               validTill:
   *                 type: string
   *                 example: 2025-06-30T23:59:59.000Z
   *       404:
   *         description: No Deal found for the given PinCode
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: No Deal found for the given PinCode
   *       500:
   *         description: Internal server error
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: An unexpected error occurred.
   */
  getDealsByPinCodeController,
  /**
   * @swagger
   * /home/deals-coupons:
   *   get:
   *     tags:
   *       - Deals and Coupons (User)
   *     summary: Get all deals and coupons for a given pin code
   *     description: Returns a combined list of deals and coupons available for the specified pin code.
   *     parameters:
   *       - in: query
   *         name: pinCode
   *         required: false
   *         description: The pin code to search for deals and coupons.
   *         schema:
   *           type: string
   *           example: "110001"
   *     responses:
   *       200:
   *         description: List of deals and coupons for the given pin code
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 matched:
   *                   type: array
   *                   items:
   *                     type: object
   *                   description: Matched deals and coupons filtered by pin code
   *                 panIndia:
   *                   type: array
   *                   items:
   *                     type: object
   *                   description: All deals and coupons (pan India)
   *       404:
   *         description: No deals or coupons found for the given pin code
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "No deals or coupons found for the given pin code."
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "An unexpected error occurred."
   */
  getDealsAndCouponByPinCodeController,
  /**
   * @swagger
   * /home/last/deals:
   *   get:
   *     tags:
   *       - Deals (User)
   *     summary: Get the most recent deals for a given pin code
   *     description: Returns the latest deals available for the specified pin code.
   *     parameters:
   *       - in: query
   *         name: pinCode
   *         required: false
   *         description: The pin code to search for the latest deals.
   *         schema:
   *           type: string
   *           example: "110001"
   *     responses:
   *       200:
   *         description: List of latest deals for the given pin code
   *         schema:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               dealId:
   *                 type: string
   *                 example: 609e129e8a7b9a0015bfae6d
   *               title:
   *                 type: string
   *                 example: Flash Sale 50% Off
   *               description:
   *                 type: string
   *                 example: Limited time offer on electronics.
   *               storeId:
   *                 type: string
   *                 example: 664ff7e8c3b3e2e4a5d9e8a6
   *               validTill:
   *                 type: string
   *                 example: 2025-06-30T23:59:59.000Z
   *       404:
   *         description: No recent deals found for this pin code
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: No recent deals found for this pin code
   *       500:
   *         description: Internal server error
   *         schema:
   *           type: object
   *           properties:
   *             error:
   *               type: string
   *               example: An unexpected error occurred.
   */
  getLastDealsController,
  /**
   * @swagger
   * /coupons:
   *   get:
   *     tags:
   *       - Coupon (User)
   *     summary: Get list of all available coupons
   *     description: Returns a list of all coupons available in the system.
   *     parameters:
   *       - in: query
   *         name: pinCode
   *         required: false
   *         description: Optional pin code to filter coupons by location.
   *         schema:
   *           type: string
   *           example: "110001"
   *     responses:
   *       200:
   *         description: List of all coupons
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   couponId:
   *                     type: string
   *                     example: 609e129e8a7b9a0015bfae6d
   *                   code:
   *                     type: string
   *                     example: SAVE50
   *                   description:
   *                     type: string
   *                     example: Get 50% off on your first order.
   *                   validTill:
   *                     type: string
   *                     example: 2025-06-30T23:59:59.000Z
   *                   discountType:
   *                     type: string
   *                     example: percentage
   *                   discountValue:
   *                     type: number
   *                     example: 50
   *       404:
   *         description: No coupons found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: No coupons found
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: An unexpected error occurred.
   */
  getListOfCouponsController,
  /**
   * @swagger
   * /coupon/{id}:
   *   get:
   *     tags:
   *       - Coupon (User)
   *     summary: Get coupon details by ID
   *     description: Returns the details of a specific coupon for the given coupon ID.
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: The unique ID of the coupon to retrieve.
   *         schema:
   *           type: string
   *           example: 609e129e8a7b9a0015bfae6d
   *     responses:
   *       200:
   *         description: Coupon details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 couponId:
   *                   type: string
   *                   example: 609e129e8a7b9a0015bfae6d
   *                 code:
   *                   type: string
   *                   example: SAVE50
   *                 description:
   *                   type: string
   *                   example: Get 50% off on your first order.
   *                 validTill:
   *                   type: string
   *                   example: 2025-06-30T23:59:59.000Z
   *                 discountType:
   *                   type: string
   *                   example: percentage
   *                 discountValue:
   *                   type: number
   *                   example: 50
   *       404:
   *         description: No Coupon found for the given ID
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: No Coupon found for the given ID
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: An unexpected error occurred.
   */
  getCouponByIdController,
};
