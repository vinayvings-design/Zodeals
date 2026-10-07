import { Types } from "mongoose";
import {
  IPayment,
  IPaymentDocument,
} from "../Models/Payment/Payment.Interface.js";
import { PaymentModel } from "../Models/Payment/Payment.Model.js";
import { IPinCodePaymentHistory } from "../Models/Payment/PinCodePaymentHistory.Interface.js";
import { PinCodePaymentHistoryModel } from "../Models/Payment/PinCodePaymentHistory.Model.js";

const savePaymentQuery = async (
  paymentDetails: IPayment
): Promise<IPaymentDocument> => {
  try {
    const payment = await new PaymentModel(paymentDetails).save();
    return payment;
  } catch (error) {
    throw error;
  }
};
const getPaymentHistoryQuery = async () => {
  try {
    const paymentHistory = await PaymentModel.find().populate('vendorId', 'name');
    return paymentHistory;
  } catch (error) {
    throw error;
  }
};
const getPaymentHistoryForUserQuery = async (
  userId: string | Types.ObjectId
) => {
  try {
    const paymentHistory = await PaymentModel.find({ userId: userId });
    return paymentHistory;
  } catch (error) {
    throw error;
  }
};
//coupon payment
const saveCouponPaymentQuery = async(paymentDetails: IPinCodePaymentHistory)=>{
  try {
    const payment = await new PinCodePaymentHistoryModel(paymentDetails).save();
    return payment;
  } catch (error) {
    throw error;
  }
}
const getCouponPaymentByVendorIdQuery = async(vendorId: Types.ObjectId | string)=>{
  try {
    const payment = await PinCodePaymentHistoryModel.findOne({vendorId: vendorId}).populate("couponId");
    return payment;
  } catch (error) {
    throw error;
  }
}
const getCouponPaymentAllVendor = async()=>{
    try {
      const payment = await PinCodePaymentHistoryModel.find().populate("couponId").populate("vendorId","name");
      return payment;
    } catch (error) {
      throw error;
    }
   }
export {
  savePaymentQuery,
  getPaymentHistoryQuery,
  getPaymentHistoryForUserQuery,
  //coupon
  saveCouponPaymentQuery,
  getCouponPaymentByVendorIdQuery,
  getCouponPaymentAllVendor
};
