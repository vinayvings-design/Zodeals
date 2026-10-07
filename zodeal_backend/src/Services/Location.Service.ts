import { error } from "../../commons/Exception/CustomException.js";
import { notFound } from "../../commons/Utils/StatusCode.js";
import {
  ILocation,
  ILocationDocument,
} from "../Models/Location/Location.Interface.js";
import {
  findLocationQuery,
  saveLocationQuery,
} from "../Queries/Location.Query.js";
import { pinCodeQuery } from "../Queries/Pincode.Query.js";

const saveLocationService = async (
  locationDetails: ILocation
): Promise<ILocationDocument> => {
  try {
    const savedLocation = await saveLocationQuery(locationDetails);
    return savedLocation;
  } catch (error) {
    throw error;
  }
};
const findAllSatesService = async () => {
  try {
    // const states = await pinCodeQuery.getAllStates();
    // return states;
    let query = {};
    const locations = await findLocationQuery(query);
    if (!locations || locations.length === 0) {
      throw error(notFound, "No states found.");
    }
     const states = locations[0].states?.map((state: any) => state.name) ?? [];
     return states;
  } catch (error) {
    throw error;
  }
};
const findAllDistrictsByStateService = async (state: string) => {
  try {
    
    const query = { "states.name": state };
    const locations = await findLocationQuery(query);
    if (!locations || locations.length === 0) {
      throw error(notFound, "No districts found.");
    }
    const doc = locations[0];
    const matchedState = doc.states?.find((s: any) => s.name === state);
    if (
      !matchedState ||
      !matchedState.districts ||
      matchedState.districts.length === 0
    ) {
      throw error(notFound, "No districts found.");
    }
    const districtNames = matchedState.districts.map((d: any) => d.name);
    return districtNames;
  } catch (error) {
    throw error;
  }
};

export{
    saveLocationService,
    findAllSatesService,
    findAllDistrictsByStateService,
}