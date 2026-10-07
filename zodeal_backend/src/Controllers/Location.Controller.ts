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
  findAllDistrictsByStateService,
  findAllSatesService,
  saveLocationService,
} from "../Services/Location.Service.js";
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
const saveLocationController = async (req: Request, res: Response) => {
  try {
    const result = await saveLocationService(req.body);
    return handleSuccessResponse(
      { statusCode: created, result },
      res,
      "Location saved successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const findAllSatesController = async (req: Request, res: Response) => {
  try {
    const result = await findAllSatesService();
    return handleSuccessResponse(
      { statusCode: created, result },
      res,
      "List of  states fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const findAllDistrictsByStateController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await findAllDistrictsByStateService(req.params.state);
    return handleSuccessResponse(
      { statusCode: created, result },
      res,
      "List of  districts fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
export {
  saveLocationController,
  /**
   * @swagger
   * /location/states:
   *   get:
   *     tags:
   *       - Location
   *     summary: Get all states
   *     description: Returns a list of all available states.
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: List of states
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *           example: ["Maharashtra", "Karnataka", "Tamil Nadu"]
   *       500:
   *         description: Server error
   */
  findAllSatesController,

  /**
   * @swagger
   * /location/districts/{state}:
   *   get:
   *     tags:
   *       - Location
   *     summary: Get districts by state
   *     description: Returns a list of districts for the specified state.
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: state
   *         type: string
   *         required: true
   *         description: Name of the state to get districts for
   *     responses:
   *       200:
   *         description: List of districts for the specified state
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *           example: ["Mumbai", "Pune", "Nagpur"]
   *       400:
   *         description: Invalid state parameter
   *       404:
   *         description: State not found
   *       500:
   *         description: Server error
   */
  findAllDistrictsByStateController,
};
