import { IAdmin } from "../Models/Admin/Admin.Interface.js";
import {
  findAdminByEmailQuery,
  findAdminQuery,
  saveAdminQuery,
} from "../Queries/Admin.Query.js";
import bcrypt from "bcrypt";
import { error } from "../../commons/Exception/CustomException.js";
import {
  badRequest,
  conflict,
  notFound,
} from "../../commons/Utils/StatusCode.js";
import { LoginDetails } from "../../commons/Interfaces/LoginDetails.interface.js";
import generateAuthToken from "../Middleware/Token.js";
import {
  findVendorByEmailQuery,
  getVendorCountQuery,
  saveVendorQuery,
  updateVendorByIdQuery,
} from "../Queries/Vendor.Query.js";
import {
  findAllUsersQuery,
  findAllVendorsQuery,
  findUserByEmailQuery,
  saveUserQuery,
  updateUserByIdQuery,
} from "../Queries/User.Query.js";
import { IUser, IUserDocument } from "../Models/User/User.Interface.js";
import { IVendor, IVendorDocument } from "../Models/Vendor/Vendor.Interface.js";
import { Types } from "mongoose";
import { sendVerificationEmail } from "../../commons/Utils/Email.js";
import NodeCache from "node-cache";
import { getAllCouponsQuery, getListOfCouponsQuery, viewAllCouponByStoreIdQuery } from "../Queries/Coupon.Query.js";
import { getStoreByVendorIdQuery } from "../Queries/Store.Query.js";
import { CouponModel } from "../Models/Coupon/Coupon.Model.js";
const cache = new NodeCache({ stdTTL: 300 });
async function generateCode(userId: string | Types.ObjectId) {
  const code = Math.floor(100000 + Math.random() * 900000);
  cache.set(`verifyCode:${userId}`, code);
  return code;
}
interface UserProfileInput {
  file?: { filename: string };
  body: Partial<IUser>;
}
interface VendorProfileInput {
  file?: { filename: string };
  body: Partial<IVendor>;
}
const saveAdminService = async (adminDetails: IAdmin): Promise<IAdmin> => {
  try {
    const existingAdmin = await findAdminQuery();
    if (existingAdmin) {
      throw error(conflict, "Admin already exist.");
    }
    const hashedPassword = await bcrypt.hash(adminDetails.password, 10);
    const saveAdmin = await saveAdminQuery({
      ...adminDetails,
      password: hashedPassword,
    });
    return saveAdmin;
  } catch (error) {
    throw error;
  }
};
const saveUserService = async (userDetails: IUser): Promise<IUserDocument> => {
  try {
    console.log(userDetails);

    const user = await findUserByEmailQuery(userDetails.email);
    if (user) {
      throw error(conflict, "This email already exist. Please enter another email.");
    }
    const vendor = await findVendorByEmailQuery(userDetails.email);
    if (vendor) {
      throw error(conflict, "This email already exist. Please enter another email.");
    }
    const hashedPassword = await bcrypt.hash(userDetails.password, 10);
    const savedUser = await saveUserQuery({
      ...userDetails,
      password: hashedPassword,
    });
    return savedUser;
  } catch (error) {
    throw error;
  }
};
const saveVendorService = async (
  vendorDetails: IVendor
): Promise<IVendorDocument> => {
  try {
    const user = await findUserByEmailQuery(vendorDetails.email);
    if (user) {
      throw error(conflict, "This email already exist. Please enter another email.");
    }
    const vendor = await findVendorByEmailQuery(vendorDetails.email);
    if (vendor) {
      throw error(conflict, "This email already exist. Please enter another email.");
    }
    const hashedPassword = await bcrypt.hash(vendorDetails.password, 10);
    const savedVendor = await saveVendorQuery({
      ...vendorDetails,
      password: hashedPassword,
    });
    return savedVendor;
  } catch (error) {
    throw error;
  }
};
const loginService = async (loginDetails: LoginDetails) => {
  try {
    const { email, password, role } = loginDetails;
    if (!role) {
      throw error(badRequest, "Role is required");
    }
    let user = null;
    switch (role) {
      case "admin":
        user = await findAdminByEmailQuery(email);
        break;
      case "vendor":
        user = await findVendorByEmailQuery(email);
        break;
      case "user":
        user = await findUserByEmailQuery(email);
        break;
      default:
        throw error(badRequest, "Invalid role");
    }
    if (!user) {
      throw error(badRequest, "Invalid email or password");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw error(badRequest, "Invalid email or password");
    }
    const token = await generateAuthToken(user.email);
    if (role === "vendor") {
      const vendor = user as IVendorDocument;
      return {
        token,
        role,
        is_store_created: vendor.is_store_created,
        is_first_time_user: vendor.is_first_time_user
      };
    }

    return { token, role };
  } catch (error) {
    throw error;
  }
};

