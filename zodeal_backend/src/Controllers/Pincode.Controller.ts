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
import { PincodeService } from "../Services/Pincode.Service.js";
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
const savePinCode = async (req: Request, res: Response) => {
  try {
    const result = await PincodeService.savePincode(req.body);
    return handleSuccessResponse(
      { statusCode: created, result },
      res,
      "Pincode added successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getPinCode = async (req: Request, res: Response) => {
  try {
    const result = await PincodeService.getPincode();
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Pincode fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getAllCitiesByState = async (req: Request, res: Response) => {
  try {
    const result = await PincodeService.getAllCitiesByState(
      req.params.stateName
    );
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "cities fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
export const PincodeController = {
  savePinCode,
  /**
   * @swagger
   * /pincode:
   *   get:
   *     summary: Get a list of all pin codes
   *     tags:
   *       - Location
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of all pin codes
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *             example: "500081"
   *       500:
   *         description: Internal server error
   */
  getPinCode,
  /**
   * @swagger
   * /state/cities/{stateName}:
   *   get:
   *     summary: Get all cities by state name
   *     tags:
   *       - Location
   *     parameters:
   *       - in: path
   *         name: stateName
   *         description: Name of the state
   *         required: true
   *         type: string
   *         example: "Telangana"
   *     responses:
   *       200:
   *         description: List of cities in the given state
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *             example: "Hyderabad"
   *       400:
   *         description: Invalid state name
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       500:
   *         description: Internal server error
   */
  getAllCitiesByState,
};
