import Razorpay from "razorpay";
import crypto from "crypto";
import { error } from "../../commons/Exception/CustomException.js";
import { badRequest, serverError } from "../../commons/Utils/StatusCode.js";
import {
  getCouponPaymentAllVendor,
  getCouponPaymentByVendorIdQuery,
  getPaymentHistoryForUserQuery,
  getPaymentHistoryQuery,
  saveCouponPaymentQuery,
  savePaymentQuery,
} from "../Queries/Payment.Query.js";
import { IPayment } from "../Models/Payment/Payment.Interface.js";
import axios from "axios";
import { editCouponByIdQuery } from "../Queries/Coupon.Query.js";
import { pinCodeQuery } from "../Queries/Pincode.Query.js";
import { findVendorByEmailQuery } from "../Queries/Vendor.Query.js";
import { AgentQuery } from "../Queries/Agent.Query.js";
import { VendorModel } from "../Models/Vendor/Vendor.Model.js";
import { StoreModel } from "../Models/Store/Store.Model.js";
import { CouponModel } from "../Models/Coupon/Coupon.Model.js";
import { getPlanModeService } from "./Settings.Service.js";
// Created on first use, not at start-up: if the Razorpay keys are missing the server must
// still boot (e.g. in Free mode no payment is needed); only creating an order will fail.
let razorpayInstance: Razorpay | null = null;
const getRazorpay = (): Razorpay => {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });
  }
  return razorpayInstance;
};
// Free allowance for a vendor in Paid mode: up to this many offers can be published without paying.
export const FREE_PUBLISH_LIMIT = 10;
const createOrderService = async ({ amount }: { amount: number }) => {
  try {
    console.log(amount)
    const options = {
      amount: Number(amount * 100),
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };
    const order = await new Promise((resolve, reject) => {
      getRazorpay().orders.create(options, (error, order) => {
        if (error) {
          return reject(error);
        }
        resolve(order);
      });
    });
    return order;
  } catch (error) {
    throw error;
  }
};
const verifyPaymentService = async (
  userName: string,
  {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
    couponsIds,
  }: any
) => {
  try {
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", "19WIxC06F5nplG1V1FGOTkpm")
      .update(sign.toString())
      .digest("hex");
    const isAuthentic = expectedSign === razorpay_signature;
    let payment;
    if (!isAuthentic) {
      const paymentDetails = await axios.get(
        `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
        {
          auth: {
            username: process.env.RAZORPAY_KEY_ID as string,
            password: process.env.RAZORPAY_KEY_SECRET as string,
          },
        }
      );
      const status = (paymentDetails.data as { status: string }).status;
      let method = (paymentDetails.data as { method: string }).method;
      let amount = (paymentDetails.data as { amount: number }).amount;
      if (orderId) {
        let status = false;
        if (
          (paymentDetails.data as { paymentStatus: string }).paymentStatus ===
          "captured"
        ) {
          status = true;
        }
      }
      if (status === "captured") {
        for (const couponId of couponsIds) {
          await editCouponByIdQuery(couponId, { paid: true });
        }
      }
      payment = await savePaymentQuery({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        paymentStatus: status,
        vendorId: userName,
        paymentMethod: method,
        amount: amount,
      });
    }
    return payment;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const verifyPaymentCouponService = async (
  userName: any,
  {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
    tag,
    state,
    city,
    couponId,
    pinCode,
    agentCode,
  }: any
) => {
  try {
    const vendor = await findVendorByEmailQuery(userName);
    userName = vendor?._id;
    let payment;
    if (!razorpay_payment_id) {
      // In Free mode (set by the admin) publishing needs no payment for any area type,
      // so the pincodes are worked out here the same way the paid flow does it.
      const freeMode = (await getPlanModeService()) === "free";
      if (!freeMode) {
        // Paid mode: publishing without payment is only allowed for the first FREE_PUBLISH_LIMIT
        // offers, and only while the vendor has not published any before (same rule as the vendor site).
        const ids: any[] = Array.isArray(couponId) ? couponId : [];
        const stores = await StoreModel.find({ vendorId: userName }).select("_id");
        const alreadyPublished = await CouponModel.countDocuments({
          storeId: { $in: stores.map((st) => st._id) },
          paid: true,
          _id: { $nin: ids },
        });
        if (ids.length > FREE_PUBLISH_LIMIT || alreadyPublished > 0) {
          throw error(
            badRequest,
            `Free publishing is limited to ${FREE_PUBLISH_LIMIT} offers. Please complete payment to publish.`
          );
        }
      }
      let areaPinCodes: any = pinCode;
      let isPanIndia = false;
      if (freeMode) {
        if (tag === "fullCity") {
          if (!Array.isArray(state) || state.length === 0 || !city) {
            throw error(badRequest, "please enter state and city.");
          }
          areaPinCodes = await pinCodeQuery.getPinCodeByQuery(state[0], city);
        } else if (tag === "fullState" || tag === "twoState") {
          if (!Array.isArray(state) || state.length === 0) {
            throw error(badRequest, "please enter state name.");
          }
          const all: string[] = [];
          for (const s of state) {
            all.push(...(await pinCodeQuery.getPinCodeByQuery(s)));
          }
          areaPinCodes = [...new Set(all)];
        } else if (tag === "panIndia") {
          areaPinCodes = [];
          isPanIndia = true;
        }
      }
      if (couponId && Array.isArray(couponId)) {
        for (const coupon of couponId) {
          await editCouponByIdQuery(coupon, {
            paid: true,
            pinCode: areaPinCodes,
            agentCode,
            ...(isPanIndia ? { isPanIndia: true } : {}),
          });
        }
      }
      if (
        freeMode ||
        tag === "single" ||
        tag === "double" ||
        tag === "threeToFour" ||
        tag === "fiveToTen"
      ) {
        payment = await saveCouponPaymentQuery({
          razorpay_order_id: razorpay_order_id || "COMPLIMENTARY",
          razorpay_payment_id: "COMPLIMENTARY",
          razorpay_signature: "COMPLIMENTARY",
          paymentStatus: "complimentary",
          vendorId: userName,
          paymentMethod: "complimentary",
          amount: 0,
          couponId,
          pinCode: areaPinCodes,
          ...(freeMode && Array.isArray(state) && state.length ? { state } : {}),
          ...(freeMode && tag === "fullCity" && city ? { city } : {}),
        });
        await VendorModel.findByIdAndUpdate(userName, {
          is_first_time_user: false,
        });
      }
      if (agentCode) {
        const agent = await AgentQuery.getByCode(agentCode);
        await AgentQuery.addVendorDetailsByCode(agentCode, {
          name: vendor?.name || "N/A",
          amount: 0,
        });
        await AgentQuery.saveTransaction({
          agentId: agent?._id as any,
          vendorId: vendor?._id as any,
          couponCount: couponId.length,
          amount: 0,
        });
      }
      return payment;
    }
    const sign = `${razorpay_order_id.trim()}|${razorpay_payment_id.trim()}`;
    const expectedSign = crypto
      .createHmac("sha256", "19WIxC06F5nplG1V1FGOTkpm")
      .update(sign.toString())
      .digest("hex");
    const isAuthentic = expectedSign === razorpay_signature;
    if (!isAuthentic) throw error(badRequest, "Signature verification failed.");
    const paymentDetails = await axios.get(
      `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID as string,
          password: process.env.RAZORPAY_KEY_SECRET as string,
        },
      }
    );
    const status = (paymentDetails.data as { status: string }).status;
    let method = (paymentDetails.data as { method: string }).method;
    let amount = (paymentDetails.data as { amount: number }).amount;

    if (status === "captured" || status === "authorized") {
      if (couponId && Array.isArray(couponId)) {
        for (const coupon of couponId) {
          await editCouponByIdQuery(coupon, { paid: true });
        }
      }
    }

    if (tag === "single" || tag === "double" || tag === "threeToFour" || tag === "fiveToTen") {
      payment = await saveCouponPaymentQuery({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        paymentStatus: status,
        vendorId: userName,
        paymentMethod: method,
        amount,
        couponId,
        pinCode,
      });
      for (const coupon of couponId) {
        await editCouponByIdQuery(coupon, { pinCode, agentCode });
      }
    }

    if (tag === "fullCity") {
      if (!Array.isArray(state) || state.length === 0 || !city) {
        throw error(badRequest, "please enter state and city.");
      }
      const allPinCode = await pinCodeQuery.getPinCodeByQuery(
        state[0],
        city
      );
      console.log("FULL CITY PINCODES 👉", allPinCode);
      payment = await saveCouponPaymentQuery({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        paymentStatus: status,
        vendorId: userName,
        paymentMethod: method,
        amount,
        couponId,
        pinCode: allPinCode as any,
        state,
        city,
      });
      for (const coupon of couponId) {
        await editCouponByIdQuery(coupon, {
          pinCode: allPinCode,
          agentCode,
        });
      }
    }


    if (tag === "fullState" || tag === "twoState") {
      if (!Array.isArray(state) || state.length === 0) {
        throw error(badRequest, "please enter state name.");
      }
      let allPinCode: string[] = [];
      for (const s of state) {
        const p = await pinCodeQuery.getPinCodeByQuery(s);
        allPinCode.push(...p);
      }
      allPinCode = [...new Set(allPinCode)];
      console.log("FULL STATE PINCODES 👉", allPinCode);
      payment = await saveCouponPaymentQuery({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        paymentStatus: status,
        vendorId: userName,
        paymentMethod: method,
        amount,
        couponId,
        pinCode: allPinCode as any,
        state,
      });
      for (const coupon of couponId) {
        await editCouponByIdQuery(coupon, {
          pinCode: allPinCode,
          agentCode,
        });
      }
    }
    if (tag === "panIndia") {
      payment = await saveCouponPaymentQuery({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        paymentStatus: status,
        vendorId: userName,
        paymentMethod: method,
        amount,
        couponId,
        pinCode: [],
        state,
      });
      for (const coupon of couponId) {
        await editCouponByIdQuery(coupon, { pinCode, agentCode, isPanIndia: true });
      }
    }

    if (agentCode) {
      const agent = await AgentQuery.getByCode(agentCode);
      await AgentQuery.update(agent?._id as any, {
        marketingAmount: (agent?.marketingAmount || 0) + (payment?.amount || 0),
      });
      await AgentQuery.addVendorDetailsByCode(agentCode, {
        name: vendor?.name || "N/A",
        amount: payment?.amount || 0,
      });
      await AgentQuery.saveTransaction({
        agentId: agent?._id as any,
        vendorId: vendor?._id as any,
        couponCount: couponId.length,
        amount: payment?.amount || 0,
      });
    }
    const vendorRecord = await VendorModel.findById(userName);
    if (vendorRecord?.is_first_time_user) {
      await VendorModel.findByIdAndUpdate(userName, { is_first_time_user: false });
    }
    return payment;
  } catch (error) {
    throw error;
  }
};

