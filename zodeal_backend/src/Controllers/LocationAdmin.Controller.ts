import { Request, Response } from "express";
import {
  badRequest,
  conflict,
  notFound,
  serverError,
  successCode,
} from "../../commons/Utils/StatusCode.js";
import {
  handleSuccessResponse,
  handleErrorResponse,
} from "../../commons/Response/Response.js";
import { LocationModel } from "../Models/Location/Location.Model.js";
import { PinCodeModel } from "../Models/Pincode/Pincode.Model.js";

/**
 * Admin-only management of states, districts and pincodes.
 *
 * Data layout (unchanged from before):
 *  - PinCode collection: one document per state, { state, cities: [{ name (district), pinCode: number[] }] }
 *  - Location collection: ONE document, { states: [{ name, districts: [{ name, pinCodes }] }] } (names only)
 * Every write below keeps both in step.
 */

type DistrictInput = { name?: unknown; pinCodes?: unknown };

const fail = (res: Response, errorCode: number, displayMessage: string) =>
  handleErrorResponse({ errorCode, displayMessage }, res);

const unexpected = (res: Response, err: unknown) => {
  console.error("LocationAdmin ❌", err);
  return fail(res, serverError, "Internal Server Error");
};

// GET /admin/location-data
// Returns [{ name, districts: [{ name, pinCodes: string[] }] }] for every state.
const listLocationData = async (_req: Request, res: Response) => {
  try {
    const pinDocs = await PinCodeModel.find({}).lean();
    const byState = new Map<string, Map<string, Set<string>>>();
    for (const doc of pinDocs as any[]) {
      const districts = byState.get(doc.state) ?? new Map<string, Set<string>>();
      for (const city of doc.cities ?? []) {
        const pins = districts.get(city.name) ?? new Set<string>();
        for (const p of city.pinCode ?? []) pins.add(String(p));
        districts.set(city.name, pins);
      }
      byState.set(doc.state, districts);
    }

    // States/districts that only exist in the Location document (no pincodes yet)
    const location: any = await LocationModel.findOne({}).lean();
    for (const s of location?.states ?? []) {
      const districts = byState.get(s.name) ?? new Map<string, Set<string>>();
      for (const d of s.districts ?? []) {
        if (!districts.has(d.name)) districts.set(d.name, new Set<string>());
      }
      byState.set(s.name, districts);
    }

    const result = [...byState.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, districts]) => ({
        name,
        districts: [...districts.entries()].map(([dName, pins]) => ({
          name: dName,
          pinCodes: [...pins],
        })),
      }));

    return handleSuccessResponse(
      { statusCode: successCode, result },
      res,
      "Location data fetched successfully."
    );
  } catch (err) {
    return unexpected(res, err);
  }
};

// PUT /admin/location-data/state
// body: { originalName?: string, name: string, districts: [{ name: string, pinCodes: (string|number)[] }] }
// Creates the state, or replaces it (rename state, add/rename/delete districts, add/remove pincodes).
const saveState = async (req: Request, res: Response) => {
  try {
    const originalName = String(req.body?.originalName ?? "").trim();
    const name = String(req.body?.name ?? "").trim();
    const rawDistricts: DistrictInput[] = Array.isArray(req.body?.districts)
      ? req.body.districts
      : [];

    if (!name) return fail(res, badRequest, "State name is required.");
    if (rawDistricts.length === 0) {
      return fail(res, badRequest, "Add at least one district.");
    }

    const seenDistricts = new Set<string>();
    const districts: { name: string; pins: number[] }[] = [];
    for (const d of rawDistricts) {
      const dName = String(d?.name ?? "").trim();
      if (!dName) return fail(res, badRequest, "Every district needs a name.");
      const key = dName.toLowerCase();
      if (seenDistricts.has(key)) {
        return fail(res, badRequest, `District "${dName}" is listed twice.`);
      }
      seenDistricts.add(key);

      const list = Array.isArray(d?.pinCodes) ? (d.pinCodes as unknown[]) : [];
      const pins = new Set<number>();
      for (const raw of list) {
        const p = String(raw).trim();
        if (!p) continue;
        if (!/^[1-9]\d{5}$/.test(p)) {
          return fail(res, badRequest, `"${p}" in ${dName} is not a valid 6-digit pincode.`);
        }
        pins.add(Number(p));
      }
      districts.push({ name: dName, pins: [...pins] });
    }

    const oldName = originalName || name;
    if (name !== oldName) {
      const clash = await PinCodeModel.exists({ state: name });
      const clashLocation = await LocationModel.exists({ "states.name": name });
      if (clash || clashLocation) {
        return fail(res, conflict, `A state named "${name}" already exists.`);
      }
    }

    // 1) PinCode: replace this state's document(s)
    await PinCodeModel.deleteMany({ state: oldName });
    await PinCodeModel.create({
      state: name,
      cities: districts.map((d) => ({ name: d.name, pinCode: d.pins })),
    });

    // 2) Location: update the state's entry in the single Location document
    const entry = {
      name,
      districts: districts.map((d) => ({ name: d.name, pinCodes: [] as string[] })),
    };
    const location = await LocationModel.findOne({});
    if (!location) {
      await LocationModel.create({ states: [entry] });
    } else {
      const states: any[] = (location.states as any[]).map((s) => s.toObject?.() ?? s);
      const index = states.findIndex((s) => s.name === oldName);
      if (index >= 0) states[index] = entry;
      else states.push(entry);
      location.set("states", states);
      await location.save();
    }

    return handleSuccessResponse(
      { statusCode: successCode, result: { name, districts: districts.length } },
      res,
      "State saved successfully."
    );
  } catch (err) {
    return unexpected(res, err);
  }
};

// DELETE /admin/location-data/state/:name
const deleteState = async (req: Request, res: Response) => {
  try {
    const name = String(req.params.name ?? "").trim();
    if (!name) return fail(res, badRequest, "State name is required.");

    const pinResult = await PinCodeModel.deleteMany({ state: name });
    let removedFromLocation = false;
    const location = await LocationModel.findOne({});
    if (location) {
      const states: any[] = (location.states as any[]).map((s) => s.toObject?.() ?? s);
      const kept = states.filter((s) => s.name !== name);
      if (kept.length !== states.length) {
        location.set("states", kept);
        await location.save();
        removedFromLocation = true;
      }
    }

    if (pinResult.deletedCount === 0 && !removedFromLocation) {
      return fail(res, notFound, `State "${name}" was not found.`);
    }
    return handleSuccessResponse(
      { statusCode: successCode, result: { name } },
      res,
      "State deleted successfully."
    );
  } catch (err) {
    return unexpected(res, err);
  }
};

export const LocationAdminController = { listLocationData, saveState, deleteState };
