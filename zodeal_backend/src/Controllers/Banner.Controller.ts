import { Request, Response } from "express";
import { created, serverError, successCode } from "../../commons/Utils/StatusCode.js";
import {
  handleSuccessResponse,
  handleErrorResponse,
} from "../../commons/Response/Response.js";
import { ErrorResponse } from "../../commons/Interfaces/ErrorResponse.interface.js";
import {
  deleteBannerService,
  getActiveBannersService,
  getAllBannersService,
  saveBannerService,
  updateBannerService,
} from "../Services/Banner.Service.js";

const handleControllerError = (error: ErrorResponse, res: Response) => {
  if (error.errorCode) {
    return handleErrorResponse(error, res);
  }
  return handleErrorResponse(
    { errorCode: serverError, displayMessage: "Internal Server Error" },
    res
  );
};

/**
 * @swagger
 * /admin/banner:
 *   post:
 *     summary: Add a hero banner
 *     description: Admin adds a hero banner (slide) shown at the top of the home page.
 *     tags:
 *       - Banner (Admin)
 *     security:
 *       - BearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *       - in: formData
 *         name: headline
 *         type: string
 *         required: true
 *       - in: formData
 *         name: accentText
 *         type: string
 *         description: Part of the headline to highlight
 *       - in: formData
 *         name: badge
 *         type: string
 *       - in: formData
 *         name: subtitle
 *         type: string
 *       - in: formData
 *         name: primaryLabel
 *         type: string
 *       - in: formData
 *         name: primaryLink
 *         type: string
 *       - in: formData
 *         name: secondaryLabel
 *         type: string
 *       - in: formData
 *         name: secondaryLink
 *         type: string
 *       - in: formData
 *         name: theme
 *         type: string
 *         enum: [orange, purple, blue]
 *       - in: formData
 *         name: isActive
 *         type: boolean
 *       - in: formData
 *         name: order
 *         type: number
 *     responses:
 *       201:
 *         description: Banner added successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
const saveBannerController = async (req: Request, res: Response) => {
  try {
    const result = await saveBannerService({ file: req.file, body: req.body });
    return handleSuccessResponse(
      { statusCode: created, result },
      res,
      "Banner added successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};

/**
 * @swagger
 * /admin/banner/{id}:
 *   patch:
 *     summary: Update a hero banner
 *     description: Admin updates any banner field and/or replaces its image.
 *     tags:
 *       - Banner (Admin)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Banner updated successfully
 *       404:
 *         description: Banner not found
 */
const updateBannerController = async (req: Request, res: Response) => {
  try {
    const result = await updateBannerService(req.params.id, {
      file: req.file,
      body: req.body,
    });
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Banner updated successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};

/**
 * @swagger
 * /admin/banner/{id}:
 *   delete:
 *     summary: Delete a hero banner
 *     tags:
 *       - Banner (Admin)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Banner deleted successfully
 *       404:
 *         description: Banner not found
 */
const deleteBannerController = async (req: Request, res: Response) => {
  try {
    const result = await deleteBannerService(req.params.id);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Banner deleted successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};

/**
 * @swagger
 * /admin/banners:
 *   get:
 *     summary: List all hero banners (including inactive)
 *     tags:
 *       - Banner (Admin)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Banners fetched successfully
 */
const getAllBannersController = async (req: Request, res: Response) => {
  try {
    const result = await getAllBannersService();
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Banners fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};

/**
 * @swagger
 * /banners:
 *   get:
 *     summary: Get active hero banners
 *     description: Public. Returns active home page banners in display order. Empty list when none are configured.
 *     tags:
 *       - Banner (Admin Vendor User)
 *     responses:
 *       200:
 *         description: Banners fetched successfully
 */
const getActiveBannersController = async (req: Request, res: Response) => {
  try {
    const result = await getActiveBannersService();
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Banners fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};

export {
  saveBannerController,
  updateBannerController,
  deleteBannerController,
  getAllBannersController,
  getActiveBannersController,
};
