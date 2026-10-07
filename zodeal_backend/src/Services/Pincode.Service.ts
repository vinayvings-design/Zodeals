

import { IPinCode } from "../Models/Pincode/Pincode.Interface.js";
import { pinCodeQuery } from "../Queries/Pincode.Query.js";
import { PinCodeModel } from "../Models/Pincode/Pincode.Model.js";
const savePincode = async (data: IPinCode) => {
    try {
        const pincode = await pinCodeQuery.savePinCode(data);
        return pincode;
    } catch (error) {
        throw error;
    }
}
const getPincode = async () => {
  try {
    const allStates = await PinCodeModel.find({}, { cities: 1, _id: 0 });
    let pinCodes: string[] = [];
    for (const stateDoc of allStates) {
      for (const city of stateDoc.cities) {
        if (Array.isArray(city.pinCode)) {
          pinCodes.push(...city.pinCode.map(String));
        }
      }
    }
    const uniquePinCodes = [...new Set(pinCodes)];
    return uniquePinCodes;
  } catch (error) {
    console.error("getPincode ❌", error);
    throw error;
  }
};
const getAllCitiesByState = async(stateName: string)=>{
    try {
        const cities = await pinCodeQuery.getAllCitiesByState(stateName);
        return cities;
    } catch (error) {
        throw error;
    }
}
export const PincodeService = {
  savePincode,
  getPincode,
  getAllCitiesByState,
};