const getCouponPaymentHistoryService = async (userName: string) => {
  try {
    const paymentHistory = await getCouponPaymentByVendorIdQuery(userName);
    return paymentHistory;
  } catch (error) {
    throw error;
  }
};
const getPaymentHistoryService = async () => {
  try {
    let result: {
      dashboard: {
        totalPayment: number;
        completed: number;
        pending: number;
        failed: number;
      };
      history: {
        paymentId: string;
        vendor: string;
        amount: number | undefined;
        date: string;
        status: string;
      }[];
    } = {
      dashboard: {
        totalPayment: 0,
        completed: 0,
        pending: 0,
        failed: 0,
      },
      history: [],
    };

    const payments = await getCouponPaymentAllVendor();

    for (const payment of payments) {
      result.history.push({
        paymentId: payment.razorpay_payment_id,
        vendor:
          typeof payment.vendorId === "object" &&
            payment.vendorId !== null &&
            "name" in payment.vendorId
            ? (payment.vendorId as any).name
            : "N/A",
        amount: payment.amount,
        date: payment.date
          ? new Date(payment.date).toISOString().split("T")[0]
          : "N/A",
        status: payment.paymentStatus,
      });

      if (payment.paymentStatus === "authorized") {
        result.dashboard.pending += 1;
      } else if (payment.paymentStatus === "failed") {
        result.dashboard.failed += 1;
      } else if (payment.paymentStatus === "captured") {
        result.dashboard.completed += 1;
      }

      result.dashboard.totalPayment += payment.amount ?? 0;
    }
    return result;
  } catch (error) {
    throw error;
  }
};
const getPaymentHistoryOfUserService = async (userName: string) => {
  try {
    const paymentHistory = await getPaymentHistoryForUserQuery(userName);
    return paymentHistory;
  } catch (error) {
    throw error;
  }
};
const getPaymentDetailsByPaymentIdService = async (
  razorpay_payment_id: string
) => {
  try {
    const paymentDetails = await axios.get(
      `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID as string,
          password: process.env.RAZORPAY_KEY_SECRET as string,
        },
      }
    );
    const data: any = paymentDetails.data;
    const filteredData = {
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      order_id: data.order_id,
      method: data.method,
      email: data.email,
      contact: data.contact,
      created_at: data.created_at,
      fee: data.fee,
      tax: data.tax,
      description: data.description,
      captured: data.captured,
      bank: data.bank,
      wallet: data.wallet,
      card: data.card
        ? {
          last4: data.card.last4,
          network: data.card.network,
          type: data.card.type,
          issuer: data.card.issuer,
        }
        : undefined,
      acquirer_data: data.acquirer_data
        ? {
          auth_code: data.acquirer_data.auth_code,
        }
        : undefined,
    };
    return filteredData;
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    throw error;
  }
};
const getListOfPaymentDetailsService = async (query: Object) => {
  try {
    if (query) {
    }
    let paymentHistory: object[] = [];
    return paymentHistory;
  } catch (error) {
    throw error;
  }
};
export {
  createOrderService,
  verifyPaymentService,
  verifyPaymentCouponService,
  getCouponPaymentHistoryService,
  getPaymentHistoryService,
  getPaymentHistoryOfUserService,
  getPaymentDetailsByPaymentIdService,
  getListOfPaymentDetailsService,
};
