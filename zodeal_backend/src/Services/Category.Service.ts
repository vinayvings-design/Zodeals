import { Types } from "mongoose";
import {
  saveCategoryQuery,
  updateCategoryQuery,
  deleteCategoryQuery,
  getCategoryQuery,
  getCategoryByIdQuery,
} from "../Queries/Category.Query.js";
import {
  ICategory,
  ICategoryDocument,
} from "../Models/Category/Category.Interface.js";
import { error } from "../../commons/Exception/CustomException.js";
import { badRequest, notFound } from "../../commons/Utils/StatusCode.js";
import { deleteFile } from "../../commons/Utils/Storage.js";

interface CategoryCreateDetails {
  file?: { filename: string };
  body: Omit<ICategory, "image">;
}
interface CategoryUpdateDetails {
  file?: { filename: string };
  body: Partial<Omit<ICategory, "image">>;
}

const saveCategoryService = async (
  categoryDetails: CategoryCreateDetails
): Promise<ICategoryDocument> => {
  try {
    const { file, body } = categoryDetails;
    if (!file) {
      throw error(badRequest, "You must upload an image");
    }
    const imageUrl = `/uploads/CategoryImages/${file.filename}`;
    const savedCategory = await saveCategoryQuery({ ...body, image: imageUrl });
    return savedCategory;
  } catch (error) {
    throw error;
  }
};

const updateCategoryService = async (
  id: string | Types.ObjectId,
  categoryDetails: CategoryUpdateDetails
): Promise<ICategoryDocument | null> => {
  try {
    const { file, body } = categoryDetails;
    let updateFields: Partial<ICategory> = { ...body };
    const existingCategory = await getCategoryByIdQuery(id);
    if (!existingCategory) {
      throw error(notFound, "Category not found.");
    }
    if (file) {
      updateFields.image = `/uploads/CategoryImages/${file.filename}`;
      await deleteFile(existingCategory.image);
    }
    const updatedCategory = await updateCategoryQuery(id, updateFields);
    if (!updatedCategory) {
      throw error(notFound, "Unable to update category.");
    }
    return updatedCategory;
  } catch (error) {
    throw error;
  }
};

const deleteCategoryService = async (
  id: string | Types.ObjectId
): Promise<ICategoryDocument | null> => {
  try {
    const deletedCategory = await deleteCategoryQuery(id);
    if (!deletedCategory) {
      throw error(notFound, "Unable to delete category. Try after some time.");
    }
    await deleteFile(deletedCategory.image);
    return deletedCategory;
  } catch (error) {
    throw error;
  }
};
const getCategoryService = async (): Promise<ICategoryDocument[]> => {
  try {
    const categories = await getCategoryQuery();
    if (categories.length === 0) {
      throw error(notFound, "No category found.");
    }
    return categories;
  } catch (error) {
    throw error;
  }
};

export {
  saveCategoryService,
  updateCategoryService,
  deleteCategoryService,
  getCategoryService,
};
