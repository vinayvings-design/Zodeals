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
  deleteProductService,
  getAllProductService,
  getProductService,
  saveProductService,
  updateProductService,
} from "../Services/Product.Service.js";
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
const saveProductController = async (req: Request, res: Response) => {
  try {
    const result = await saveProductService(req);
    return handleSuccessResponse(
      { statusCode: created, result },
      res,
      "Product added successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const updateProductController = async (req: Request, res: Response) => {
  try {
    const result = await updateProductService(req.params.id, req);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Product updated successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const deleteProductController = async (req: Request, res: Response) => {
  try {
    const result = await deleteProductService(req.params.id);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Product deleted successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getAllProductController = async (req: Request, res: Response) => {
  try {
    const result = await getAllProductService();
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Products fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getProductController = async (req: Request, res: Response) => {
  try {
    const result = await getProductService(req.params.id);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Product fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
export {
  /**
   * @swagger
   * tags:
   *   - name: Product (Admin)
   *     description: Product management APIs
   *
   * definitions:
   *   Product:
   *     type: object
   *     properties:
   *       _id:
   *         type: string
   *         example: "6650b2b5f2c6c2e2b8e9adf3"
   *       image:
   *         type: string
   *         description: URL of the product image
   *         example: "https://example.com/images/product1.jpg"
   *       description:
   *         type: string
   *         example: "A stylish summer dress"
   *       price:
   *         type: number
   *         example: 499.99
   *       link:
   *         type: string
   *         example: "https://example.com/product/123"
   *       discountPercentage:
   *         type: number
   *         example: 15
   */
  /**
   * @swagger
   * /admin/product:
   *   post:
   *     summary: Create a new product
   *     tags:
   *       - Product (Admin)
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
   *         name: image
   *         type: file
   *         required: false
   *         description: Product image file
   *       - in: formData
   *         name: description
   *         type: string
   *         required: true
   *       - in: formData
   *         name: price
   *         type: number
   *         required: true
   *       - in: formData
   *         name: link
   *         type: string
   *         required: true
   *       - in: formData
   *         name: discountPercentage
   *         type: number
   *         required: true
   *     responses:
   *       201:
   *         description: Product created successfully
   *         schema:
   *           $ref: '#/definitions/Product'
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   */
  saveProductController,

  /**
   * @swagger
   * /admin/product/{id}:
   *   patch:
   *     summary: Update an existing product
   *     tags:
   *       - Product (Admin)
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
   *         description: Product ID
   *       - in: formData
   *         name: image
   *         type: file
   *         required: false
   *         description: Product image file
   *       - in: formData
   *         name: description
   *         type: string
   *         required: false
   *       - in: formData
   *         name: price
   *         type: number
   *         required: false
   *       - in: formData
   *         name: link
   *         type: string
   *         required: false
   *       - in: formData
   *         name: discountPercentage
   *         type: number
   *         required: false
   *     responses:
   *       200:
   *         description: Product updated successfully
   *         schema:
   *           $ref: '#/definitions/Product'
   *       400:
   *         description: Bad request
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Product not found
   */
  updateProductController,
  /**
   * @swagger
   * /admin/product/{id}:
   *   delete:
   *     summary: Delete a product
   *     tags:
   *       - Product (Admin)
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
   *         description: Product ID
   *     responses:
   *       200:
   *         description: Product deleted successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Product not found
   */
  deleteProductController,

  /**
   * @swagger
   * /products:
   *   get:
   *     summary: Get all products
   *     tags:
   *       - Product (Admin, User)
   *     responses:
   *       200:
   *         description: A list of products
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Product'
   */
  getAllProductController,
  /**
   * @swagger
   * /product/{id}:
   *   get:
   *     summary: Get a product by ID
   *     tags:
   *       - Product (Admin, User)
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         type: string
   *         description: Product ID
   *     responses:
   *       200:
   *         description: Product details
   *         schema:
   *           $ref: '#/definitions/Product'
   *       404:
   *         description: Product not found
   */
  getProductController,
};
