import { Request, Response } from "express";
import {
  created,
  serverError,
  successCode,
} from "../../commons/Utils/StatusCode.js";
import {
  handleSuccessResponse,
  handleErrorResponse,
} from "../../commons/Response/Response.js";
import { ErrorResponse } from "../../commons/Interfaces/ErrorResponse.interface.js";
import {
  getContactUsService,
  saveContactUsService,
  updateContactUsService,
} from "../Services/ContactUs.Service.js";
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
const saveContactUsController = async (req: Request, res: Response) => {
  try {
    const result = await saveContactUsService(req.body);
    return handleSuccessResponse(
      { statusCode: created, result },
      res,
      "Contact details added successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getContactUsController = async (req: Request, res: Response) => {
  try {
    const result = await getContactUsService();
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Contact us fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const updateContactUsController = async (req: Request, res: Response) => {
  try {
    const result = await updateContactUsService(req.params.id, req.body);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Contact us updated successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
export {
  /**
   * @swagger
   * /admin/contact-us:
   *   post:
   *     tags:
   *       - Contact Us (Admin)
   *     summary: Save contact us details
   *     description: Allows admin to save contact us information like email, phone numbers, social links, and location.
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
   *         description: Contact us information
   *         schema:
   *           type: object
   *           required:
   *             - email
   *             - primaryNumber
   *             - location
   *           properties:
   *             email:
   *               type: string
   *               example: contact@example.com
   *             primaryNumber:
   *               type: number
   *               example: 9876543210
   *             secondaryNumber:
   *               type: number
   *               example: 9123456789
   *             location:
   *               type: string
   *               example: 123, Main Street, Bangalore
   *             instagram:
   *               type: string
   *               example: https://instagram.com/example
   *             facebook:
   *               type: string
   *               example: https://facebook.com/example
   *             twitter:
   *               type: string
   *               example: https://twitter.com/example
   *             linkedIn:
   *               type: string
   *               example: https://linkedin.com/company/example
   *     responses:
   *       200:
   *         description: Contact us information saved successfully
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   */
  saveContactUsController,

  /**
   * @swagger
   * /admin/contact-us/{id}:
   *   patch:
   *     tags:
   *       - Contact Us (Admin)
   *     summary: Update contact us details
   *     description: Allows admin to update existing contact us information.
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
   *       - in: path
   *         name: id
   *         required: true
   *         type: string
   *         description: ID of the contact us document to update
   *       - in: body
   *         name: body
   *         required: true
   *         description: Contact us fields to update
   *         schema:
   *           type: object
   *           properties:
   *             email:
   *               type: string
   *               example: contact@example.com
   *             primaryNumber:
   *               type: number
   *               example: 9876543210
   *             secondaryNumber:
   *               type: number
   *               example: 9123456789
   *             location:
   *               type: string
   *               example: 123, Main Street, Bangalore
   *             instagram:
   *               type: string
   *               example: https://instagram.com/example
   *             facebook:
   *               type: string
   *               example: https://facebook.com/example
   *             twitter:
   *               type: string
   *               example: https://twitter.com/example
   *             linkedIn:
   *               type: string
   *               example: https://linkedin.com/company/example
   *     responses:
   *       200:
   *         description: Contact us information updated successfully
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Contact us entry not found
   */
  updateContactUsController,

  /**
   * @swagger
   * /contact-us:
   *   get:
   *     tags:
   *       - Contact Us (Admin User)
   *     summary: Get contact us information
   *     description: Returns the contact us information visible to the public.
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Contact us data retrieved successfully
   *         schema:
   *           type: object
   *           properties:
   *             email:
   *               type: string
   *             primaryNumber:
   *               type: number
   *             secondaryNumber:
   *               type: number
   *             location:
   *               type: string
   *             instagram:
   *               type: string
   *             facebook:
   *               type: string
   *             twitter:
   *               type: string
   *             linkedIn:
   *               type: string
   *       404:
   *         description: Contact us information not found
   */
  getContactUsController,
};
