import { Types } from "mongoose";
import { UserModel } from "../Models/User/User.Model.js";
import { IUser, IUserDocument } from "../Models/User/User.Interface.js";
import { VendorModel } from "../Models/Vendor/Vendor.Model.js";
const saveUserQuery = async (userDetails: IUser): Promise<IUserDocument> => {
  try {
    const savedUser = await new UserModel(userDetails).save();
    return savedUser;
  } catch (error) {
    throw error;
  }
};
const findUserByEmailQuery = async (
  email: string
): Promise<IUserDocument | null> => {
  try {
    const user = await UserModel.findOne({ email });
    console.log(user,email)
    return user;
  } catch (error) {
    throw error;
  }
};
const updateUserByIdQuery = async (
  id: string | Types.ObjectId,
  userDetails: Partial<IUser>
): Promise<IUserDocument | null> => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: userDetails },
      { new: true, runValidators: true }
    );
    return updatedUser;
  } catch (error) {
    throw error;
  }
};
const findAllUsersQuery = async()=>{
    try {
        const users =   await UserModel.find().select('-password');
        return users;
    } catch (error) {
        throw error;
    }
}
const findAllVendorsQuery = async()=>{
    try {
        const vendors = await VendorModel.find().select('-password');
        return vendors;
    } catch (error) {
        throw error;
    }
}
const deleteAllusersQuery = async()=>{
    try {
        await UserModel.deleteMany({});
    }catch(error){
      throw error;
    }}
export {
  saveUserQuery,
  findUserByEmailQuery,
  updateUserByIdQuery,
  findAllUsersQuery,
  findAllVendorsQuery,
  deleteAllusersQuery
};