const updateUserProfileService = async (
  userName: string,
  profileDetails: UserProfileInput
) => {
  try {
    const { file, body } = profileDetails;
    const user = await findUserByEmailQuery(userName);
    const userId = user?._id as Types.ObjectId;
    let updatedUserData: any = { ...body };
    if (file) {
      updatedUserData.profile = `/uploads/UserImages/${file.filename}`;
    }
    if (body.password) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      updatedUserData.password = hashedPassword;
    }
    const updatedUser = await updateUserByIdQuery(userId, updatedUserData);
    if (!updatedUser) {
      throw error(notFound, "Unable to update user profile.");
    }
    return updatedUser;
  } catch (error) {
    throw error;
  }
};
const updateVendorProfileService = async (
  userName: string,
  profileDetails: VendorProfileInput
) => {
  try {
    const { file, body } = profileDetails;
    const vendor = await findVendorByEmailQuery(userName);
    const vendorId = vendor?._id as Types.ObjectId;
    let updatedVendorData: any = { ...body };
    if (file) {
      updatedVendorData.profile = `/uploads/VendorImages/${file.filename}`;
    }
    if (body.password) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      updatedVendorData.password = hashedPassword;
    }
    const updatedVendor = await updateVendorByIdQuery(
      vendorId,
      updatedVendorData
    );
    if (!updatedVendor) {
      throw error(notFound, "Unable to update vendor profile.");
    }
    return updatedVendor;
  } catch (error) {
    throw error;
  }
};
const getProfileService = async (userName: string) => {
  try {
    const user =
      (await findUserByEmailQuery(userName)) ||
      (await findVendorByEmailQuery(userName));
    if (!user) {
      throw error(notFound, "Please login again.");
    }
    const { password, createdAt, updatedAt, __v, ...safeProfile } =
      user.toObject ? user.toObject() : user;

    return safeProfile;
  } catch (error) {
    throw error;
  }
};
const getDataForAdminDashboardService = async () => {
  try {
    let result = {
      postCount: 0,
      userCount: 0,
      vendorCount: 0,
      subscribedVendorCount: 0,
    };
    result.userCount = await findAllUsersQuery().then(users => users.length);
    result.vendorCount = await getVendorCountQuery()
    result.subscribedVendorCount = await getVendorCountQuery();
    result.postCount = await getAllCouponsQuery().then(coupons => coupons.length);
    return result;
  } catch (error) {
    throw error;
  }
};
const getListOfUserDetailsService = async () => {
  try {
    const users = await findAllUsersQuery();
    if (users.length === 0) {
      throw error(notFound, "No users found.");
    }
    return users;
  } catch (error) {
    throw error;
  }
};
const getListOfVendorDetailsService = async () => {
  try {
    const vendors = await findAllVendorsQuery();
    if (vendors.length === 0) {
      throw error(notFound, "No vendors found.");
    }
    return vendors;
  } catch (error) {
    throw error;
  }
};
const getDataForVendorDashboardService = async (userName: string) => {
  try {
    let result = {
      totalCouponsAdded: 0,
      activeCoupons: 0,
      expiredCoupons: 0,
      totalViews: 0,
      totalClicks: 0,
    };
    const vendor = await findVendorByEmailQuery(userName);
    if (!vendor) {
      throw error(notFound, "Please login again.");
    }
    const store = await getStoreByVendorIdQuery(vendor._id as Types.ObjectId);
    const nowStr = new Date().toISOString().slice(0, 19);
    if (store?._id) {
      const storeId = store._id;
      result.totalCouponsAdded = await CouponModel.countDocuments({
        storeId: storeId
      });
      result.activeCoupons = await CouponModel.countDocuments({
        storeId: storeId,
        status: "Active",
        paid: true,
        validFrom: { $lte: nowStr },
        validTill: { $gte: nowStr }
      });
      result.expiredCoupons = await CouponModel.countDocuments({
        storeId: storeId,
        $or: [
          { validTill: { $lt: nowStr } },
          { validFrom: { $gt: nowStr } },
          { status: { $ne: "Active" } }
        ]
      });
    }
    return result;
  } catch (error) {
    console.log(error)
  }
};
const getVendorChartService = async () => {
  try {
    let result = {
      totalVendor: 0,
      newRegistration: 0,
      activeCoupon: 0,
      expiredCoupon: 0,
    };
    result.totalVendor = await getVendorCountQuery();
    return result;
  } catch (error) {
    throw error;
  }
};
type SendCodeParams = { email: string; tag: string };
type VerifyCodeParams = { email: string; code: number; tag: string };

