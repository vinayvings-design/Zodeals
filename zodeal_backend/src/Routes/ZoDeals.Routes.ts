import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import {
  forgotPasswordController,
  getDataForAdminDashboardController,
  getDataForVendorDashboardController,
  getListOfUserDetailsController,
  getListOfVendorDetailsController,
  getProfileController,
  getVendorChartController,
  loginController,
  saveAdminController,
  saveUserController,
  saveVendorController,
  sendCodeToEmailController,
  updateUserProfileController,
  updateVendorProfileController,
  verifyCodeController,
} from "../Controllers/Authentication.Controller.js";
import { adminAuth, auth, userAuth, vendorAuth } from "../Middleware/Auth.js";
import {
  deleteCategoryController,
  getCategoryController,
  saveCategoryController,
  updateCategoryController,
} from "../Controllers/Category.Controller.js";
import { dynamicUpload, createStorage } from "../Middleware/Upload.js";
import {
  getNotificationCountController,
  getNotificationsByUserIdController,
  sendNotificationController,
} from "../Controllers/Notification.Controller.js";
import {
  getTestimonialsByStatusController,
  saveTestimonialController,
  updateTestimonialStatusController,
} from "../Controllers/Testimonial.Controller.js";
import {
  getListOfStoresController,
  getStoreByVendorController,
  saveStoreController,
  updateStoreByVendorController,
} from "../Controllers/Store.Controller.js";
import {
  addNotifyCouponController,
  deleteCouponByVendorController,
  editCouponByVendorController,
  getCouponByIdController,
  getCouponCommentController,
  getCouponPriceController,
  getCouponsByCategoryIdController,
  getCouponsByPinCodeController,
  getCouponsByStoreIdController,
  getCouponWorkingByCouponIdController,
  getDealsAndCouponByPinCodeController,
  getDealsByPinCodeController,
  getLastDealsController,
  getListOfCouponByVendorController,
  getListOfCouponsController,
  saveCouponCommentController,
  saveCouponController,
  saveCouponPriceController,
  saveCouponWorkingController,
} from "../Controllers/Coupon.Controller.js";
import {
  addCouponWishlistController,
  deleteWishlistCouponController,
  viewWishlistCouponController,
} from "../Controllers/Wishlist.Controller.js";
import {
  findAllDistrictsByStateController,
  findAllSatesController,
  saveLocationController,
} from "../Controllers/Location.Controller.js";
import {
  deleteProductController,
  getAllProductController,
  getProductController,
  saveProductController,
  updateProductController,
} from "../Controllers/Product.Controller.js";
import { getContactUsController, saveContactUsController, updateContactUsController } from "../Controllers/ContactUs.Controller.js";
import { createOrder, getCouponPaymentHistory, getPaymentHistory, verifyPayment, verifyPaymentCoupon } from "../Controllers/Payment.Controller.js";
import { PincodeController } from "../Controllers/Pincode.Controller.js";
import { AgentController } from "../Controllers/Agent.Controller.js";
const router = express.Router();
function handleLogoAndBannerUploads(
  req: Request,
  res: Response,
  next: NextFunction
) {
  dynamicUpload("logo", "CouponLogoImages", false)(req, res, function (err) {
    if (err) return next(err);
    dynamicUpload("banner", "CouponBannerImages", false)(
      req,
      res,
      function (err2) {
        if (err2) return next(err2);
        next();
      }
    );
  });
}
//Authentication
router.post("/admin", saveAdminController);
router.post("/user", saveUserController);
router.post("/vendor", saveVendorController);
router.post("/login", loginController);
router.patch(
  "/user",
  userAuth,
  dynamicUpload("profile", "UserImages", false),
  updateUserProfileController
);
router.patch(
  "/vendor",
  vendorAuth,
  dynamicUpload("profile", "VendorImages", false),
  updateVendorProfileController
);
router.get("/profile", auth, getProfileController);
//admin
router.get("/admin/dashboard", adminAuth, getDataForAdminDashboardController);
router.get("/admin/users", adminAuth, getListOfUserDetailsController);
router.get("/admin/vendors", adminAuth, getListOfVendorDetailsController);
router.get("/admin/vendor/chart", adminAuth, getVendorChartController);
// router.get("/admin/payment", adminAuth, getListOfPaymentDetailsController);
router.post(
  "/admin/category",
  adminAuth,
  dynamicUpload("image", "CategoryImages", false),
  saveCategoryController
);
router.patch(
  "/admin/category/:id",
  adminAuth,
  dynamicUpload("image", "CategoryImages", false),
  updateCategoryController
);
router.delete("/admin/category/:id", adminAuth, deleteCategoryController);
router.get("/category", getCategoryController);
router.post(
  "/admin/notification",
  adminAuth,
  dynamicUpload("image", "NotificationImages", false),
  sendNotificationController
);
router.get("/notification/count", auth, getNotificationCountController);
router.get("/notification", auth, getNotificationsByUserIdController);
router.post("/testimonial", auth, saveTestimonialController);
router.patch(
  "/admin/testimonial/:id",
  adminAuth,
  updateTestimonialStatusController
);
router.get("/testimonials/:status", getTestimonialsByStatusController);
router.post("/admin/coupon/price", adminAuth, saveCouponPriceController);
router.get("/coupon/price", getCouponPriceController);
router.post(
  "/admin/product",
  adminAuth,
  dynamicUpload("image", "ProductImages", false),
  saveProductController
);
router.patch(
  "/admin/product/:id",
  adminAuth,
  dynamicUpload("image", "ProductImages", false),
  updateProductController
);
router.delete("/admin/product/:id", adminAuth, deleteProductController);
router.get("/products", getAllProductController);
router.get("/product/:id", getProductController);

