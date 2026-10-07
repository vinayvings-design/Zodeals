import { LocationModel } from "../Models/Location/Location.Model.js";
import {
  ILocation,
  ILocationDocument,
} from "../Models/Location/Location.Interface.js";

const saveLocationQuery = async (
  locationQuery: Partial<ILocation>
): Promise<ILocationDocument> => {
  try {
    const location = await new LocationModel(locationQuery).save();
    return location;
  } catch (error) {
    throw error;
  }
};
const findLocationQuery = async (query: object) => {
  try {
    const location = await LocationModel.find(query);
    return location;
  } catch (error) {
    throw error;
  }
};
export { saveLocationQuery, findLocationQuery };
