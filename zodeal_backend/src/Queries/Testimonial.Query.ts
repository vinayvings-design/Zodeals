import { Types } from "mongoose";
import { TestimonialModel } from "../Models/Testimonial/Testimonial.Model.js";
import {
  ITestimonial,
  ITestimonialDocument,
} from "../Models/Testimonial/Testimonial.Interface.js";

const saveTestimonialQuery = async (
  testimonialDetails: ITestimonial
): Promise<ITestimonialDocument> => {
  try {
    const newTestimonial = await new TestimonialModel(
      testimonialDetails
    ).save();
    return newTestimonial;
  } catch (error) {
    throw error;
  }
};

const viewTestimonialByStatusQuery = async (
  status: string
): Promise<ITestimonialDocument[]> => {
  try {
    const testimonials = await TestimonialModel.find({ status: status }).populate("userId");
    return testimonials;
  } catch (error) {
    throw error;
  }
};
const updateTestimonialStatusQuery = async (
  id: string,
  status: string
): Promise<ITestimonialDocument | null> => {
  try {
    const updatedTestimonial = await TestimonialModel.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );
    return updatedTestimonial;
  } catch (error) {
    throw error;
  }
};
const deleteTestimonialQuery = async (
  id: string
): Promise<ITestimonialDocument | null> => {
  try {
    const deletedTestimonial = await TestimonialModel.findByIdAndDelete(id);
    return deletedTestimonial;
  } catch (error) {
    throw error;
  }
};
export {
  saveTestimonialQuery,
  viewTestimonialByStatusQuery,
  updateTestimonialStatusQuery,
  deleteTestimonialQuery,
};