//vendor
router.get(
  "/vendor/dashboard",
  vendorAuth,
  getDataForVendorDashboardController
);
router.post(
  "/vendor/store",
  vendorAuth,
  dynamicUpload("logo", "StoreImages", false),
  saveStoreController
);
router.get("/vendor/store", vendorAuth, getStoreByVendorController);
router.patch(
  "/vendor/store",
  vendorAuth,
  dynamicUpload("logo", "StoreImages", false),
  updateStoreByVendorController
);
router.get("/stores", getListOfStoresController);
const storage = createStorage("CouponImages");
const upload = multer({ storage });
router.post(
  "/vendor/coupon",
  vendorAuth,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  saveCouponController
);
router.get("/vendor/coupon", vendorAuth, getListOfCouponByVendorController);
router.patch(
  "/vendor/coupon/:id",
  vendorAuth,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  editCouponByVendorController
);
router.delete("/vendor/coupon/:id", vendorAuth, deleteCouponByVendorController);
//user
router.get("/coupons", getListOfCouponsController);
router.post("/user/wishlist", userAuth, addCouponWishlistController);
router.get("/user/wishlist", userAuth, viewWishlistCouponController);
router.delete(
  "/user/wishlist/:couponId",
  userAuth,
  deleteWishlistCouponController
);
router.get("/category/coupons/:categoryId", getCouponsByCategoryIdController);
router.get("/store/coupons/:storeId", getCouponsByStoreIdController);
router.post("/coupons/working", userAuth, saveCouponWorkingController);
router.get("/coupons/working/:couponId", getCouponWorkingByCouponIdController);
router.post("/coupon/comment", userAuth, saveCouponCommentController);
router.get("/coupon/comment/:couponId", getCouponCommentController);
router.post("/coupon/store", addNotifyCouponController);
router.get("/home/coupons", getCouponsByPinCodeController);
router.get("/home/deals", getDealsByPinCodeController);
router.get("/home/deals-coupons",getDealsAndCouponByPinCodeController);
router.get("/home/last/deals", getLastDealsController);
router.get("/coupon/:id", getCouponByIdController);
//location
router.post("/location", saveLocationController);
router.get("/location/states", findAllSatesController);
router.get("/location/districts/:state", findAllDistrictsByStateController);
//verify email
router.post("/email/code", sendCodeToEmailController);
router.post("/email/verify", verifyCodeController);
//forgot password
router.post("/forgot/password", forgotPasswordController);
//contactUs
router.post("/admin/contact-us", adminAuth, saveContactUsController);
router.patch("/admin/contact-us/:id", adminAuth, updateContactUsController);
router.get("/contact-us", getContactUsController);
//payment
router.post("/create-order", vendorAuth, createOrder);
router.post("/verify-payment", vendorAuth, verifyPayment);
router.post("/verify-payment-coupon", vendorAuth, verifyPaymentCoupon);
router.get("/coupon/payment-history", vendorAuth, getCouponPaymentHistory);
router.get("/payment-history", adminAuth, getPaymentHistory);
//pinCode
router.post("/admin/pincode",PincodeController.savePinCode);
router.get("/pincode",PincodeController.getPinCode);
router.get("/state/cities/:stateName", PincodeController.getAllCitiesByState);
//agent
router.post("/admin/agent",AgentController.save);
router.patch("/admin/agent/:id", adminAuth, AgentController.update);
router.get("/admin/agents", adminAuth, AgentController.viewAll);
router.delete("/admin/agent/:id", adminAuth, AgentController.deleteById);
router.get("/admin/agent/transaction",adminAuth, AgentController.getAllTransaction);
export default router;
