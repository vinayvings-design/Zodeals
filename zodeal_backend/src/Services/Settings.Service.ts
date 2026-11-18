import { PLAN_MODES, PlanMode, SettingsModel } from "../Models/Settings/Settings.Model.js";
import { error } from "../../commons/Exception/CustomException.js";
import { badRequest } from "../../commons/Utils/StatusCode.js";

export const getPlanModeService = async (): Promise<PlanMode> => {
  const doc = await SettingsModel.findOne();
  return doc?.planMode ?? "paid";
};

export const setPlanModeService = async (planMode: unknown): Promise<PlanMode> => {
  if (typeof planMode !== "string" || !PLAN_MODES.includes(planMode as PlanMode)) {
    throw error(badRequest, 'planMode must be "free" or "paid".');
  }
  const doc = await SettingsModel.findOneAndUpdate(
    {},
    { planMode },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return doc.planMode;
};
