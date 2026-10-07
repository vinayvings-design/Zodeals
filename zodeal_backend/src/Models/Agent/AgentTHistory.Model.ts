import mongoose, { Schema, Model } from "mongoose";
import { IAgentTHistoryDocument } from "./AgentTHistory.Interface.js";

const agentSchema = new Schema<IAgentTHistoryDocument>(
  {
   agentId:{
    type: Schema.Types.ObjectId,
    ref: "Agent",
    required: true
   } ,
   vendorId:{
    type: Schema.Types.ObjectId,
    ref: "Vendor",
    required: true
   } ,
    couponCount: { type: Number, required: true },
    amount: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const AgentTHistoryModel: Model<IAgentTHistoryDocument> = mongoose.model<IAgentTHistoryDocument>(
  "AgentTHistory",
  agentSchema
);
