import { Types } from "mongoose";
import { CategoryModel } from "../Models/Category/Category.Model.js";
import {
  ICategory,
  ICategoryDocument,
} from "../Models/Category/Category.Interface.js";

const saveCategoryQuery = async (
  categoryDetails: ICategory
): Promise<ICategoryDocument> => {
  try {
    const savedCategory = await new CategoryModel(categoryDetails).save();
    return savedCategory;
  } catch (error) {
    throw error;
  }
};
const updateCategoryQuery = async (
  id: string | Types.ObjectId,
  categoryDetails: Partial<ICategory>
): Promise<ICategoryDocument | null> => {
  try {
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      categoryDetails,
      { new: true }
    );
    return updatedCategory;
  } catch (error) {
    throw error;
  }
};
const deleteCategoryQuery = async (
  id: string | Types.ObjectId
): Promise<ICategoryDocument | null> => {
  try {
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);
    return deletedCategory;
  } catch (error) {
    throw error;
  }
};
const getCategoryQuery = async (): Promise<ICategoryDocument[]> => {
  try {
    const categories = await CategoryModel.find();
    return categories;
  } catch (error) {
    throw error;
  }
};
const getCategoryByIdQuery = async (id:string | Types.ObjectId):Promise<ICategoryDocument | null>=>{
    try {
        const category = await CategoryModel.findById(id);
        return category;
    } catch (error) {
        throw error;
    }
}
export {
  saveCategoryQuery,
  updateCategoryQuery,
  deleteCategoryQuery,
  getCategoryQuery,
  getCategoryByIdQuery,
};
