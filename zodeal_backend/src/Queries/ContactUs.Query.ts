import { Types } from "mongoose";
import {
  IContactUs,
  IContactUsDocument,
} from "../Models/ContactUs/ContactUs.Interface.js";
import { ContactUsModel } from "../Models/ContactUs/ContactUs.Model.js";

const saveContactUsQuery = async (
  contactUsDetails: Partial<IContactUs>
): Promise<IContactUsDocument> => {
  try {
    const contactUs = await new ContactUsModel(contactUsDetails).save();
    return contactUs;
  } catch (error) {
    throw error;
  }
};
const getContactUsQuery = async (): Promise<IContactUsDocument | null> => {
  try {
    const contactUs = await ContactUsModel.findOne();
    return contactUs;
  } catch (error) {
    throw error;
  }
};
const updateContactUsQuery = async (
  id: string | Types.ObjectId,
  contactUsData: Partial<IContactUs>
): Promise<IContactUsDocument | null> => {
  try {
    const contactUs = await ContactUsModel.findByIdAndUpdate(
      id,
      contactUsData,
      { new: true }
    );
    return contactUs;
  } catch (error) {
    throw error;
  }
};
export { saveContactUsQuery, getContactUsQuery, updateContactUsQuery };
