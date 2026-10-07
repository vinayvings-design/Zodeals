import { IPinCode } from "../Models/Pincode/Pincode.Interface.js";
import { PinCodeModel } from "../Models/Pincode/Pincode.Model.js";

const savePinCode = async (data: IPinCode) => {
  try {
    const pinCode = new PinCodeModel(data);
    await pinCode.save();
  } catch (error) {
    throw error
  }
}
const getPinCode = async () => {
  try {
    const pinCode = await PinCodeModel.find();
    return pinCode;
  } catch (error) {
    throw error
  }
}
const getAllCitiesByState = async (stateName: string) => {
  try {
    const stateDocument = await PinCodeModel.findOne({ state: stateName });

    if (!stateDocument) {
      return [];
    }

    const cities = stateDocument.cities.map((city) => city.name);
    return cities;
  } catch (error) {
    throw error;
  }
};
export const getPinCodeByQuery = async (
  state: string,
  city?: string
): Promise<string[]> => {
  try {
    // 1️⃣ FIND STATE
    const stateDoc = await PinCodeModel.findOne(
      { state: { $regex: state, $options: "i" } },
      { cities: 1, _id: 0 }
    );
    if (!stateDoc) return [];
    let pinCodes: string[] = [];
    if (city) {
      const cityDoc = stateDoc.cities.find(
        (c) => c.name.toLowerCase() === city.toLowerCase()
      );

      console.log("CITY DOC 👉", cityDoc);
      if (!cityDoc) return [];
      pinCodes = cityDoc.pinCode.map(String);
    }
    else {
      for (const c of stateDoc.cities) {
        pinCodes.push(...c.pinCode.map(String));
      }
    }
    console.log("FINAL PINCODES", pinCodes);
    return [...new Set(pinCodes)];
  } catch (error) {
    console.error("getPinCodeByQuery ❌", error);
    throw error;
  }
};



const getAllStates = async () => {
  try {
    const states = await PinCodeModel.find().select("state -_id");
    return states.map((s) => s.state);
  } catch (error) {
    throw error;
  }
}
export const pinCodeQuery = {
  savePinCode,
  getPinCode,
  getPinCodeByQuery,
  getAllCitiesByState,
  getAllStates
};
