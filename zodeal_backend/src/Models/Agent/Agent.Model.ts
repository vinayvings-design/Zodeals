import mongoose, { Schema, Model } from "mongoose";
import { IAgentDocument } from "./Agent.Interface.js";

const agentSchema = new Schema<IAgentDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: false },
    phoneNumber: { type: String, required: true, unique: false },
    code: { type: String, required: false, unique: false },
    pan: { type: String, required: false, },
    address: { type: String, required: false, },
    city: { type: String, required: false, },
    pincode: { type: String, required: false, },
    upi: { type: String, required: false, },
    reference: { type: String, required: false, },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: false,
    },
    marketingAmount: { type: Number, default: 0, required: false },
    vendorDetails: [
      {
        name: { type: String },
        amount: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const AgentModel: Model<IAgentDocument> = mongoose.model<IAgentDocument>(
  "Agent",
  agentSchema
);
