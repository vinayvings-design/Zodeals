import { Types } from "mongoose";
import { IProduct, IProductDocument } from "../Models/Product/Product.Interface.js";
import { ProductModel } from "../Models/Product/Product.Model.js";
const saveProductQuery = async (
  productDetails: IProduct
): Promise<IProductDocument> => {
  try {
    const product = await new ProductModel(productDetails).save();
    return product;
  } catch (error) {
    throw error;
  }
};
const updateProductQuery = async (
  id: string | Types.ObjectId,
  productDetails: Partial<IProductDocument>
): Promise<IProductDocument | null> => {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      productDetails,
      { new: true }
    );
    return updatedProduct;
  } catch (error) {
    throw error;
  }
};
const deleteProductQuery = async (
  id: string | Types.ObjectId
): Promise<IProductDocument | null> => {
  try {
    const product = await ProductModel.findByIdAndDelete(id);
    return product;
  } catch (error) {
    throw error;
  }
};
const getAllProductQuery = async (): Promise<IProductDocument[]> => {
  try {
    const products = await ProductModel.find();
    return products;
  } catch (error) {
    throw error;
  }
};
const getProductQuery = async (
  id: string | Types.ObjectId
): Promise<IProductDocument | null> => {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } }, 
      { new: true } 
    );
    return product;
  } catch (error) {
    throw error;
  }
};
export {
  saveProductQuery,
  updateProductQuery,
  deleteProductQuery,
  getAllProductQuery,
  getProductQuery,
};