const sendCodeToEmailService = async ({
  email,
  role,
  tag,
}: {
  email: string;
  role: 'user' | 'vendor';
  tag: string;
}): Promise<number> => {
  try {
    let entity: any;

    if (tag === 'password') {
      if (role === 'user') {
        entity = await findUserByEmailQuery(email);
      } else if (role === 'vendor') {
        entity = await findVendorByEmailQuery(email);
      } else {
        throw new Error("Invalid role provided");
      }

      if (!entity) {
        throw error(badRequest, "Please enter your registered email.");
      }
    }

    const code = await generateCode(email);
    await sendVerificationEmail(email, code);
    return code;

  } catch (err) {
    console.log(err);
    throw err;
  }
};




const verifyCodeService = async ({
  email,
  code,
  tag,
}: VerifyCodeParams): Promise<string | Types.ObjectId> => {
  try {
    const storedCode = cache.get(`verifyCode:${email}`);
    if (!storedCode) {
      throw error(badRequest, "Code expired.");
    }
    if (storedCode !== code) {
      throw error(notFound, "Invalid code.");
    }
    if (tag === "password") {
      const user =
        (await findUserByEmailQuery(email)) ||
        (await findVendorByEmailQuery(email));
      if (!user) {
        throw error(badRequest, "Please enter your registered email.");
      }
      return user._id as Types.ObjectId;
    }
    return "Verified";
  } catch (error) {
    throw error;
  }
};
const forgotPasswordService = async ({
  userId,
  password,
}: {
  userId: string;
  password: string;
}) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser =
      (await updateUserByIdQuery(userId, { password: hashedPassword })) ||
      (await updateVendorByIdQuery(userId, { password: hashedPassword }));
    if (!updatedUser) {
      throw error(notFound, "Unable to reset password.");
    }

    return updatedUser;
  } catch (error) {
    throw error;
  }
};
export {
  saveAdminService,
  loginService,
  saveUserService,
  saveVendorService,
  updateUserProfileService,
  updateVendorProfileService,
  getProfileService,
  getDataForAdminDashboardService,
  getListOfUserDetailsService,
  getListOfVendorDetailsService,
  getDataForVendorDashboardService,
  getVendorChartService,
  sendCodeToEmailService,
  verifyCodeService,
  forgotPasswordService,
};
