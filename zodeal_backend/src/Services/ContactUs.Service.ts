import { Types } from "mongoose";
import { error } from "../../commons/Exception/CustomException.js";
import {
  conflict,
  notFound,
} from "../../commons/Utils/StatusCode.js";
import {
  getContactUsQuery,
  saveContactUsQuery,
  updateContactUsQuery,
} from "../Queries/ContactUs.Query.js";
import {
  IContactUs,
  IContactUsDocument,
} from "../Models/ContactUs/ContactUs.Interface.js";

const saveContactUsService = async (
  contactUsDetails: Partial<IContactUs>
): Promise<IContactUsDocument> => {
  try {
    const alreadyExist = await getContactUsQuery();
    if (alreadyExist) {
      throw error(conflict, "Contact us already exist. Please update it.");
    }
    const contactUs = await saveContactUsQuery(contactUsDetails);
    return contactUs;
  } catch (error) {
    throw error;
  }
};
const getContactUsService = async (): Promise<IContactUsDocument | null> => {
  try {
    const contactUs = await getContactUsQuery();
    if (!contactUs) {
      throw error(notFound, "Contact us not found.");
    }
    return contactUs;
  } catch (error) {
    throw error;
  }
};
const updateContactUsService = async (
  id: string | Types.ObjectId,
  updatedData: Partial<IContactUs>
): Promise<IContactUsDocument> => {
  try {
    const contactUs = await updateContactUsQuery(id, updatedData);
    if (!contactUs) {
      throw error(notFound, "Unable to update. Please try again.");
    }
    return contactUs;
  } catch (error) {
    throw error;
  }
};
export { saveContactUsService, getContactUsService, updateContactUsService };
