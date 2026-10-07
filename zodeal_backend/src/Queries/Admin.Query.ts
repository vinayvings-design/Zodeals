import { AdminModel } from "../Models/Admin/Admin.Model.js";
import { IAdmin, IAdminDocument } from "../Models/Admin/Admin.Interface.js";

const saveAdminQuery = async (
  adminDetails: IAdmin
): Promise<IAdminDocument> => {
  try {
    const savedAdmin = await new AdminModel(adminDetails).save();
    return savedAdmin;
  } catch (error) {
    throw error;
  }
};

const findAdminByEmailQuery = async (
  email: string
): Promise<IAdminDocument | null> => {
  try {
    const admin = await AdminModel.findOne({ email });
    return admin;
  } catch (error) {
    throw error;
  }
};
const findAdminQuery = async (): Promise<IAdminDocument | null> => {
  try {
    const admin = await AdminModel.findOne();
     return admin;
  } catch (error) {
    throw error;
  }
};

export { saveAdminQuery, findAdminByEmailQuery, findAdminQuery };
