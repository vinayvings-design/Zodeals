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
import { AgentService } from "../Services/Agent.Service.js";
const handleControllerError = (error: any, res: Response) => {
  console.log(error);

  if (error.statusCode) {
    return handleErrorResponse(
      {
        errorCode: error.statusCode,
        displayMessage: error.message,
      },
      res
    );
  }

  return handleErrorResponse(
    {
      errorCode: serverError,
      displayMessage: "Internal Server Error",
    },
    res
  );
};

const save = async (req: Request, res: Response) => {
  try {
    const result = await AgentService.save(req.body);
    return handleSuccessResponse(
      { statusCode: created, result },
      res,
      "Agent added successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const update = async (req: Request, res: Response) => {
  try {
    const result = await AgentService.update(req.params.id, req.body);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Agent updated successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const viewAll = async (req: Request, res: Response) => {
  try {
    const result = await AgentService.viewAll(req.query);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Agent fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const deleteById = async (req: Request, res: Response) => {
  try {
    const result = await AgentService.deleteById(req.params.id);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Agent deleted successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getAllTransaction = async (req: Request, res: Response) => {
  try {
    const result = await AgentService.getAllTransaction();
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Agent transaction fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
export const AgentController = {
  /**
   * @swagger
   * definitions:
   *   Agent:
   *     type: object
   *     properties:
   *       _id:
   *         type: string
   *         description: MongoDB ObjectId
   *         example: "652f6bcd12c245e83fc1b004"
   *       name:
   *         type: string
   *         example: "Amit Kumar"
   *       phoneNumber:
   *         type: string
   *         example: "9876543210"
   *       code:
   *         type: string
   *         example: "AGT1002"
   *       marketingAmount:
   *         type: number
   *         example: 5000
   *       vendorDetails:
   *         type: array
   *         description: Optional list of vendor information
   *         items:
   *           type: object
   *           properties:
   *             name:
   *               type: string
   *               example: "Vendor ABC Pvt Ltd"
   *             amount:
   *               type: number
   *               example: 2000
   *       createdAt:
   *         type: string
   *         format: date-time
   *         example: "2025-10-12T08:10:00.000Z"
   *       updatedAt:
   *         type: string
   *         format: date-time
   *         example: "2025-10-12T08:11:00.000Z"
   */
  /**
   * @swagger
   * /admin/agent:
   *   post:
   *     tags:
   *       - Agent Management
   *     summary: Add a new agent
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         type: string
   *         description: Bearer token for admin authentication
   *       - in: body
   *         name: agent
   *         description: Agent to be added
   *         required: true
   *         schema:
   *           type: object
   *           required:
   *             - name
   *             - phoneNumber
   *             - code
   *           properties:
   *             name:
   *               type: string
   *               example: "Amit Kumar"
   *             phoneNumber:
   *               type: string
   *               example: "9876543210"
   *             code:
   *               type: string
   *               example: "AGT1002"
   *     responses:
   *       201:
   *         description: Agent added successfully
   *         schema:
   *           $ref: '#/definitions/Agent'
   *       400:
   *         description: Invalid input data
   *       401:
   *         description: Unauthorized - Admin access required
   *       500:
   *         description: Internal server error
   */

  save,
  /**
   * @swagger
   * /admin/agents:
   *   get:
   *     tags:
   *       - Agent Management
   *     summary: View all agents, optionally filter by code
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         type: string
   *         description: Bearer token for admin authentication
   *       - in: query
   *         name: code
   *         type: string
   *         required: false
   *         description: Filter agents by their code
   *     responses:
   *       200:
   *         description: Returns list of agent objects
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Agent'
   *       401:
   *         description: Unauthorized - Admin access required
   *       500:
   *         description: Internal server error
   */
  viewAll,
  /**
   * @swagger
   * /admin/agent/{id}:
   *   patch:
   *     tags:
   *       - Agent Management
   *     summary: Update existing agent details
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
   *         type: string
   *         required: true
   *         description: Agent document ID (MongoDB ObjectId)
   *       - in: body
   *         name: agent
   *         description: Fields to update
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             name:
   *               type: string
   *               example: "Amit Kumar"
   *             phoneNumber:
   *               type: string
   *               example: "9876543210"
   *             code:
   *               type: string
   *               example: "AGT1002"
   *     responses:
   *       200:
   *         description: Agent updated successfully
   *         schema:
   *           $ref: '#/definitions/Agent'
   *       400:
   *         description: Invalid update data
   *       401:
   *         description: Unauthorized - Admin access required
   *       404:
   *         description: Agent not found
   *       500:
   *         description: Internal server error
   */
  update,
  /**
   * @swagger
   * /admin/agent/{id}:
   *   delete:
   *     tags:
   *       - Agent Management
   *     summary: delete agent by id
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
   *         type: string
   *         required: true
   *         description: Agent document ID (MongoDB ObjectId
   *     responses:
   *       200:
   *         description: Returns list of agent objects
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Agent'
   *       401:
   *         description: Unauthorized - Admin access required
   *       500:
   *         description: Internal server error
   */
  deleteById,
  /**
   * @swagger
   * definitions:
   *   AgentTHistory:
   *     type: object
   *     properties:
   *       _id:
   *         type: string
   *         description: MongoDB ObjectId
   *         example: "652f6bcd12c245e83fc1b004"
   *       agentId:
   *         type: string
   *         description: Agent ObjectId
   *         example: "652f6bcd12c245e83fc1b005"
   *       vendorId:
   *         type: string
   *         description: Vendor ObjectId
   *         example: "652f6bcd12c245e83fc1b006"
   *       couponCount:
   *         type: number
   *         example: 10
   *       amount:
   *         type: number
   *         example: 5000
   *       createdAt:
   *         type: string
   *         format: date-time
   *         example: "2025-10-12T08:10:00.000Z"
   *       updatedAt:
   *         type: string
   *         format: date-time
   *         example: "2025-10-12T08:11:00.000Z"
   */

  /**
   * @swagger
   * /admin/agent/transaction:
   *   get:
   *     tags:
   *       - Agent Management
   *     summary: Get all agent transactions
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         type: string
   *         description: Bearer token for admin authentication
   *     responses:
   *       200:
   *         description: Returns list of agent transactions
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/AgentTHistory'
   *       401:
   *         description: Unauthorized - Admin access required
   *       500:
   *         description: Internal server error
   */
  getAllTransaction,
};
