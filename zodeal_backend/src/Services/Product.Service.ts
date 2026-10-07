import { Types } from "mongoose";
import { error } from "../../commons/Exception/CustomException.js";
import { badRequest, notFound } from "../../commons/Utils/StatusCode.js";
import {
  deleteProductQuery,
  getAllProductQuery,
  getProductQuery,
  saveProductQuery,
  updateProductQuery,
} from "../Queries/Product.Query.js";
import { IProduct } from "../Models/Product/Product.Interface.js";
import { deleteFile } from "../../commons/Utils/Storage.js";
interface productInput {
  file?: { filename: string };
  body: IProduct;
}
const saveProductService = async (productDetails: productInput) => {
  try {
    const { file, body } = productDetails;
    const productData: IProduct = {
      ...body,
      image: file ? `/uploads/ProductImages/${file.filename}` : "",
    };
    const product = await saveProductQuery(productData);
    return product;
  } catch (error) {
    throw error;
  }
};
const updateProductService = async (
  id: string | Types.ObjectId,
  productDetails: productInput
) => {
  try {
    const { file, body } = productDetails;
    let updatedData = { ...body };
    if(file){
        updatedData = {
            ...updatedData,
            image: `/uploads/ProductImages/${file.filename}`,
        }
    }
    const updatedProduct = await updateProductQuery(id, updatedData);
    if (!updatedProduct) {
      throw error(notFound, "Unable to update the product.");
    }
    return updatedProduct;
  } catch (error) {
    throw error;
  }
};
const deleteProductService = async (id: string | Types.ObjectId) => {
  try {
    const product = await deleteProductQuery(id);
    if (!product) {
      throw error(notFound, "Product not found. Please try again.");
    }
    await deleteFile(product.image);
    return product;
  } catch (error) {
    throw error;
  }
};
const getAllProductService = async () => {
  try {
    const products = await getAllProductQuery();
    if (products.length === 0) {
      throw error(notFound, "No products found");
    }
    return products;
  } catch (error) {
    throw error;
  }
};
const getProductService = async (id: string | Types.ObjectId) => {
  try {
    const product = await getProductQuery(id);
    if (!product) {
      throw error(notFound, "Product not found");
    }
    return product;
  } catch (error) {
    throw error;
  }
};
export {
  saveProductService,
  updateProductService,
  deleteProductService,
  getAllProductService,
  getProductService,
};
