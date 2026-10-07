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
  deleteCategoryService,
  getCategoryService,
  saveCategoryService,
  updateCategoryService,
} from "../Services/Category.Service.js";
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
const saveCategoryController = async (req: Request, res: Response) => {
  try {
    const result = await saveCategoryService({
      file: req.file,
      body: req.body,
    });
    return handleSuccessResponse(
      { statusCode: created, result },
      res,
      "Category added successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const updateCategoryController = async (req: Request, res: Response) => {
  try {
    const result = await updateCategoryService(req.params.id, req);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Category updated successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const deleteCategoryController = async (req: Request, res: Response) => {
  try {
    const result = await deleteCategoryService(req.params.id);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Category deleted successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getCategoryController = async (req: Request, res: Response) => {
  try {
    const result = await getCategoryService();
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Categories fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
export {
  /**
   * @swagger
   * /admin/category:
   *   post:
   *     summary: Add a new category
   *     description: Admin can add a new category with an image.
   *     tags:
   *       - Category (Admin)
   *     security:
   *       - BearerAuth: []
   *     consumes:
   *       - multipart/form-data
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         type: string
   *         description: Bearer token for admin authentication
   *       - in: formData
   *         name: title
   *         type: string
   *         required: true
   *         description: Category title
   *       - in: formData
   *         name: image
   *         type: file
   *         required: true
   *         description: Category image file
   *     responses:
   *       201:
   *         description: Category added successfully
   *       400:
   *         description: Bad request, invalid input
   *       401:
   *         description: Unauthorized, invalid or missing token
   *       500:
   *         description: Internal server error
   */

  saveCategoryController,
  /**
   * @swagger
   * /admin/category/{id}:
   *   patch:
   *     summary: Update a category
   *     description: Admin can update a category's details or image.
   *     tags:
   *       - Category (Admin)
   *     security:
   *       - BearerAuth: []
   *     consumes:
   *       - multipart/form-data
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
   *         description: Category ID
   *       - in: formData
   *         name: title
   *         type: string
   *         required: false
   *         description: Category title
   *       - in: formData
   *         name: image
   *         type: file
   *         required: false
   *         description: Category image file
   *     responses:
   *       200:
   *         description: Category updated successfully
   *       400:
   *         description: Bad request, invalid input
   *       401:
   *         description: Unauthorized, invalid or missing token
   *       404:
   *         description: Category not found
   *       500:
   *         description: Internal server error
   */
  updateCategoryController,
  /**
   * @swagger
   * /admin/category/{id}:
   *   delete:
   *     summary: Delete a category
   *     description: Admin can delete a category.
   *     tags:
   *       - Category (Admin)
   *     security:
   *       - BearerAuth: []
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
   *         description: Category ID
   *     responses:
   *       200:
   *         description: Category deleted successfully
   *       401:
   *         description: Unauthorized, invalid or missing token
   *       404:
   *         description: Category not found
   *       500:
   *         description: Internal server error
   */
  deleteCategoryController,
  /**
   * @swagger
   * /category:
   *   get:
   *     summary: Get all categories
   *     description: Retrieve a list of all categories. Accessible by users, vendors, and admins.
   *     tags:
   *       - Category (Admin Vendor User)
   *     responses:
   *       200:
   *         description: Successfully retrieved categories
   *         schema:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               _id:
   *                 type: string
   *                 example: "60c72b2f9b1d8e6f88f0c9e3"
   *               title:
   *                 type: string
   *                 example: "Electronics"
   *               image:
   *                 type: string
   *                 example: "/uploads/CategoryImages/electronics.jpg"
   *               createdAt:
   *                 type: string
   *                 format: date-time
   *               updatedAt:
   *                 type: string
   *                 format: date-time
   *       500:
   *         description: Internal server error
   */
  getCategoryController,
};
