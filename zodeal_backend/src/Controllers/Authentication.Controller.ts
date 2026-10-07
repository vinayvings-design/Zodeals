import { Request, Response } from "express";
import {
  forgotPasswordService,
  getDataForAdminDashboardService,
  getDataForVendorDashboardService,
  getListOfUserDetailsService,
  getListOfVendorDetailsService,
  getProfileService,
  getVendorChartService,
  loginService,
  saveAdminService,
  saveUserService,
  saveVendorService,
  sendCodeToEmailService,
  updateUserProfileService,
  updateVendorProfileService,
  verifyCodeService,
} from "../Services/Authentication.Service.js";
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

const saveAdminController = async (req: Request, res: Response) => {
  try {
    const result = await saveAdminService(req.body);
    return handleSuccessResponse(
      { statusCode: created, result },
      res,
      "Admin created successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const saveUserController = async (req: Request, res: Response) => {
  try {
    const result = await saveUserService(req.body);
    return handleSuccessResponse(
      { statusCode: created, result },
      res,
      "User created successfully."
    );
  } catch (error) {
    const err = error as any;
    if (err.code === 11000) {
      return handleErrorResponse(
        {
          errorCode: dataAlreadyExists,
          displayMessage: `${
            err.keyValue[Object.keys(err.keyValue)[0]]
          } already exists`,
        },
        res
      );
    }
    return handleControllerError(error as ErrorResponse, res);
  }
};

const saveVendorController = async (req: Request, res: Response) => {
  try {
    const result = await saveVendorService(req.body);
    return handleSuccessResponse(
      { statusCode: created, result },
      res,
      "Vendor created successfully."
    );
  } catch (error) {
    const err = error as any;
    if (err.code === 11000) {
      return handleErrorResponse(
        {
          errorCode: dataAlreadyExists,
          displayMessage: `${
            err.keyValue[Object.keys(err.keyValue)[0]]
          } already exists`,
        },
        res
      );
    }
    return handleControllerError(error as ErrorResponse, res);
  }
};
const loginController = async (req: Request, res: Response) => {
  try {
    const result = await loginService(req.body);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      `${result.role} login successfully.`
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const updateUserProfileController = async (req: Request, res: Response) => {
  try {
    const userName = (req as any).userName as string;
    const result = await updateUserProfileService(userName, req);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "User profile updated successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const updateVendorProfileController = async (req: Request, res: Response) => {
  try {
    const userName = (req as any).userName as string;
    const result = await updateVendorProfileService(userName, req);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Vendor profile updated successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getProfileController = async (req: Request, res: Response) => {
  try {
    const userName = (req as any).userName as string;
    const result = await getProfileService(userName);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Profile fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
//admin
const getDataForAdminDashboardController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getDataForAdminDashboardService();
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Dashboard data fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getListOfUserDetailsController = async (req: Request, res: Response) => {
  try {
    const result = await getListOfUserDetailsService();
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "List of user data fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getListOfVendorDetailsController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getListOfVendorDetailsService();
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "List of vendor data fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const getDataForVendorDashboardController = async (
  req: Request,
  res: Response
) => {
  try {
    const userName = (req as any).userName as string;
    const result = await getDataForVendorDashboardService(userName);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Dashboard data fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};

const getVendorChartController = async (req: Request, res: Response) => {
  try {
    const result = await getVendorChartService();
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Vendor chart data fetched successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const sendCodeToEmailController = async (req: Request, res: Response) => {
  try {
    const result = await sendCodeToEmailService(req.body);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Code send to email successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const verifyCodeController = async (req: Request, res: Response) => {
  try {
    const result = await verifyCodeService(req.body);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Email verified successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const result = await forgotPasswordService(req.body);
    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Email verified successfully."
    );
  } catch (error) {
    return handleControllerError(error as ErrorResponse, res);
  }
};
export {
  /**
   * @swagger
   * tags:
   *   - name: Authentication
   *     description: API for managing admin operations
   *
   * /admin:
   *   post:
   *     summary: Create a new admin
   *     description: This API allows you to create a new admin.
   *     tags:
   *       - Authentication
   *     parameters:
   *       - in: body
   *         name: adminDetails
   *         description: The details of the admin to be created
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             name:
   *               type: string
   *               description: "The name of the admin."
   *               example: "Admin"
   *             email:
   *               type: string
   *               description: "The email of the admin."
   *               example: "Aptapace2024@gmail.com"
   *             password:
   *               type: string
   *               description: "The password of the admin."
   *               example: "Apta@2024"
   *     responses:
   *       201:
   *         description: Admin successfully created
   *       400:
   *         description: Bad request, invalid input
   *       500:
   *         description: Internal server error
   */
  saveAdminController,
  /**
   * @swagger
   * /user:
   *   post:
   *     summary: Create a new user
   *     description: This API allows you to create a new user.
   *     tags:
   *       - Authentication
   *     parameters:
   *       - in: body
   *         name: userDetails
   *         description: The details of the user to be created
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             name:
   *               type: string
   *               description: The name of the user.
   *               example: "John Doe"
   *             email:
   *               type: string
   *               description: The email of the user.
   *               example: "john@example.com"
   *             password:
   *               type: string
   *               description: The password of the user.
   *               example: "User@2024"
   *     responses:
   *       201:
   *         description: User successfully created
   *       400:
   *         description: Bad request, invalid input
   *       500:
   *         description: Internal server error
   */
  saveUserController,
  /**
   * @swagger
   * /vendor:
   *   post:
   *     summary: Create a new vendor
   *     description: This API allows you to create a new vendor.
   *     tags:
   *       - Authentication
   *     parameters:
   *       - in: body
   *         name: vendorDetails
   *         description: The details of the vendor to be created
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             name:
   *               type: string
   *               description: The name of the vendor.
   *               example: "Vendor Name"
   *             email:
   *               type: string
   *               description: The email of the vendor.
   *               example: "vendor@example.com"
   *             phoneNumber:
   *               type: string
   *               description: The phone number of the vendor.
   *               example: "9876543210"
   *             businessName:
   *               type: string
   *               description: The business name of the vendor.
   *               example: "Vendor Business"
   *             password:
   *               type: string
   *               description: The password of the vendor.
   *               example: "Vendor@2024"
   *     responses:
   *       201:
   *         description: Vendor successfully created
   *       400:
   *         description: Bad request, invalid input
   *       500:
   *         description: Internal server error
   */
  saveVendorController,
  /**
   * @swagger
   * tags:
   *   - name: Authentication
   *     description: API for managing login for all user types (admin, user, vendor)
   *
   * /login:
   *   post:
   *     summary: User login
   *     description: This API allows an admin, user, or vendor to log in.
   *     tags:
   *       - Authentication
   *     parameters:
   *       - in: body
   *         name: body
   *         description: Login credentials
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             email:
   *               type: string
   *               description: The email of the user.
   *               example: Aptapace2024@gmail.com
   *             password:
   *               type: string
   *               description: The password of the user.
   *               example: Apta@2024
   *             # Uncomment if your API expects a role field
   *             # role:
   *             #   type: string
   *             #   description: The role of the user (admin, user, vendor)
   *             #   example: admin
   *     responses:
   *       200:
   *         description: Successfully logged in
   *       400:
   *         description: Bad request, invalid input
   *       401:
   *         description: Unauthorized, invalid credentials
   *       500:
   *         description: Internal server error
   */
  loginController,
  /**
   * @swagger
   * /user:
   *   patch:
   *     summary: Update user profile
   *     description: Update the authenticated user's profile information.
   *     tags:
   *       - Authentication
   *     consumes:
   *       - multipart/form-data
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         type: string
   *         description: Bearer token for user authentication
   *       - in: formData
   *         name: profile
   *         type: file
   *         description: User profile image (optional)
   *       - in: formData
   *         name: name
   *         type: string
   *         description: Updated name of the user
   *         required: false
   *         example: "John Doe"
   *       - in: formData
   *         name: email
   *         type: string
   *         description: Updated email of the user
   *         required: false
   *         example: "john@example.com"
   *       - in: formData
   *         name: password
   *         type: string
   *         description: Updated password of the user
   *         required: false
   *         example: "User@2025"
   *     responses:
   *       200:
   *         description: User profile updated successfully
   *       400:
   *         description: Bad request, invalid input
   *       401:
   *         description: Unauthorized, authentication required
   *       500:
   *         description: Internal server error
   */
  updateUserProfileController,
  /**
   * @swagger
   * /vendor:
   *   patch:
   *     summary: Update vendor profile
   *     description: Update the authenticated vendor's profile information.
   *     tags:
   *       - Authentication
   *     consumes:
   *       - multipart/form-data
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         type: string
   *         description: Bearer token for vendor authentication
   *       - in: formData
   *         name: profile
   *         type: file
   *         description: Vendor profile image (optional)
   *       - in: formData
   *         name: name
   *         type: string
   *         description: Updated name of the vendor
   *         required: false
   *         example: "Vendor Name"
   *       - in: formData
   *         name: email
   *         type: string
   *         description: Updated email of the vendor
   *         required: false
   *         example: "vendor@example.com"
   *       - in: formData
   *         name: phoneNumber
   *         type: string
   *         description: Updated phone number of the vendor
   *         required: false
   *         example: "9876543210"
   *       - in: formData
   *         name: businessName
   *         type: string
   *         description: Updated business name of the vendor
   *         required: false
   *         example: "Vendor Business"
   *       - in: formData
   *         name: password
   *         type: string
   *         description: Updated password of the vendor
   *         required: false
   *         example: "Vendor@2025"
   *     responses:
   *       200:
   *         description: Vendor profile updated successfully
   *       400:
   *         description: Bad request, invalid input
   *       401:
   *         description: Unauthorized, authentication required
   *       500:
   *         description: Internal server error
   */
  updateVendorProfileController,
  /**
   * @swagger
   * /profile:
   *   get:
   *     summary: Get current user or vendor profile
   *     description: Retrieve the profile details of the authenticated user or vendor.
   *     tags:
   *       - Authentication
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: header
   *         name: Authorization
   *         required: true
   *         type: string
   *         description: Bearer token for vendor or user authentication
   *     responses:
   *       200:
   *         description: Successfully retrieved profile information
   *         schema:
   *           $ref: '#/definitions/Profile'
   *       401:
   *         description: Unauthorized, authentication required
   *       500:
   *         description: Internal server error
   *
   * definitions:
   *   Profile:
   *     type: object
   *     properties:
   *       _id:
   *         type: string
   *         example: "6650d8e2b6c4e9b8e7d2f7a1"
   *       name:
   *         type: string
   *         example: "John Doe"
   *       email:
   *         type: string
   *         example: "john@example.com"
   *       profile:
   *         type: string
   *         example: "/uploads/UserImages/profile.jpg"
   *       phoneNumber:
   *         type: string
   *         example: "9876543210"
   *       businessName:
   *         type: string
   *         example: "Vendor Business"
   */
  getProfileController,
  /**
   * @swagger
   * /admin/dashboard:
   *   get:
   *     summary: Get admin dashboard data
   *     description: Retrieve statistics and data for the admin dashboard.
   *     tags:
   *       - Admin Section
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
   *         description: Successfully retrieved admin dashboard data
   *         schema:
   *           type: object
   *           properties:
   *             totalUsers:
   *               type: integer
   *               example: 150
   *             totalVendors:
   *               type: integer
   *               example: 30
   *             totalPosts:
   *               type: integer
   *               example: 200
   *             recentActivities:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   activity:
   *                     type: string
   *                     example: "Vendor registered"
   *                   date:
   *                     type: string
   *                     format: date-time
   *                     example: "2024-05-12T10:30:00Z"
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       500:
   *         description: Internal server error
   */
  getDataForAdminDashboardController,
  /**
   * @swagger
   * /admin/users:
   *   get:
   *     summary: Get list of users
   *     description: Retrieve a list of all users (admin only).
   *     tags:
   *       - Admin Section
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
   *         description: Successfully retrieved user list
   *         schema:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               _id:
   *                 type: string
   *                 example: "60c72b2f9b1d8e6f88f0c9e1"
   *               name:
   *                 type: string
   *                 example: "John Doe"
   *               email:
   *                 type: string
   *                 example: "john@example.com"
   *               createdAt:
   *                 type: string
   *                 format: date-time
   *               updatedAt:
   *                 type: string
   *                 format: date-time
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       500:
   *         description: Internal server error
   */
  getListOfUserDetailsController,
  /**
   * @swagger
   * /admin/vendors:
   *   get:
   *     summary: Get list of vendors
   *     description: Retrieve a list of all vendors (admin only).
   *     tags:
   *       - Admin Section
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
   *         description: Successfully retrieved vendor list
   *         schema:
   *           type: array
   *           items:
   *             type: object
   *             properties:
   *               _id:
   *                 type: string
   *                 example: "60c72b2f9b1d8e6f88f0c9e2"
   *               name:
   *                 type: string
   *                 example: "Vendor Name"
   *               email:
   *                 type: string
   *                 example: "vendor@example.com"
   *               businessName:
   *                 type: string
   *                 example: "Vendor Business"
   *               phoneNumber:
   *                 type: string
   *                 example: "9876543210"
   *               createdAt:
   *                 type: string
   *                 format: date-time
   *               updatedAt:
   *                 type: string
   *                 format: date-time
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       500:
   *         description: Internal server error
   */
  getListOfVendorDetailsController,
  /**
   * @swagger
   * /vendor/dashboard:
   *   get:
   *     summary: Get vendor dashboard data
   *     description: Retrieve statistics and data for the vendor dashboard.
   *     tags:
   *       - Vendor Section
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
   *         description: Successfully retrieved vendor dashboard data
   *         schema:
   *           type: object
   *           properties:
   *             totalCouponsAdded:
   *               type: integer
   *               example: 45
   *             activeCoupons:
   *               type: integer
   *               example: 30
   *             expiredCoupons:
   *               type: integer
   *               example: 15
   *             totalViews:
   *               type: integer
   *               example: 1200
   *             totalClicks:
   *               type: integer
   *               example: 300
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       500:
   *         description: Internal server error
   */
  getDataForVendorDashboardController,
  /**
   * @swagger
   * /admin/vendor/chart:
   *   get:
   *     summary: Get vendor chart data
   *     description: Retrieve statistics for vendors, including total vendors, new registrations, active coupons, and expired coupons.
   *     tags:
   *       - Admin Section
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
   *         description: Successfully retrieved vendor chart data
   *         schema:
   *           type: object
   *           properties:
   *             totalVendor:
   *               type: integer
   *               description: Total number of vendors
   *               example: 42
   *             newRegistration:
   *               type: integer
   *               description: Number of new vendor registrations
   *               example: 5
   *             activeCoupon:
   *               type: integer
   *               description: Number of active coupons
   *               example: 12
   *             expiredCoupon:
   *               type: integer
   *               description: Number of expired coupons
   *               example: 3
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       500:
   *         description: Internal server error
   */
  getVendorChartController,
  /**
   * @swagger
   * /email/code:
   *   post:
   *     summary: Send verification code to email
   *     description: Sends a verification code to the specified email address.
   *     tags:
   *       - Email Verification
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: body
   *         required: true
   *         schema:
   *           type: object
   *           required:
   *             - email
   *           properties:
   *             email:
   *               type: string
   *               format: email
   *               example: "user@example.com"
   *             tag:
   *               type: string
   *               example: "register"
   *     responses:
   *       200:
   *         description: Code sent successfully
   *         schema:
   *           type: object
   *           properties:
   *             message:
   *               type: string
   *               example: "Verification code sent to email."
   *       400:
   *         description: Invalid email address
   *       500:
   *         description: Internal server error
   */
  sendCodeToEmailController,
  /**
   * @swagger
   * /email/verify:
   *   post:
   *     summary: Verify email code
   *     description: Verifies the code sent to the user's email address.
   *     tags:
   *       - Email Verification
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: body
   *         required: true
   *         schema:
   *           type: object
   *           required:
   *             - email
   *             - code
   *           properties:
   *             email:
   *               type: string
   *               format: email
   *               example: "user@example.com"
   *             code:
   *               type: number
   *               example: 123456
   *             tag:
   *               type: string
   *               example: "register"
   *     responses:
   *       200:
   *         description: Code verified successfully
   *         schema:
   *           type: object
   *           properties:
   *             message:
   *               type: string
   *               example: "Email verified successfully."
   *       400:
   *         description: Invalid code or email
   *       500:
   *         description: Internal server error
   */
  verifyCodeController,
  /**
   * @swagger
   * /forgot/password:
   *   post:
   *     summary: Reset password
   *     description: Allows the user to reset their password using their user ID and new password.
   *     tags:
   *       - Authentication
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: body
   *         required: true
   *         schema:
   *           type: object
   *           required:
   *             - userId
   *             - password
   *           properties:
   *             userId:
   *               type: string
   *               example: "60d0fe4f5311236168a109ca"
   *             password:
   *               type: string
   *               format: password
   *               example: "NewSecurePassword123!"
   *     responses:
   *       200:
   *         description: Password reset successfully
   *         schema:
   *           type: object
   *           properties:
   *             message:
   *               type: string
   *               example: "Password has been reset successfully."
   *       400:
   *         description: Invalid user ID or password
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */
  forgotPasswordController,
};
