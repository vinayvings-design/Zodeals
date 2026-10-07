// import { Request, Response } from "express";
// import {
//   created,
//   serverError,
//   successCode,
// } from "../../commons/Utils/StatusCode.js";
// import {
//   handleSuccessResponse,
//   handleErrorResponse,
// } from "../../commons/Response/Response.js";
// import { ErrorResponse } from "../../commons/Interfaces/ErrorResponse.interface.js";
// import {
//   createOrderService,
//   getPaymentDetailsByPaymentIdService,
//   getPaymentHistoryOfUserService,
//   getPaymentHistoryService,
//   verifyPaymentService,
// } from "../Services/Payment.Service.js";
// const handleControllerError = (error: ErrorResponse, res: Response) => {
//   if (error.errorCode) {
//     return handleErrorResponse(error, res);
//   }
//   return handleErrorResponse(
//     {
//       errorCode: serverError,
//       displayMessage: "Internal Server Error",
//     },
//     res
//   );
// };
// const createOrder = async (req: Request, res: Response) => {
//   try {
//     const result = await createOrderService(req.body);
//     res.status(200).json({ data: result });
//     // return handleSuccessResponse(
//     //   { statusCode: created, result },
//     //   res,
//     //   "Order created successfully."
//     // );
//   } catch (error) {
//     return handleControllerError(error as ErrorResponse, res);
//   }
// };
// const verifyPayment = async (req: Request, res: Response) => {
//   try {
//     const userName = (req as any).userName as string;
//     const result = await verifyPaymentService(userName, req.body);
//     return handleSuccessResponse(
//       { statusCode: successCode, result },
//       res,
//       "Payment successfully."
//     );
//   } catch (error) {
//     return handleControllerError(error as ErrorResponse, res);
//   }
// };
// const getPaymentHistory = async (req: Request, res: Response) => {
//   try {
//     const result = await getPaymentHistoryService();
//     return handleSuccessResponse(
//       { statusCode: successCode, result },
//       res,
//       "Payment history fetched successfully."
//     );
//   } catch (error) {
//     return handleControllerError(error as ErrorResponse, res);
//   }
// };
// const getPaymentHistoryOfUser = async (req: Request, res: Response) => {
//   try {
//     const userName = (req as any).userName as string;
//     const result = await getPaymentHistoryOfUserService(userName);
//     return handleSuccessResponse(
//       { statusCode: successCode, result },
//       res,
//       "Payment history fetched successfully."
//     );
//   } catch (error) {
//     return handleControllerError(error as ErrorResponse, res);
//   }
// };
// const getPaymentDetailsByPaymentId = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const result = await getPaymentDetailsByPaymentIdService(
//       req.params.razorpay_payment_id
//     );
//     return handleSuccessResponse(
//       { statusCode: successCode, result },
//       res,
//       "Payment details fetched successfully."
//     );
//   } catch (error) {
//     return handleControllerError(error as ErrorResponse, res);
//   }
// };
// export {
//   /**
//    * @swagger
//    * /create-order:
//    *   post:
//    *     summary: Create a new order (payment intent)
//    *     tags:
//    *       - Payment Gateway
//    *     security:
//    *       - BearerAuth: []
//    *     requestBody:
//    *       required: true
//    *       content:
//    *         application/json:
//    *           schema:
//    *             type: object
//    *             required:
//    *               - amount
//    *             properties:
//    *               amount:
//    *                 type: number
//    *                 description: Order amount
//    *                 example: 1500
//    *     responses:
//    *       201:
//    *         description: Order/payment intent created successfully
//    *         content:
//    *           application/json:
//    *             schema:
//    *               type: object
//    *               properties:
//    *                 orderId:
//    *                   type: string
//    *                   description: Created order ID
//    *                   example: "ord_1234567890"
//    *                 amount:
//    *                   type: number
//    *                   description: Order amount
//    *                   example: 1500
//    *                 status:
//    *                   type: string
//    *                   description: Status of the order/payment intent
//    *                   example: "created"
//    *       400:
//    *         description: Invalid request data
//    *       401:
//    *         description: Unauthorized - Invalid or missing token
//    *       500:
//    *         description: Internal server error
//    */
//   createOrder,
//   /**
//    * @swagger
//    * /verify-payment:
//    *   post:
//    *     summary: Verify a payment with Razorpay credentials
//    *     tags:
//    *       - Payment Gateway
//    *     security:
//    *       - BearerAuth: []
//    *     requestBody:
//    *       required: true
//    *       content:
//    *         application/json:
//    *           schema:
//    *             type: object
//    *             required:
//    *               - razorpay_order_id
//    *               - razorpay_payment_id
//    *               - razorpay_signature
//    *             properties:
//    *               razorpay_order_id:
//    *                 type: string
//    *                 description: Razorpay order ID
//    *                 example: "order_Jl1A2B3C4D"
//    *               razorpay_payment_id:
//    *                 type: string
//    *                 description: Razorpay payment ID
//    *                 example: "pay_Jl1A2B3C4D"
//    *               razorpay_signature:
//    *                 type: string
//    *                 description: Razorpay signature
//    *                 example: "abcdef1234567890"
//    *     responses:
//    *       200:
//    *         description: Payment successfully verified
//    *         content:
//    *           application/json:
//    *             schema:
//    *               type: object
//    *               properties:
//    *                 statusCode:
//    *                   type: integer
//    *                   example: 200
//    *                 result:
//    *                   type: object
//    *                   description: Payment verification result
//    *       400:
//    *         description: Invalid request data
//    *       401:
//    *         description: Unauthorized - Invalid or missing token
//    *       500:
//    *         description: Internal server error
//    */
//   verifyPayment,
//   /**
//    * @swagger
//    * /payment-history:
//    *   get:
//    *     summary: Get payment history for the currently authenticated admin or staff
//    *     tags:
//    *       - Payment Gateway
//    *     security:
//    *       - BearerAuth: []
//    *     responses:
//    *       200:
//    *         description: List of payment history records
//    *       401:
//    *         description: Unauthorized - Invalid or missing token
//    *       500:
//    *         description: Internal server error
//    */
//   getPaymentHistory,
//   /**
//    * @swagger
//    * /user/payment-history:
//    *   get:
//    *     summary: Get payment history for the currently authenticated user
//    *     tags:
//    *       - Payment Gateway
//    *     security:
//    *       - BearerAuth: []
//    *     responses:
//    *       200:
//    *         description: List of payment history records for the user
//    *       401:
//    *         description: Unauthorized - Invalid or missing token
//    *       500:
//    *         description: Internal server error
//    */
//   getPaymentHistoryOfUser,
//   /**
//    * @swagger
//    * /payment-details/{razorpay_payment_id}:
//    *   get:
//    *     summary: Get payment details by Razorpay payment ID
//    *     tags:
//    *       - Payment Gateway
//    *     parameters:
//    *       - in: path
//    *         name: razorpay_payment_id
//    *         required: true
//    *         schema:
//    *           type: string
//    *         description: The Razorpay payment ID for which to fetch details
//    *     responses:
//    *       200:
//    *         description: Payment details for the specified Razorpay payment ID
//    *       400:
//    *         description: Invalid Razorpay payment ID or request
//    *       404:
//    *         description: Payment not found
//    *       500:
//    *         description: Internal server error
//    */
//   getPaymentDetailsByPaymentId,
// };


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
  createOrderService,
  getCouponPaymentHistoryService,
  getPaymentDetailsByPaymentIdService,
  getPaymentHistoryOfUserService,
  getPaymentHistoryService,
  verifyPaymentCouponService,
  verifyPaymentService,
} from "../Services/Payment.Service.js";
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
const createOrder = async (req: Request, res: Response) => {
  try {
    const result = await createOrderService(req.body);
    res.status(200).json({ data: result });
    // return handleSuccessResponse(
    //   { statusCode: created, result },
    //   res,
    //   "Order created successfully."
    // );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const verifyPayment = async (req: Request, res: Response) => {
  try {
    const userName = (req as any).userName as string;
    const result = await verifyPaymentService(userName, req.body);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Payment successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const verifyPaymentCoupon = async (req: Request, res: Response) => {
  try {
    console.log('====================================');
    console.log(req.body);
    console.log('====================================');
    const userName = (req as any).userName as string;
    const result = await verifyPaymentCouponService(userName, req.body);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Payment successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getCouponPaymentHistory = async (req: Request, res: Response) => {
  try {
    const userName = (req as any).userName as string;
    const result = await getCouponPaymentHistoryService(userName);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Payment history fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const result = await getPaymentHistoryService();
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Payment history fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getPaymentHistoryOfUser = async (req: Request, res: Response) => {
  try {
    const userName = (req as any).userName as string;
    const result = await getPaymentHistoryOfUserService(userName);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Payment history fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getPaymentDetailsByPaymentId = async (req: Request, res: Response) => {
  try {
    const result = await getPaymentDetailsByPaymentIdService(
      req.params.razorpay_payment_id
    );
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Payment details fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
export {
  /**
   * @swagger
   * tags:
   *   - name: Payment Gateway
   *     description: Payment processing APIs
   *
   * definitions:
   *   Order:
   *     type: object
   *     properties:
   *       orderId:
   *         type: string
   *         description: Created order ID
   *         example: "ord_1234567890"
   *       amount:
   *         type: number
   *         description: Order amount
   *         example: 1500
   *       status:
   *         type: string
   *         description: Status of the order
   *         example: "created"
   *
   *   PaymentVerification:
   *     type: object
   *     properties:
   *       statusCode:
   *         type: integer
   *         example: 200
   *       result:
   *         type: object
   *         description: Payment verification result
   */

  /**
   * @swagger
   * /create-order:
   *   post:
   *     summary: Create a new order (payment intent)
   *     tags:
   *       - Payment Gateway
   *     security:
   *       - BearerAuth: []
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         type: string
   *         description: Bearer token for authentication
   *       - in: body
   *         name: body
   *         required: true
   *         schema:
   *           type: object
   *           required:
   *             - amount
   *           properties:
   *             amount:
   *               type: number
   *               description: Order amount
   *               example: 1500
   *     responses:
   *       201:
   *         description: Order/payment intent created successfully
   *         schema:
   *           $ref: '#/definitions/Order'
   *       400:
   *         description: Invalid request data
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       500:
   *         description: Internal server error
   */
  createOrder,

  /**
   * @swagger
   * /verify-payment:
   *   post:
   *     summary: Verify a payment with Razorpay credentials
   *     tags:
   *       - Payment Gateway
   *     security:
   *       - BearerAuth: []
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         type: string
   *         description: Bearer token for authentication
   *       - in: body
   *         name: body
   *         required: true
   *         schema:
   *           type: object
   *           required:
   *             - razorpay_order_id
   *             - razorpay_payment_id
   *             - razorpay_signature
   *           properties:
   *             razorpay_order_id:
   *               type: string
   *               description: Razorpay order ID
   *               example: "order_Jl1A2B3C4D"
   *             razorpay_payment_id:
   *               type: string
   *               description: Razorpay payment ID
   *               example: "pay_Jl1A2B3C4D"
   *             razorpay_signature:
   *               type: string
   *               description: Razorpay signature
   *               example: "abcdef1234567890"
   *             couponsIds:
   *               type: array
   *               description: List of coupon IDs applied to the order
   *               items:
   *                 type: string
   *               example:
   *                - "coupon123"
   *                - "coupon456"
   *     responses:
   *       200:
   *         description: Payment successfully verified
   *         schema:
   *           $ref: '#/definitions/PaymentVerification'
   *       400:
   *         description: Invalid request data
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       500:
   *         description: Internal server error
   */
  verifyPayment,
  /**
   * @swagger
   * /verify-payment-coupon:
   *   post:
   *     summary: Verify a payment with Razorpay credentials
   *     tags:
   *       - Payment Gateway
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         type: string
   *         description: Bearer token for authentication
   *       - in: body
   *         name: body
   *         description: Razorpay verification fields
   *         required: true
   *         schema:
   *           type: object
   *           required:
   *             - razorpay_order_id
   *             - razorpay_payment_id
   *             - razorpay_signature
   *           properties:
   *             razorpay_order_id:
   *               type: string
   *               example: "order_Jl1A2B3C4D"
   *             razorpay_payment_id:
   *               type: string
   *               example: "pay_Jl1A2B3C4D"
   *             razorpay_signature:
   *               type: string
   *               example: "abcdef1234567890"
   *             couponId:
   *               type: array
   *               items:
   *                 type: string
   *               example: ["coupon1234", "coupon1235"]
   *             tag:
   *               type: string
   *               enum: [single, double, threeToFour, fiveToTen, fullCity, fullState, twoState, panIndia]
   *               example: "single"
   *             state:
   *               type: array
   *               items:
   *                 type: string
   *               example: ["Assam"]
   *             city:
   *               type: array
   *               items:
   *                 type: string
   *               example: ["abc", "cdf"]
   *             pinCode:
   *               type: array
   *               items:
   *                 type: string
   *               example: ["123456", "123456"]
   *             agentCode:
   *               type: string
   *               example: "AGT1002" 
   *     responses:
   *       200:
   *         description: Payment successfully verified
   *       400:
   *         description: Invalid request data
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       500:
   *         description: Internal server error
   */
  verifyPaymentCoupon,
  /**
   * @swagger
   * /payment-history:
   *   get:
   *     summary: Get payment history for the currently authenticated admin or staff
   *     tags:
   *       - Payment Gateway
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
   *         description: List of payment history records
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       500:
   *         description: Internal server error
   */
  getPaymentHistory,
  /**
   * @swagger
   * /coupon/payment-history:
   *   get:
   *     summary: Get coupon payment history for authenticated vendor
   *     tags:
   *       - Payment Gateway
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         type: string
   *         description: Bearer token for vendor authentication
   *     responses:
   *       200:
   *         description: List of coupon payment history records
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       500:
   *         description: Internal server error
   */
  getCouponPaymentHistory,
  // /**
  //  * @swagger
  //  * /user/payment-history:
  //  *   get:
  //  *     summary: Get payment history for the currently authenticated user
  //  *     tags:
  //  *       - Payment Gateway
  //  *     security:
  //  *       - BearerAuth: []
  //  *     responses:
  //  *       200:
  //  *         description: List of payment history records for the user
  //  *       401:
  //  *         description: Unauthorized - Invalid or missing token
  //  *       500:
  //  *         description: Internal server error
  //  */
  // getPaymentHistoryOfUser,
  // /**
  //  * @swagger
  //  * /payment-details/{razorpay_payment_id}:
  //  *   get:
  //  *     summary: Get payment details by Razorpay payment ID
  //  *     tags:
  //  *       - Payment Gateway
  //  *     parameters:
  //  *       - in: path
  //  *         name: razorpay_payment_id
  //  *         required: true
  //  *         schema:
  //  *           type: string
  //  *         description: The Razorpay payment ID for which to fetch details
  //  *     responses:
  //  *       200:
  //  *         description: Payment details for the specified Razorpay payment ID
  //  *       400:
  //  *         description: Invalid Razorpay payment ID or request
  //  *       404:
  //  *         description: Payment not found
  //  *       500:
  //  *         description: Internal server error
  //  */
  // getPaymentDetailsByPaymentId,
};
