import { Request, Response } from "express";
import { serverError, successCode } from "../../commons/Utils/StatusCode.js";
import {
  handleSuccessResponse,
  handleErrorResponse,
} from "../../commons/Response/Response.js";
import { ErrorResponse } from "../../commons/Interfaces/ErrorResponse.interface.js";
import { getPlanModeService, setPlanModeService } from "../Services/Settings.Service.js";

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
 * /plan-mode:
 *   get:
 *     summary: Get the platform plan mode (free or paid)
 *     tags:
 *       - Settings
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current plan mode
 */
const getPlanModeController = async (req: Request, res: Response) => {
  try {
    const planMode = await getPlanModeService();
    return handleSuccessResponse(
      { statusCode: successCode, result: { planMode } },
      res,
      "Plan mode fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};

/**
 * @swagger
 * /admin/plan-mode:
 *   put:
 *     summary: Set the platform plan mode (admin)
 *     tags:
 *       - Settings (Admin)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               planMode:
 *                 type: string
 *                 enum: [free, paid]
 *     responses:
 *       200:
 *         description: Plan mode updated
 */
const setPlanModeController = async (req: Request, res: Response) => {
  try {
    const planMode = await setPlanModeService(req.body?.planMode);
    return handleSuccessResponse(
      { statusCode: successCode, result: { planMode } },
      res,
      "Plan mode updated successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};

export { getPlanModeController, setPlanModeController };
