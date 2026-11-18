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
  getListOfStoresService,
  getStoreByVendorService,
  saveStoreService,
  updateStoreByVendorService,
} from "../Services/Store.Service.js";
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
const saveStoreController = async (req: Request, res: Response) => {
  try {
    const userName = (req as any).userName as string;
    const result = await saveStoreService(userName, req);
    return handleSuccessResponse(
      { statusCode: created, result },
      res,
      "Store data saved successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getStoreByVendorController = async (req: Request, res: Response) => {
  try {
    const userName = (req as any).userName as string;
    const result = await getStoreByVendorService(userName);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Store data fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const updateStoreByVendorController = async (req: Request, res: Response) => {
  try {
    const userName = (req as any).userName as string;
    const result = await updateStoreByVendorService(userName, req);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Stores data updated successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getListOfStoresController = async (req: Request, res: Response) => {
  try {
    const pinCode = req.query.pinCode as string | undefined;
    const result = await getListOfStoresService(pinCode);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Stores data fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
export {
  /**
   * @swagger
   * /vendor/store:
   *   post:
   *     tags:
   *       - Store (Vendor)
   *     summary: Create a new store for the authenticated vendor
   *     description: Allows a vendor to create a new store. Supports logo image upload.
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
   *         name: name
   *         type: string
   *         required: true
   *         description: Store name
   *       - in: formData
   *         name: logo
   *         type: file
   *         required: false
   *         description: Store logo image
   *       - in: formData
   *         name: description
   *         type: string
   *         required: false
   *         description: Store description
   *       - in: formData
   *         name: contactName
   *         type: string
   *         required: true
   *         description: Contact person's name
   *       - in: formData
   *         name: contactEmail
   *         type: string
   *         required: true
   *         description: Contact email address
   *       - in: formData
   *         name: phoneNumber
   *         type: string
   *         required: false
   *         description: Contact phone number
   *       - in: formData
   *         name: socialMediaLinks[facebook]
   *         type: string
   *         required: false
   *         description: Facebook link
   *       - in: formData
   *         name: socialMediaLinks[instagram]
   *         type: string
   *         required: false
   *         description: Instagram link
   *       - in: formData
   *         name: socialMediaLinks[twitter]
   *         type: string
   *         required: false
   *         description: Twitter link
   *       - in: formData
   *         name: address
   *         type: string
   *         required: false
   *         description: Store address
   *       - in: formData
   *         name: country
   *         type: string
   *         required: false
   *         description: Country name
   *       - in: formData
   *         name: states[]
   *         type: array
   *         items:
   *           type: string
   *         collectionFormat: multi
   *         required: false
   *         description: List of states
   *       - in: formData
   *         name: districts[]
   *         type: array
   *         items:
   *           type: string
   *         collectionFormat: multi
   *         required: false
   *         description: List of districts
   *     responses:
   *       201:
   *         description: Store created successfully
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   */

  saveStoreController,
  /**
   * @swagger
   * /vendor/store:
   *   get:
   *     tags:
   *       - Store (Vendor)
   *     summary: Get the store details for the authenticated vendor
   *     description: Returns the store information for the authenticated vendor.
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
   *     responses:
   *       200:
   *         description: Store details
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Store not found
   */
  getStoreByVendorController,
  /**
   * @swagger
   * /vendor/store:
   *   patch:
   *     tags:
   *       - Store (Vendor)
   *     summary: Update the store details for the authenticated vendor
   *     description: Allows a vendor to update their store information. Supports logo image upload.
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
   *         name: name
   *         type: string
   *         required: false
   *         description: Store name
   *       - in: formData
   *         name: logo
   *         type: file
   *         required: false
   *         description: Store logo image
   *       - in: formData
   *         name: description
   *         type: string
   *         required: false
   *         description: Store description
   *       - in: formData
   *         name: contactName
   *         type: string
   *         required: false
   *         description: Contact person's name
   *       - in: formData
   *         name: contactEmail
   *         type: string
   *         required: false
   *         description: Contact email address
   *       - in: formData
   *         name: phoneNumber
   *         type: string
   *         required: false
   *         description: Contact phone number
   *       - in: formData
   *         name: socialMediaLinks[facebook]
   *         type: string
   *         required: false
   *         description: Facebook link
   *       - in: formData
   *         name: socialMediaLinks[instagram]
   *         type: string
   *         required: false
   *         description: Instagram link
   *       - in: formData
   *         name: socialMediaLinks[twitter]
   *         type: string
   *         required: false
   *         description: Twitter link
   *       - in: formData
   *         name: address
   *         type: string
   *         required: false
   *         description: Store address
   *       - in: formData
   *         name: country
   *         type: string
   *         required: false
   *         description: Country name
   *       - in: formData
   *         name: states[]
   *         type: array
   *         items:
   *           type: string
   *         collectionFormat: multi
   *         required: false
   *         description: List of states
   *       - in: formData
   *         name: districts[]
   *         type: array
   *         items:
   *           type: string
   *         collectionFormat: multi
   *         required: false
   *         description: List of districts
   *     responses:
   *       200:
   *         description: Store updated successfully
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Store not found
   */
  updateStoreByVendorController,
  /**
   * @swagger
   * /stores:
   *   get:
   *     tags:
   *       - Store (User)
   *     summary: Get a list of stores by pin code
   *     description: Returns a list of stores for the specified pin code.
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: query
   *         name: pinCode
   *         required: false
   *         schema:
   *           type: string
   *         description: The pin code to filter stores by
   *     responses:
   *       200:
   *         description: List of stores
   */
  getListOfStoresController,
};
