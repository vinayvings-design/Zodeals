import {
  deleteTestimonialQuery,
  saveTestimonialQuery,
  updateTestimonialStatusQuery,
  viewTestimonialByStatusQuery,
} from "../Queries/Testimonial.Query.js";
import { notFound } from "../../commons/Utils/StatusCode.js";
import { findUserByEmailQuery } from "../Queries/User.Query.js";
import { findVendorByEmailQuery } from "../Queries/Vendor.Query.js";
import { error } from "../../commons/Exception/CustomException.js";
import { Types } from "mongoose";
interface TestimonialDetails {
  review?: string;
  rating?: number;
}
const saveTestimonialService = async (
  userName: string,
  testimonialDetails: TestimonialDetails
) => {
  try {
    const user =
      (await findUserByEmailQuery(userName)) ||
      (await findVendorByEmailQuery(userName));
     let userId = user?._id as Types.ObjectId;
    let testimonialData = {
      name: user?.name || "",
      email: userName,
      review: testimonialDetails.review || "",
      rating: testimonialDetails.rating || 5,
      image: user?.profile || "",
      userId: userId || "",
    };
    await saveTestimonialQuery(testimonialData);
    return testimonialDetails;
  } catch (error) {
    throw error;
  }
};

const getTestimonialsByStatusService = async (status:string) => {
  try {
    const testimonials = await viewTestimonialByStatusQuery(status);
    if(testimonials.length === 0){
      throw error(notFound, "Testimonials not found")
    }
    return testimonials;
  } catch (error) {
    throw error;
  }
};
const updateTestimonialStatusService = async (
  id: string,
  updatedData: { status: string }
) => {
  try {
    const { status } = updatedData;
    if (status === "rejected") {
      return await deleteTestimonialQuery(id);
    }
    const updatedTestimonial = await updateTestimonialStatusQuery(id, status);
    if (!updatedTestimonial) {
      throw error(notFound, "Testimonial not found");
    }
    return updatedTestimonial;
  } catch (error) {
    throw error;
  }
};

export {
  saveTestimonialService,
  getTestimonialsByStatusService,
  updateTestimonialStatusService,
};
