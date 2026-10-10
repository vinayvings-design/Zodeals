import { Types } from "mongoose";
import {
  BANNER_THEMES,
  BannerTheme,
  IBanner,
  IBannerDocument,
} from "../Models/Banner/Banner.Interface.js";
import {
  deleteBannerQuery,
  getActiveBannersQuery,
  getAllBannersQuery,
  getBannerByIdQuery,
  getMaxBannerOrderQuery,
  saveBannerQuery,
  updateBannerQuery,
} from "../Queries/Banner.Query.js";
import { error } from "../../commons/Exception/CustomException.js";
import { badRequest, notFound } from "../../commons/Utils/StatusCode.js";
import { deleteFile } from "../../commons/Utils/Storage.js";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface BannerFile {
  filename: string;
  mimetype: string;
}
interface BannerRequest {
  file?: BannerFile;
  body: Record<string, any>;
}

// A link may be an in-site path ("/alldeals") or a full http(s) URL. Anything else
// (e.g. "javascript:...") is rejected because these links are rendered on the public site.
const isSafeLink = (link: string): boolean => {
  if (link === "") return true;
  if (link.startsWith("/") && !link.startsWith("//")) return true;
  try {
    const url = new URL(link);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

const text = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const toBool = (value: unknown): boolean =>
  value === true || value === "true" || value === "1" || value === 1;

const removeUpload = async (file?: BannerFile) => {
  if (file) {
    try {
      await deleteFile(`/uploads/BannerImages/${file.filename}`);
    } catch {
      /* best effort cleanup */
    }
  }
};

// Validates only the fields that are present in `body` (so PATCH can be partial).
const parseBannerFields = (body: Record<string, any>): Partial<IBanner> => {
  const out: Partial<IBanner> = {};
  const stringFields: Array<[keyof IBanner, number]> = [
    ["badge", 60],
    ["headline", 90],
    ["accentText", 90],
    ["subtitle", 220],
    ["primaryLabel", 30],
    ["primaryLink", 500],
    ["secondaryLabel", 30],
    ["secondaryLink", 500],
  ];
  for (const [key, max] of stringFields) {
    if (body[key] === undefined) continue;
    const value = text(body[key]);
    if (value.length > max) {
      throw error(badRequest, `${key} must be at most ${max} characters.`);
    }
    (out as any)[key] = value;
  }
  for (const key of ["primaryLink", "secondaryLink"] as const) {
    const value = out[key];
    if (value !== undefined && !isSafeLink(value)) {
      throw error(
        badRequest,
        "Links must start with / (e.g. /alldeals) or be a full http(s) URL."
      );
    }
  }
  if (body.theme !== undefined) {
    if (!BANNER_THEMES.includes(body.theme as BannerTheme)) {
      throw error(badRequest, `Theme must be one of: ${BANNER_THEMES.join(", ")}.`);
    }
    out.theme = body.theme as BannerTheme;
  }
  if (body.isActive !== undefined) out.isActive = toBool(body.isActive);
  if (body.order !== undefined && body.order !== "") {
    const order = Number(body.order);
    if (!Number.isFinite(order)) throw error(badRequest, "Order must be a number.");
    out.order = order;
  }
  return out;
};

const checkImage = (file?: BannerFile) => {
  if (file && !ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    throw error(badRequest, "Image must be a JPG, PNG, WebP or GIF file.");
  }
};

const saveBannerService = async ({ file, body }: BannerRequest): Promise<IBannerDocument> => {
  try {
    if (!file) throw error(badRequest, "You must upload a banner image.");
    checkImage(file);
    const fields = parseBannerFields(body);
    if (!fields.headline) throw error(badRequest, "Headline is required.");
    if ((fields.primaryLabel && !fields.primaryLink) ||
        (fields.secondaryLabel && !fields.secondaryLink)) {
      throw error(badRequest, "A button needs both a label and a link.");
    }
    const order =
      fields.order !== undefined ? fields.order : (await getMaxBannerOrderQuery()) + 1;
    return await saveBannerQuery({
      badge: "",
      accentText: "",
      subtitle: "",
      primaryLabel: "",
      primaryLink: "",
      secondaryLabel: "",
      secondaryLink: "",
      theme: "orange",
      isActive: true,
      ...fields,
      headline: fields.headline,
      order,
      image: `/uploads/BannerImages/${file.filename}`,
    });
  } catch (err) {
    await removeUpload(file);
    throw err;
  }
};

const updateBannerService = async (
  id: string | Types.ObjectId,
  { file, body }: BannerRequest
): Promise<IBannerDocument | null> => {
  try {
    if (!Types.ObjectId.isValid(id as string)) throw error(notFound, "Banner not found.");
    checkImage(file);
    const existing = await getBannerByIdQuery(id);
    if (!existing) throw error(notFound, "Banner not found.");
    const fields = parseBannerFields(body);
    if (fields.headline !== undefined && !fields.headline) {
      throw error(badRequest, "Headline is required.");
    }
    const merged = { ...existing.toObject(), ...fields };
    if ((merged.primaryLabel && !merged.primaryLink) ||
        (merged.secondaryLabel && !merged.secondaryLink)) {
      throw error(badRequest, "A button needs both a label and a link.");
    }
    const update: Partial<IBanner> = { ...fields };
    if (file) update.image = `/uploads/BannerImages/${file.filename}`;
    const updated = await updateBannerQuery(id, update);
    if (!updated) throw error(notFound, "Unable to update banner.");
    if (file) await deleteFile(existing.image);
    return updated;
  } catch (err) {
    await removeUpload(file);
    throw err;
  }
};

const deleteBannerService = async (
  id: string | Types.ObjectId
): Promise<IBannerDocument | null> => {
  if (!Types.ObjectId.isValid(id as string)) throw error(notFound, "Banner not found.");
  const deleted = await deleteBannerQuery(id);
  if (!deleted) throw error(notFound, "Banner not found.");
  await deleteFile(deleted.image);
  return deleted;
};

// Public: returns an empty list (not an error) when nothing is configured,
// so the website can fall back to its built-in hero slides.
const getActiveBannersService = async (): Promise<IBannerDocument[]> =>
  await getActiveBannersQuery();

const getAllBannersService = async (): Promise<IBannerDocument[]> =>
  await getAllBannersQuery();

export {
  saveBannerService,
  updateBannerService,
  deleteBannerService,
  getActiveBannersService,
  getAllBannersService,
};
