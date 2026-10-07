import { Types } from "mongoose";
import QRCode from "qrcode";
import { IStore, IStoreDocument } from "../Models/Store/Store.Interface.js";
import { error } from "../../commons/Exception/CustomException.js";
import { badRequest, notFound } from "../../commons/Utils/StatusCode.js";
import { findVendorByEmailQuery } from "../Queries/Vendor.Query.js";
import {
  getListOfStoresQuery,
  getStoreByVendorIdQuery,
  saveStoreQuery,
  updateStoreByVendorIdQuery,
} from "../Queries/Store.Query.js";
import { findLocationQuery } from "../Queries/Location.Query.js";
import { VendorModel } from "../Models/Vendor/Vendor.Model.js";
async function generateQRCode(text: string): Promise<string> {
  try {
    const url = await QRCode.toDataURL(text);
    return url;
  } catch (err) {
    throw err;
  }
}
interface storeInput {
  file?: { filename: string };
  body: IStore;
}
const saveStoreService = async (userName: string, storeDetails: storeInput) => {
  try {
    const { file, body } = storeDetails;
    const {
      name,
      description,
      contactName,
      contactEmail,
      phoneNumber,
      socialMediaLinks,
      country = "india",
      states = [],
      districts = [],
      pinCodes = [],
    } = body;
    let address = "fmansdlkfnskjdfnksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfksdnfk";
    let addressUrl = await generateQRCode(address);
    const vendor = await findVendorByEmailQuery(userName);
    let vendorId = vendor?._id as Types.ObjectId;
    let existingStore = await getStoreByVendorIdQuery(vendorId);
    if (existingStore) {
      throw error(badRequest, "Store already exists");
    }
    const storeData: IStore = {
      vendorId: vendorId,
      name,
      logo: file ? `/uploads/StoreImages/${file.filename}` : undefined,
      description,
      contactName,
      contactEmail,
      phoneNumber,
      socialMediaLinks,
      address,
      locationQRCode: addressUrl,
      country,
      states,
      districts,
      pinCodes,
    };
     await VendorModel.findByIdAndUpdate(vendorId, {
      is_store_created: true,
    });
    const savedStore = await saveStoreQuery(storeData);
    return savedStore;
  } catch (error) {
    console.log(error)
    throw error;
  }
};
const getStoreByVendorService = async (
  userName: string
): Promise<IStoreDocument> => {
  try {
    const vendor = await findVendorByEmailQuery(userName);
    let vendorId = vendor?._id as Types.ObjectId;
    const store = await getStoreByVendorIdQuery(vendorId);
    if (!store) {
      throw error(notFound, "Store not found");
    }
    return store;
  } catch (error) {
    throw error;
  }
};
const updateStoreByVendorService = async (
  userName: string,
  storeDetails: storeInput
): Promise<IStoreDocument> => {
  try {
    const { file, body } = storeDetails;
    const vendor = await findVendorByEmailQuery(userName);
    const vendorId = vendor?._id as Types.ObjectId;
    let updatedData: Partial<IStore> = {};

    if (body) {
      updatedData = { ...body };
      if (body.address) {
        const addressUrl = await generateQRCode(body.address);
        updatedData.locationQRCode = addressUrl;
      }
      const states: string[] = body.states ?? [];
      const districts: string[] = body.districts ?? [];
      //   if (states.length > 0 || districts.length > 0) {
      //     let pinCodes: string[] = [];

      //     if (districts.length > 0) {
      //       const query = { "states.districts.name": { $in: districts } };
      //       const locations = await findLocationQuery(query);
      //       locations.forEach((doc: any) => {
      //         doc.states?.forEach((state: any) => {
      //           state.districts?.forEach((district: any) => {
      //             if (districts.includes(district.name)) {
      //               pinCodes.push(...district.pinCodes);
      //             }
      //           });
      //         });
      //       });
      //       pinCodes = [...new Set(pinCodes)];
      //     } else if (states.length > 0) {
      //       const query = { "states.name": { $in: states } };
      //       const locations = await findLocationQuery(query);
      //       locations.forEach((doc: any) =>
      //         doc.states?.forEach((state: any) =>
      //           state.districts?.forEach((district: any) =>
      //             states.includes(state.name)
      //               ? pinCodes.push(...district.pinCodes)
      //               : null
      //           )
      //         )
      //       );
      //       pinCodes = [...new Set(pinCodes)];
      //     } else {
      //       const query = {};
      //       const locations = await findLocationQuery(query);
      //       locations.forEach((doc: any) => {
      //         doc.states?.forEach((state: any) => {
      //           state.districts?.forEach((district: any) => {
      //             pinCodes.push(...district.pinCodes);
      //           });
      //         });
      //       });
      //       pinCodes = [...new Set(pinCodes)];
      //     }

      //     updatedData.pinCodes = pinCodes;
      //   }
    }
    if (file) {
      updatedData.logo = `/uploads/StoreImages/${file.filename}`;
    }
     await VendorModel.findByIdAndUpdate(vendorId, {
      is_store_created: true,
    });
    const store = await updateStoreByVendorIdQuery(vendorId, updatedData);
    if (!store) {
      throw error(notFound, "Store not found");
    }
    return store;
  } catch (error) {
    throw error;
  }
};
const getListOfStoresService = async (pinCode?: string) => {
  try {
    const allStores = await getListOfStoresQuery({});
    if (!pinCode) {
      return {
        matchedStores: [] as IStoreDocument[],
        panIndiaStores: allStores,
      };
    }
    const matchedStores = allStores.filter(store =>
      store?.pinCodes?.some(p => p.split(",").includes(pinCode))
    );
    return {
      matchedStores,
      panIndiaStores:allStores,
    };
  } catch (error) {
    console.error("getListOfStoresService error:", error);
    throw error;
  }
};

export {
  saveStoreService,
  getStoreByVendorService,
  updateStoreByVendorService,
  getListOfStoresService,
};
