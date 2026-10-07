import { Document, Types } from "mongoose";

export interface IAgentTHistory {
 agentId: Types.ObjectId | string;
 vendorId: Types.ObjectId | string;
 couponCount: number;
 amount: number;
}

export interface IAgentTHistoryDocument extends IAgentTHistory, Document {}
