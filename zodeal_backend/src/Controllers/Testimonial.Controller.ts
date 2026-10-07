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
  getTestimonialsByStatusService,
  saveTestimonialService,
  updateTestimonialStatusService,
} from "../Services/Testimonial.Service.js";
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
const saveTestimonialController = async (req: Request, res: Response) => {
  try {
    const userName = (req as any).userName as string;
    const result = await saveTestimonialService(userName, req.body);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Testimonial added successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getTestimonialsByStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getTestimonialsByStatusService(req.params.status);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Testimonials fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const updateTestimonialStatusController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await updateTestimonialStatusService(
      req.params.id,
      req.body
    );
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Testimonial updated successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
export {
  /**
   * @swagger
   * /testimonial:
   *   post:
   *     tags:
   *       - Testimonial (User)
   *     summary: Submit a new testimonial
   *     description: Authenticated users can submit a testimonial with review and rating.
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
   *         description: Bearer token for  authentication
   *       - in: body
   *         name: body
   *         required: true
   *         description: Testimonial details
   *         schema:
   *           type: object
   *           properties:
   *             review:
   *               type: string
   *               example: "Great service!"
   *             rating:
   *               type: integer
   *               example: 5
   *     responses:
   *       200:
   *         description: Testimonial submitted successfully
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   */

  saveTestimonialController,
  /**
   * @swagger
   * /admin/testimonial/{id}:
   *   patch:
   *     tags:
   *       - Testimonial (Admin)
   *     summary: Update testimonial status (approve/reject)
   *     description: Admin can approve or reject a testimonial by ID.
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
   *         type: string
   *         required: true
   *         description: Testimonial ID
   *       - in: body
   *         name: body
   *         required: true
   *         description: Status update
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *               enum: [approved, rejected]
   *               example: approved
   *     responses:
   *       200:
   *         description: Testimonial status updated successfully
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Testimonial not found
   */
  getTestimonialsByStatusController,
  /**
   * @swagger
   * /testimonials/{status}:
   *   get:
   *     tags:
   *       - Testimonial (User Admin)
   *     summary: Get testimonials by status
   *     description: Returns a list of testimonials filtered by status (e.g., approved, pending, rejected).
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: status
   *         type: string
   *         required: true
   *         enum: [approved, request, rejected]
   *         description: Testimonial status to filter by
   *     responses:
   *       200:
   *         description: List of testimonials
   *       400:
   *         description: Bad request
   *       404:
   *         description: No testimonials found
   */
  updateTestimonialStatusController,
};
